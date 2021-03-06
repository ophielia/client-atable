import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import 'rxjs/add/operator/filter';
import {TagsService} from "./tags.service";
import {ContentType, TagTree} from './tagtree.object';
import {Subscription} from "rxjs/Subscription";
import {ITag} from "../model/tag";
import {Observable, of, pipe} from "rxjs";
import {map} from "rxjs/operators";
import TagType from "../model/tag-type";


@Injectable({providedIn: 'root'})
export class TagTreeService implements OnDestroy {
  static instance: TagTreeService;
  static refreshPeriod = 5 * 60 * 1000;

  loadingEvent: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  private isLoading: boolean = false;
  unsubscribe: Subscription[] = [];
  private _tagTree: TagTree;
  private _lastLoaded: number;

  constructor(private tagService: TagsService) {
    // If the static reference doesn't exist
    // (i.e. the class has never been instantiated before)
    // set it to the newly instantiated object of this class
    if (!TagTreeService.instance) {
      this.createOrRefreshTagTree();
      TagTreeService.instance = this;
    }

    // Return the static instance of the class
    // Which will only ever be the first instance
    // Due to the if statement above
    return TagTreeService.instance;
  }


  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  navigationList(tagId: string): Observable<ITag[]> {
    const returnWhenLoaded = pipe(
      map((tagTree: TagTree) => tagTree.navigationList(tagId))
    );

    return returnWhenLoaded(this.tagTree());
  }

  allContentList(id: string, contentType: ContentType, isAbbreviated: boolean, groupsOnly: boolean, tagTypes: TagType[]): Observable<ITag[]> {
    const returnWhenLoaded = pipe(
      map((tagTree: TagTree) => tagTree.contentList(id,contentType, isAbbreviated, groupsOnly, tagTypes))
    );

    return returnWhenLoaded(this.tagTree());
  }

  tagTree(): Observable<TagTree> {
    if (!this.isLoading) {
      return of(this._tagTree);
    }
    console.log("starting event listener")

    return this.loadingEvent.map(event => {
      return this._tagTree;
    })
  }

  private createOrRefreshTagTree() {
    this.isLoading = true;
    let sub$ = this.tagService.getAllExtended(true).subscribe((value) => {
      this._tagTree = new TagTree(value);
      this._lastLoaded = new Date().getTime();
      this.isLoading = false;
      this.loadingEvent.emit(false);
    });
    this.unsubscribe.push(sub$);
  }

  private tagTreeNeedsRefresh() {
    var limit = this._lastLoaded + TagTreeService.refreshPeriod;
    return (new Date().getTime()) > limit;
  }

  refreshTagTree() {
    this.createOrRefreshTagTree();
  }
}

import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {TagsService} from "../tags.service";
import {Tag} from "../model/tag";


@Component({
  selector: 'edit-site-view',
  templateUrl: './edit-tag.template.html'
})
export class PocEditTagComponent implements OnInit, OnDestroy {
  tagId: string;
  tagName: string;
  tag: Tag = {tag_id: "", name: "", description: "", tag_type: "", is_inverted: false};
  sub: any;
  private errorMessage: string;
  tagType: string[];


  constructor(private tagService: TagsService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.tagId = this.route.snapshot.params['id'];
    this.tagType = tagService.getTagTypes();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting tag with id: ', id);
      this.tagService
        .getById(id)
        .subscribe(p => this.tag = p);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    this.tagService.saveTag(this.tag)
      .subscribe(r => {
        console.log(`saved!!! ${JSON.stringify(this.tag)}`,
          e => this.errorMessage = e,
          this.goToList());
      });
  }

  goToList() {
    this.router.navigate(['/list']);
  }
}

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {Dish} from "../../model/dish";
import {TagDrilldown} from "../../model/tag-drilldown";
import {TagsService} from "../../services/tags.service";
import {ITag} from "../../model/tag";
import TagType from "../../model/tag-type";
import TagSelectType from "../../model/tag-select-type";

@Component({
  selector: 'at-dish-tag-select',
  templateUrl: './dish-tag-select.component.html',
})
export class DishTagSelectComponent implements OnInit, OnDestroy {
  @Output() tagSelected: EventEmitter<ITag> = new EventEmitter<ITag>();
  @Input() tagTypes: string;
  @Input() selectType: string = TagSelectType.Assign;


  name: string;
  dish: Dish = <Dish>{dish_id: "", name: "", description: ""};
  private errorMessage: string;
  currentSelect: string;
  selectedTag: TagDrilldown;
  expandFoldState: Map<string, boolean> = new Map<string, boolean>();
  includedTypes: Map<string, boolean> = new Map<string, boolean>();
  showAddTags: boolean;
  autoSelectedTag: any;

  allTagTypes: string[];
  allDrilldowns: { [type: string]: TagDrilldown[] } = {};
  lastSelectedId: string = "";
  alltags: ITag[];
  filteredTags: ITag[];

  isSearch = true;

  constructor(private tagService: TagsService) {
    this.allTagTypes = TagType.listAll();
  }

  ngOnInit() {
    for (var i = 0; i < this.allTagTypes.length; i++) {
      let ttype = this.allTagTypes[i];
      // get / fill tag lists here from service
      if (this.tagTypes.includes(ttype)) {
        this.includedTypes[ttype] = true;
        this.tagService
          .getTagDrilldownList(ttype)
          .subscribe(p => {
            this.allDrilldowns[ttype] = p
          });
      } else {
        this.includedTypes[ttype] = false;
      }
      this.expandFoldState[ttype] = false;
    }

    this.autoSelectedTag = null;
    this.currentSelect = this.selectType;
    this.getAllTags();

  }


  getAllTags() {
    this.tagService
      .getAllSelectable(this.tagTypes, this.selectType)
      .subscribe(p => {
          this.alltags = p;
          this.showAddTags = (this.alltags.length == 0);
        },
        e => this.errorMessage = e);

  }

  filterTags(event) {
    if (event.query) {
      if (this.alltags) {
        let filterBy = event.query.toLocaleLowerCase();
        this.filteredTags = this.alltags.filter((tag: ITag) =>
        tag.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
        this.showAddTags = this.filteredTags.length == 0;
      }
    } else {
      this.filteredTags = null;
    }
  }

  bingo(event) {
    this.tagSelected.emit(event);
    this.autoSelectedTag = null;
    this.filteredTags = [];
  }

  ngOnDestroy() {

  }

  showSelected(tag: ITag) {
    if (this.lastSelectedId != tag.tag_id) {
      this.lastSelectedId = tag.tag_id;
      console.log('showing from drilldown select container-' + tag.tag_id);
      this.autoSelectedTag = null;
      this.tagSelected.emit(tag);
    }
  }

  checkSearchEnter(el) {
    // when the user clicks on return from the search box
    // if only one tag is in the list, select this tag
    if (this.filteredTags.length == 1) {
      this.bingo(this.filteredTags[0]);
      if (el) {
        el.panelVisible = false;
      }
    }
  }

  expandFold(tagtype: string) {
    this.selectedTag = null;
    this.expandFoldState[tagtype] = !this.expandFoldState[tagtype];
  }

  isExpanded(tagtype: string) {
    return this.expandFoldState[tagtype];
  }

  isIncluded(tagtype: string) {
    return this.includedTypes[tagtype];
  }

  setSearch(isSearch: boolean) {
    this.isSearch = isSearch;
  }

  showSearch() {
    this.lastSelectedId = "";
    return this.isSearch;
  }

  add(tagType: string) {
    var tagName = this.autoSelectedTag;
    console.log("tag type is " + tagType);
    this.tagService.addTag(tagName, tagType)
      .subscribe(r => {
        console.log(`added!!! this.tagName`);
        this.autoSelectedTag = null;
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        this.tagService.getById(id)
          .subscribe(t => {
            this.showSelected(t);
          });

        this.getAllTags();
      });
  }
}

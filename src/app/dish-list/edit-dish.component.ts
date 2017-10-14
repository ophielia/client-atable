import {Component, OnDestroy, OnInit} from "@angular/core";
import {Dish} from "../model/dish";
import {ActivatedRoute, Router} from "@angular/router";
import {DishService} from "../dish-service.service";
import {TagDrilldown} from "../model/tag-drilldown";

@Component({
  selector: 'at-edit-dish',
  templateUrl: './edit-dish.component.html',
  styleUrls: ['./edit-dish.component.css']
})
export class EditDishComponent implements OnInit, OnDestroy {
  dishId: string;
  name: string;
  dish: Dish = <Dish>{dish_id: "", name: "", description: ""};
  sub: any;
  private errorMessage: string;
  selectedTag: TagDrilldown;


  constructor(private dishService: DishService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.dishId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.dishService
        .getById(id)
        .subscribe(p => this.dish = p);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  showTag(tag: TagDrilldown) {
    this.selectedTag = tag;
  }
  save() {
    this.dishService.saveDish(this.dish)
      .subscribe(r => {
        console.log(`saved!!! ${JSON.stringify(this.dish)}`,
          e => this.errorMessage = e,
          this.goToList());
      });
  }

  goToList() {
    this.router.navigate(['/dish/list']);
  }
}

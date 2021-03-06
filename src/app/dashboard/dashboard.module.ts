import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingPadComponent} from './landing-pad/landing-pad.component';
import {DishLandingComponent} from './dish-landing/dish-landing.component';
import {dashboardRouting} from "./dashboard.routes";
import {FormsModule} from "@angular/forms";
import {DishModule} from "../dish/dish.module";
import {ShoppingListModule} from "../shopping-list/shopping-list.module";
import {ShoppingListLandingComponent} from './shopping-list-landing/shopping-list-landing.component';
import {PlanLandingComponent} from './plan-landing/plan-landing.component';
import {NGXLogger} from "ngx-logger";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    dashboardRouting,
    DishModule,
    ShoppingListModule,
  ],
  providers: [NGXLogger],
  declarations: [LandingPadComponent, DishLandingComponent, ShoppingListLandingComponent, PlanLandingComponent]
})
export class DashboardModule {
}

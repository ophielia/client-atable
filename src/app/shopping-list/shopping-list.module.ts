import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ManageShoppingListComponent} from "./shopping-list-manage/shopping-list-manage.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {Angular2FontawesomeModule} from "angular2-fontawesome";
import {AppCommonModule} from "../app-common/app-common.module";
import {ShoppingListService} from "../services/shopping-list.service";
import {TagCommService} from "../legacy/drilldown/tag-drilldown-select.service";
import {shoppingListRouting} from "./shopping-list.routes";
import {EditShoppingListComponent} from "./edit-shopping-list/edit-shopping-list.component";
import {ShoppingListItemsComponent} from "./shopping-list-items/shopping-list-items.component";
import {AutoCompleteModule, CheckboxModule} from "primeng/primeng";
import {SingleListComponentComponent} from "./single-list-component/single-list-component.component";


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    shoppingListRouting,
    Angular2FontawesomeModule,
    AppCommonModule,
    AutoCompleteModule,
    CheckboxModule

  ],
  providers: [ShoppingListService, TagCommService],
  declarations: [ManageShoppingListComponent, EditShoppingListComponent,
    ShoppingListItemsComponent, SingleListComponentComponent]
})
export class ShoppingListModule {
}

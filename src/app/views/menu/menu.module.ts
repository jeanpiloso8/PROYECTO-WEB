import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import { MenuRoutingModule } from './menu-routing.module';
import { DropDownListModule, DropDownListAllModule  } from '@syncfusion/ej2-angular-dropdowns';
import { ListadoMenuComponent } from './listado-menu/listado-menu.component'
import { NuevoMenuComponent } from './nuevo-menu/nuevo-menu.component'
import { ModificarMenuComponent } from './modificar-menu/modificar-menu.component'
import { FormularioMenuComponent } from './formulario-menu/formulario-menu.component'
import { PageService, SortService, FilterService, EditService, ToolbarService ,CommandColumnService } from '@syncfusion/ej2-angular-treegrid';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { ToolbarModule  } from '@syncfusion/ej2-angular-navigations';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownTreeModule } from '@syncfusion/ej2-angular-dropdowns';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';

import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule as GridCoreUI,
  ButtonGroupModule,
  HeaderModule,
  BadgeModule,
  SpinnerModule,
} from '@coreui/angular';


@NgModule({
  declarations: [ListadoMenuComponent, NuevoMenuComponent, ModificarMenuComponent, FormularioMenuComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MenuRoutingModule,
    TreeGridModule,
    GridCoreUI,
    DropDownListModule,
    DropDownListAllModule,
    CardModule,     
    ButtonModule,
    FormModule,
    ButtonGroupModule,
    DropDownTreeModule,
    HeaderModule,
    BadgeModule,
    SpinnerModule,
    ToolbarModule,
    TextBoxModule,
    MultiSelectModule
  ],
  providers: [
    PageService, 
    SortService, 
    FilterService, 
    EditService,
    ToolbarService ,
    CommandColumnService
  ]
})
export class MenuModule { }

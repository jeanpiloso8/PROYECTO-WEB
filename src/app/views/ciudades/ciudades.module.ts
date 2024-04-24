import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditService, ToolbarService, PageService, SortService, GridModule,CommandColumnService ,ColumnChooserService  } from '@syncfusion/ej2-angular-grids';
import { ListadoCiudadesComponent } from './listado-ciudades/listado-ciudades.component';
import { NuevaCiudadComponent } from './nueva-ciudad/nueva-ciudad.component';
import { ModificarCiudadComponent } from './modificar-ciudad/modificar-ciudad.component';
import { FormularioCiudadComponent } from './formulario-ciudad/formulario-ciudad.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { IconModule } from '@coreui/icons-angular';
import { ReactiveFormsModule} from '@angular/forms';
import { ToolbarModule  } from '@syncfusion/ej2-angular-navigations';
import { ButtonModule as ButtonModuleSyncfusion } from '@syncfusion/ej2-angular-buttons';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

import {
  ButtonModule,
  CardModule,
  FormModule,
  ButtonGroupModule,
  GridModule as GridCoreUI
} from '@coreui/angular';
import { CiudadesRoutingModule } from './ciudades-routing.module';


@NgModule({
  declarations: [
    ListadoCiudadesComponent,
    NuevaCiudadComponent,
    ModificarCiudadComponent,
    FormularioCiudadComponent
  ],
  imports: [
    CommonModule,
    CiudadesRoutingModule,
    GridModule,
    ButtonModule,
    CardModule,
    FormModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    ButtonModuleSyncfusion,
    GridCoreUI,
    IconModule,
    ToolbarModule,
    DropDownListModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [
    EditService,
    ToolbarService,
    PageService,
    SortService,
    CommandColumnService,
    ColumnChooserService
  ]
})
export class CiudadesModule { }

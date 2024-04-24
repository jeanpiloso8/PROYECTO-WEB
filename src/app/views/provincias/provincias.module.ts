import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditService, ToolbarService, PageService, SortService, GridModule,CommandColumnService ,ColumnChooserService  } from '@syncfusion/ej2-angular-grids';
import { ListadoProvinciasComponent } from './listado-provincias/listado-provincias.component';
import { NuevaProvinciaComponent } from './nueva-provincia/nueva-provincia.component';
import { ModificarProvinciaComponent } from './modificar-provincia/modificar-provincia.component';
import { FormularioProvinciaComponent } from './formulario-provincia/formulario-provincia.component';
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
import { ProvinciasRoutingModule } from './provincias-routing.module';


@NgModule({
  declarations: [ListadoProvinciasComponent,
    NuevaProvinciaComponent,
    ModificarProvinciaComponent,
    FormularioProvinciaComponent
  ],
  imports: [
    CommonModule,
    ProvinciasRoutingModule,
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
export class ProvinciasModule { }

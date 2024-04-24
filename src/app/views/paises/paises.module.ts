import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditService, ToolbarService, PageService, SortService, GridModule,CommandColumnService ,ColumnChooserService  } from '@syncfusion/ej2-angular-grids';
import { ListadoPaisesComponent } from './listado-paises/listado-paises.component';
import { NuevoPaisComponent } from './nuevo-pais/nuevo-pais.component';
import { ModificarPaisComponent } from './modificar-pais/modificar-pais.component';
import { FormularioPaisComponent } from './formulario-pais/formulario-pais.component';
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

import { PaisesRoutingModule } from './paises-routing.module';


@NgModule({
  declarations: [ListadoPaisesComponent,NuevoPaisComponent,ModificarPaisComponent,FormularioPaisComponent],
  imports: [
    CommonModule,
    PaisesRoutingModule,
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
export class PaisesModule { }

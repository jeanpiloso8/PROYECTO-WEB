import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesRoutingModule } from './roles-routing.module';
import { EditService, ToolbarService, PageService, SortService, GridModule,CommandColumnService  } from '@syncfusion/ej2-angular-grids';
import { ListadoRolesComponent } from './listado-roles/listado-roles.component';
import { NuevoRolComponent } from './nuevo-rol/nuevo-rol.component';
import { ModificarRolComponent } from './modificar-rol/modificar-rol.component';
import { FormularioRolComponent } from './formulario-rol/formulario-rol.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { IconModule } from '@coreui/icons-angular';
import { ReactiveFormsModule} from '@angular/forms';
import { ToolbarModule  } from '@syncfusion/ej2-angular-navigations';
import { ButtonModule as ButtonModuleSyncfusion } from '@syncfusion/ej2-angular-buttons';

import {
  ButtonModule,
  CardModule,
  FormModule,
  ButtonGroupModule,
  GridModule as GridCoreUI
} from '@coreui/angular';

@NgModule({
  declarations: [ListadoRolesComponent, NuevoRolComponent, ModificarRolComponent, FormularioRolComponent ],
  imports: [
    CommonModule,
    RolesRoutingModule,
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
    SweetAlert2Module.forRoot()
  ],
  providers: [
    EditService,
    ToolbarService,
    PageService,
    SortService,
    CommandColumnService
  ]
})
export class RolesModule { }

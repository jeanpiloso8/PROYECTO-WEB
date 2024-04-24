import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { EditService, ToolbarService, PageService, SortService, GridModule,CommandColumnService  } from '@syncfusion/ej2-angular-grids';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';
import { ModificarUsuarioComponent } from './modificar-usuario/modificar-usuario.component';
import { FormularioUsuarioComponent } from './formulario-usuario/formulario-usuario.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { IconModule } from '@coreui/icons-angular';
import { ReactiveFormsModule} from '@angular/forms';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToolbarModule  } from '@syncfusion/ej2-angular-navigations';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { ChipListModule } from '@syncfusion/ej2-angular-buttons';

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
  declarations: [ListadoUsuariosComponent, NuevoUsuarioComponent,ModificarUsuarioComponent,FormularioUsuarioComponent,SetPasswordComponent ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    GridModule,
    ButtonModule,
    CardModule,
    HeaderModule,
    FormModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    NgOptionHighlightModule,
    NgSelectModule,
    IconModule,
    CardModule,
    BadgeModule,
    GridCoreUI,
    ToolbarModule,
    MultiSelectModule,
    ChipListModule,
    SpinnerModule,
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


export class UsuariosModule { }

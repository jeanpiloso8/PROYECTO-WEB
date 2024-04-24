import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { ListadoCiudadesComponent } from './listado-ciudades/listado-ciudades.component';
import { NuevaCiudadComponent } from './nueva-ciudad/nueva-ciudad.component';
import { ModificarCiudadComponent } from './modificar-ciudad/modificar-ciudad.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ciudades'
    },
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'listado'
      },
      {
        path: 'listado',
        component: ListadoCiudadesComponent,
        data: {
          title: 'Listado'
        }
      }
      ,
      {
        path: 'nuevo',
        component: NuevaCiudadComponent,
        data: {
          title: 'Nuevo'
        }
      }
      ,
      {
        path: 'modificar/:id',
        component: ModificarCiudadComponent,
        data: {
          title: 'Modificar'
        }
      }
    ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CiudadesRoutingModule { }

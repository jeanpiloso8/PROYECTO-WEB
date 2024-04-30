import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoRuteroComponent } from './listado-rutero/listado-rutero.component';
import { ModificaRuteroComponent } from './modifica-rutero/modifica-rutero.component';
import { NuevoRuteroComponent } from './nuevo-rutero/nuevo-rutero.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Rutas'
    },
   // canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'listado'
      },
      {
        path: 'listado',
        component: ListadoRuteroComponent,
        data: {
          title: 'Listado'
        }
      }
      ,
      {
        path: 'nuevo',
        component: NuevoRuteroComponent,
        data: {
          title: 'Nuevo'
        }
      }
      ,
      {
        path: 'modifica/:id',
        component: ModificaRuteroComponent,
        data: {
          title: 'Modificar'
        }
      }
      ,
    ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuteroVendedorRoutingModule { }

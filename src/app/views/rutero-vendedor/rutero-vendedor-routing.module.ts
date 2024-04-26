import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoRuteroComponent } from './listado-rutero/listado-rutero.component';

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
    ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuteroVendedorRoutingModule { }

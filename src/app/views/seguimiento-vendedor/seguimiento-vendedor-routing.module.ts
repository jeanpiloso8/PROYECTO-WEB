import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoSeguimientoComponent } from './listado-seguimiento/listado-seguimiento.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'seguimiento'
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
        component: ListadoSeguimientoComponent,
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
export class SeguimientoVendedorRoutingModule { }

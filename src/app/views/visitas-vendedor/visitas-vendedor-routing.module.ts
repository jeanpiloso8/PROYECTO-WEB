import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoVisitasComponent } from './listado-visitas/listado-visitas.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Visitas Vendedor'
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
        component: ListadoVisitasComponent,
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
export class VisitasVendedorRoutingModule { }

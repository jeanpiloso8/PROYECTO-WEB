import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './containers/default-layout';
import { LoginComponent } from './views/pages/login/login.component';
import { Page401Component } from './views/pages/page401/page401.component';
import { Page403Component } from './views/pages/page403/page403.component';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { AuthGuard } from '../app/core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'usuario',
        loadChildren: () => import('./views/usuarios/usuarios.module').then((m) => m.UsuariosModule)
      },
      {
        path: 'rol',
        loadChildren: () => import('./views/roles/roles.module').then((m) => m.RolesModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('./views/menu/menu.module').then((m) => m.MenuModule)
      },
      {
        path: 'pais',
        loadChildren: () => import('./views/paises/paises.module').then((m) => m.PaisesModule)
      },
      {
        path: 'provincia',
        loadChildren: () => import('./views/provincias/provincias.module').then((m) => m.ProvinciasModule)
      },
      {
        path: 'ciudad',
        loadChildren: () => import('./views/ciudades/ciudades.module').then((m) => m.CiudadesModule)
      },
      {
        path: 'puerto',
        loadChildren: () => import('./views/puertos/puertos.module').then((m) => m.PuertosModule)
      },
      {
        path: 'seguimiento',
        loadChildren: () => import('./views/seguimiento-vendedor/seguimiento-vendedor.module').then((m) => m.SeguimientoVendedorModule)
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '401',
    component: Page401Component,
    data: {
      title: 'Error 401'
    }
  },
  {
    path: '403',
    component: Page403Component,
    data: {
      title: 'Error 403'
    }
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Error 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Error 500'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
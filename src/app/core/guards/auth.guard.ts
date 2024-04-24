
import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SecurityService } from '../services/security.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard{


  private readonly securityService = inject(SecurityService);
  private readonly router = inject(Router);

  constructor() {}


  private redirectTo401ThenLogin(redirectURL: string): void {
    this.router.navigate(['/401']).then(() => {
      setTimeout(() => {
        this.router.navigate(['/login'], { queryParams: { 'redirectURL': redirectURL } });
      }, 5000); // Ajusta este tiempo como sea necesario
    });
  }

  private checkLoginAndRedirect(isOnline: boolean, state: RouterStateSnapshot): boolean | UrlTree {
    // Si el usuario no está logueado, redirige a la página 401 y luego al login.
    if (!this.securityService.isLoggedIn()) {
      this.redirectTo401ThenLogin(state.url);
      // Se devuelve false para bloquear la navegación actual mientras se espera la redirección.
      return false;
    }
    else if (!isOnline) {
      return true;
    }
    return true;
  }

    canActivate(
      route: ActivatedRouteSnapshot, 
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.securityService.checkServerStatus().pipe(
      map(isOnline => this.checkLoginAndRedirect(isOnline, state))
    );
  }

    canActivateChild(
      route: ActivatedRouteSnapshot, 
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(route, state); // Reutiliza canActivate para canActivateChild
  }
}
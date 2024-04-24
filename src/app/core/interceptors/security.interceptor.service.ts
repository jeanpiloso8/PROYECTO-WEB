import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { ModalStateService } from '../../core/services/modal-state.service'

@Injectable({
  providedIn: 'root'
})
export class SecurityInterceptorService implements HttpInterceptor {

  private readonly router = inject(Router);
  private readonly securityService = inject(SecurityService);
  private readonly modalStateService = inject(ModalStateService);

  constructor() {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.securityService.getToken();
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 0) {
              //Para errores de red o CORS (estado 0), devuelves un nuevo Error con un mensaje personalizado
              const customError = new Error('No se puede establecer conexión con el servidor. Por favor, verifica tu conexión a internet o contacta con soporte técnico.');
              customError.name = "ConnectionError"; // Puedes establecer un nombre de error personalizado si lo necesitas
              return throwError(() => customError);
        }
        else if (error instanceof HttpErrorResponse) {          
          this.handleHttpErrorResponse(error);
        } else {
          console.error('Something else happened', error);
        }
        return throwError(() => error);
      })
    );
  }


  private handleHttpErrorResponse(error: HttpErrorResponse): void {
    const isModalOpen = this.modalStateService.isModalOpen;


    const redirectMap: { [key: number]: string } = {
      401: '/401',
      403: '/403',
      404: '/404',
      500: '/500'
    };

    const redirectPath = redirectMap[error.status];
    if (redirectPath) {
      this.router.navigate([redirectPath]).then(() => {
        if (error.status === 401) {

          if (isModalOpen) {
            this.modalStateService.closeModals(); // Supongamos que este método cierra los modales
          }
          
          setTimeout(() => this.router.navigate(['/login']), 5000);
        }
      });
    } else {
      console.error('Unhandled error', error);
    }
}


}

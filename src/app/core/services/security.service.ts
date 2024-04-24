import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequestDto} from '../models/security'
import { Observable, of  } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private readonly httpClient = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);

  apiURL = environment.apiURL + 'auth';
  private readonly tokenKey = 'token';
  private readonly username = 'username';

  constructor() {

   }


  getToken(){

    return localStorage.getItem(this.tokenKey);
  }


  getUserName(){
    return localStorage.getItem(this.username);
  }



  isLoggedIn(): boolean{

    const token = localStorage.getItem(this.tokenKey);

    if (!token){
      return false;
    }
    return true;
  }

  saveSession(result: any){
    
    localStorage.setItem(this.username, result.user.userName);
    localStorage.setItem(this.tokenKey, result.token);
  }

  
  login(credenciales: LoginRequestDto): Observable<any>
  { 
    return this.httpClient.post<any>(this.apiURL + '/login', credenciales);
  }


  logout(){
    localStorage.removeItem(this.tokenKey);
  }


  checkServerStatus(): Observable<boolean> {
    return this.httpClient.get(this.apiURL+ '/checkServerStatus', { responseType: 'text' })
      .pipe(
        map(() => true),
        catchError(error => {
          this.notificationService.showServerError(); // Mostrar notificación de error
          return of(false);
        })
      );
  }


}

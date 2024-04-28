import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RuteroVendedorService {
  apiURL = environment.apiURL + 'Rutero';

  constructor(private httpClient: HttpClient) { }

  public CabRura(vendedor:string,dfecha:string,hfecha:string): Observable<any>{
    return this.httpClient.get<any>(`${this.apiURL+ '/cruta'}/${vendedor}/${dfecha}/${hfecha}`);
  }
  public DetRura(vendedor:string,dfecha:string,hfecha:string): Observable<any>{
    return this.httpClient.get<any>(`${this.apiURL+ '/druta'}/${vendedor}/${dfecha}/${hfecha}`);
  }

}

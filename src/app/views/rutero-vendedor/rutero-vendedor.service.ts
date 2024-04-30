import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class RuteroVendedorService {
  apiURL = environment.apiURL + 'Rutero';

  constructor(private httpClient: HttpClient) { }

  public CabRura(vendedor:string,dfecha:string,hfecha:string): Observable<any>{
    return this.httpClient.get<any>(`${this.apiURL+ '/cruta'}/${vendedor}/${dfecha}/${hfecha}`);
  }
  public DetRuta(vendedor:string,dfecha:string,hfecha:string): Observable<any>{
    return this.httpClient.get<any>(`${this.apiURL+ '/druta'}/${vendedor}/${dfecha}/${hfecha}`);
  }
  public DetRutaID(id:string): Observable<any>{
    return this.httpClient.get<any>(`${this.apiURL+ '/rutaid'}/${id}`);
  }
  public GetSecuencial ():Observable<number>{
    const purl= `${this.apiURL}/secuencial`;
    return this.httpClient.get<number>(purl);  
  }
  public crearRuta (data : any):Observable<any>{
    const purl= `${this.apiURL}/postRutas`;
    return this.httpClient.post<any>(purl,data,httpOptions);
  }
 
}

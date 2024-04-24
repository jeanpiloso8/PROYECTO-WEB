import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { environmentVendedor } from '../../../environments/environment.development';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = '/WebService/ApiGeneral.php'; 
  constructor(private http : HttpClient) { }

  obtener(data: any):Observable<any>{
    return this.http.post<any>(this.apiUrl,data,httpOptions);
  }
}

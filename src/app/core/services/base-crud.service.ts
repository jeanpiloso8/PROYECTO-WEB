import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable , inject} from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseCrudService {

  protected apiURL: string;

  constructor(protected httpClient: HttpClient, resourcePath: string) {
    this.apiURL = `${environment.apiURL}${resourcePath}`;
  }

  public todos(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL);
  }

  public consultaId(id: any): Observable<any> {
    return this.httpClient.get<any>(`${this.apiURL}/${id}`);
  }

  public crear(resource: any): Observable<any> {
    return this.httpClient.post(this.apiURL, resource);
  }

  public editar(id: any, resource: any): Observable<any> {
    return this.httpClient.put(`${this.apiURL}/${id}`, resource);
  }

  public borrar(id: any): Observable<any> {
    return this.httpClient.delete(`${this.apiURL}/${id}`);
  }


}

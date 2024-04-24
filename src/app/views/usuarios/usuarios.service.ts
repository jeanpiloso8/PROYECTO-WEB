import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private readonly username = 'username';
  apiURL = environment.apiURL + 'user';
  menu = environment.menu;

  constructor(private httpClient: HttpClient) { }

  public todos(): Observable<any>{
    return this.httpClient.get<any>(`${this.apiURL}`);
  }

  public consultaId(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiURL}/${id}`);
  }

  public crear(usuario: any) {
    return this.httpClient.post(this.apiURL, usuario);
  }

  public newPassword(id: string, user: any){
    return this.httpClient.put(`${this.apiURL+ '/newPassword'}/${id}`, user);
  }

  public setPassword(id: string, user: any){
    return this.httpClient.put(`${this.apiURL+ '/setPassword'}/${id}`, user);
  }

  public borrar(id: string) {
    return this.httpClient.delete(`${this.apiURL}/${id}`);
  }
  
  public editar(id: string, user: any){
    return this.httpClient.put(`${this.apiURL}/${id}`, user);
  }

  
  getMenuUsuario(): Observable<any>{
    let params = new HttpParams();
     params = params.append('username',this.getUserName());
     params = params.append('menu_id', this.menu);
     return this.httpClient.get<any>(this.apiURL + '/getMenuUsuario', {observe: 'response', params});
  }

  getProfilePic(): Promise<ArrayBuffer> {
    const observable = this.httpClient.get(this.apiURL + '/getProfilePic', { responseType: 'arraybuffer' });
    return firstValueFrom(observable);
  };

  public changeProfilePic(file: any){

    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', file.type);
    
    return this.httpClient.put(this.apiURL+'/changeProfilePic', formData,  { headers: headers });
  };

  public changePassword(changePassword: any){
    return this.httpClient.put(`${this.apiURL+ '/changePassword'}`, changePassword);
  }

  getUserName(): any{
    return localStorage.getItem(this.username);
  }
  
}

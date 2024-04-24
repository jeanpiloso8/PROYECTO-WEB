import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../core/services/base-crud.service'

@Injectable({
  providedIn: 'root'
})
export class PaisesService extends BaseCrudService {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'pais');
  }
}
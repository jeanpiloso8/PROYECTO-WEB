import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommandModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import {DetMultimedia } from './../models/DetMultimedia';
@Component({
  selector: 'app-listado-imagenes',
  templateUrl: './listado-imagenes.component.html',
  styleUrl: './listado-imagenes.component.scss'
})
export class ListadoImagenesComponent implements OnInit {
  @Input() modelo: any;
  @Input() id: any;
  private readonly activeModal = inject(NgbActiveModal);
  public toolbar?: ToolbarItems[] | object;
  public commands?: CommandModel[];
  public usernamerules = { required: true };
  public editparams = { params: { popupHeight: '500px' }};
  public pageOption: Object;
 dataImg : DetMultimedia[] = [];
  ngOnInit(): void {
    this.dataImg = this.modelo;
    this.pageOption = {pageCount: 5, pageSize:10};
  }

  cerrar() {
    this.activeModal.close(); // O usar .close() según corresponda
  }
}

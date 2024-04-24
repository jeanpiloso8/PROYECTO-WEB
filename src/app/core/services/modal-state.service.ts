import { Injectable, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
  providedIn: 'root'
})
export class ModalStateService {

  private readonly modalService = inject(NgbModal);
  private _isModalOpen = false;

  constructor() {}

  get isModalOpen(): boolean {
    return this._isModalOpen;
  }

  setModalOpen(state: boolean): void {
    this._isModalOpen = state;
  }

  closeModals() {
    this.modalService.dismissAll();
  }
}

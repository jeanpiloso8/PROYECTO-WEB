import { Injectable } from '@angular/core';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';


@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor() {}

  createGlobalSpinner() {
    createSpinner({
      target: document.querySelector('#global-spinner-container')!,
    });
  }

  showGlobalSpinner() {
    showSpinner(document.querySelector('#global-spinner-container')!);
  }

  hideGlobalSpinner() {
    hideSpinner(document.querySelector('#global-spinner-container')!);
  }
}

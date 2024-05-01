import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TipoAccion } from 'src/app/shared-features/enums/TipoAccion';
import { cadenaErrores } from 'src/app/shared-features/utilities/parsearErrores';

@Component({
  selector: 'app-visualizar-rutero',
  templateUrl: './visualizar-rutero.component.html',
  styleUrl: './visualizar-rutero.component.scss'
})
export class VisualizarRuteroComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);
  idRuta :number;
  errores: string[] = [];
  public StateEnum = TipoAccion.Read;
  ngOnInit(): void {
    //this.spinnerService.showGlobalSpinner();
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.idRuta=params['id'];
      },
      error: (error) => {
      //  this.spinnerService.hideGlobalSpinner();
        this.toastr.error(cadenaErrores(error))
      }
    });
  }
}


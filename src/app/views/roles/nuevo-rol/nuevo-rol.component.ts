import { Component, inject } from '@angular/core';
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { Router } from '@angular/router';
import { RolesService } from '../roles.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../core/services/spinner.service';

@Component({
  selector: 'app-nuevo-rol',
  templateUrl: './nuevo-rol.component.html',
  styleUrl: './nuevo-rol.component.scss'
})
export class NuevoRolComponent {

  private readonly toastr = inject(ToastrService);
  private readonly rolService = inject(RolesService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly router = inject(Router);

  public StateEnum = TipoAccion.Create;
  

  constructor() { }

  guardarCambios(data: any) {
    this.spinnerService.showGlobalSpinner();
    this.rolService.crear(data).subscribe({
      next: (respuesta: any) => {
        this.spinnerService.hideGlobalSpinner();
        if (respuesta.isSuccess && respuesta.isSuccess==true) {

          this.toastr.success('Acción exitosa');
          this.router.navigate(['/rol']);
        }
        else {
          this.toastr.error(cadenaErrores(respuesta.message));
        }

        
      },
      error: (error) => {
        this.spinnerService.hideGlobalSpinner();
        this.toastr.error(cadenaErrores(error));
      }
    });
  }

}

import { Component , inject} from '@angular/core';
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { Router } from '@angular/router';
import { CiudadesService } from '../ciudades.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { SpinnerService } from '../../../core/services/spinner.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-nueva-ciudad',
  templateUrl: './nueva-ciudad.component.html',
  styleUrl: './nueva-ciudad.component.scss'
})
export class NuevaCiudadComponent {

  private readonly router = inject(Router);
  private readonly ciudadService = inject(CiudadesService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly toastr = inject(ToastrService);

  StateEnum = TipoAccion.Create;
  errores: string;
  padre_id: null;

  
guardarCambios(data: any) {
  this.spinnerService.showGlobalSpinner();
  this.ciudadService.crear(data).subscribe({
    next: (respuesta: any) => {
      this.spinnerService.hideGlobalSpinner();
      if (respuesta.isSuccess && respuesta.isSuccess==true) {

        this.toastr.success('Acción exitosa');
        this.router.navigate(['/ciudad']);
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

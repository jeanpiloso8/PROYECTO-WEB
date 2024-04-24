import { Component , inject} from '@angular/core';
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { Router } from '@angular/router';
import { ProvinciasService } from '../provincias.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { SpinnerService } from '../../../core/services/spinner.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nueva-provincia',
  templateUrl: './nueva-provincia.component.html',
  styleUrl: './nueva-provincia.component.scss'
})
export class NuevaProvinciaComponent {

  
  private readonly router = inject(Router);
  private readonly provinciasService = inject(ProvinciasService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly toastr = inject(ToastrService);

  StateEnum = TipoAccion.Create;
  errores: string;
  padre_id: null;

  
guardarCambios(data: any) {
  this.spinnerService.showGlobalSpinner();
  this.provinciasService.crear(data).subscribe({
    next: (respuesta: any) => {
      this.spinnerService.hideGlobalSpinner();
      if (respuesta.isSuccess && respuesta.isSuccess==true) {

        this.toastr.success('Acción exitosa');
        this.router.navigate(['/provincia']);
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

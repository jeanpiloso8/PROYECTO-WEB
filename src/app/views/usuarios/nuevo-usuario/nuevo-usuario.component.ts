import { Component , inject} from '@angular/core';
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { Router } from '@angular/router';
import { UsuariosService } from '../usuarios.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { SpinnerService } from '../../../core/services/spinner.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.scss'
})
export class NuevoUsuarioComponent {

  private readonly router = inject(Router);
  private readonly usuarioService = inject(UsuariosService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly toastr = inject(ToastrService);

  public StateEnum = TipoAccion.Create;
  public errores: string;

  constructor() { }


guardarCambios(data: any) {
  this.spinnerService.showGlobalSpinner();
  this.usuarioService.crear(data).subscribe({
    next: (respuesta: any) => {
      this.spinnerService.hideGlobalSpinner();
      if (respuesta.isSuccess && respuesta.isSuccess==true) {

        this.toastr.success('Acción exitosa');
        this.router.navigate(['/usuario']);
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

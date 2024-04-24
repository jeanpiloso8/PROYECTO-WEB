import { Component , inject} from '@angular/core';
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { Router } from '@angular/router';
import { MenuService } from '../menu.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { SpinnerService } from '../../../core/services/spinner.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nuevo-menu',
  templateUrl: './nuevo-menu.component.html',
  styleUrl: './nuevo-menu.component.scss'
})
export class NuevoMenuComponent {

  private readonly router = inject(Router);
  private readonly menuService = inject(MenuService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly toastr = inject(ToastrService);

  StateEnum = TipoAccion.Create;
  errores: string;
  padre_id: null;

  
guardarCambios(data: any) {
  this.spinnerService.showGlobalSpinner();
  this.menuService.crear(data).subscribe({
    next: (respuesta: any) => {
      this.spinnerService.hideGlobalSpinner();
      if (respuesta.isSuccess && respuesta.isSuccess==true) {

        this.toastr.success('Acción exitosa');
        this.router.navigate(['/menu']);
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

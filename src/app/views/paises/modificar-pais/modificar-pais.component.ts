import { Component , inject} from '@angular/core';
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { Router, ActivatedRoute } from '@angular/router';
import { PaisesService } from '../paises.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { SpinnerService } from '../../../core/services/spinner.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-modificar-pais',
  templateUrl: './modificar-pais.component.html',
  styleUrl: './modificar-pais.component.scss'
})
export class ModificarPaisComponent {

  private readonly router = inject(Router);
  private readonly paisService = inject(PaisesService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly toastr = inject(ToastrService);
  private readonly activatedRoute = inject(ActivatedRoute);

  modelo: any;
  StateEnum = TipoAccion.Update;
  errores: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.paisService.consultaId(params['id'])
          .subscribe({
            next: (respuesta) => {              
              if(respuesta.isSuccess == true)
                {
                  this.modelo = respuesta.result;
                }              
            },
            error: () => this.router.navigate(['/pais'])
          });
      },
      error: (error) => {
        this.toastr.error(cadenaErrores(error))
      }
    });
  }

  guardarCambios(data: any) {
    this.spinnerService.showGlobalSpinner();
    this.paisService.editar(this.modelo.idPais,data).subscribe({
      next: (respuesta: any) => {
        this.spinnerService.hideGlobalSpinner();
        if (respuesta.isSuccess && respuesta.isSuccess==true) {
  
          this.toastr.success('Acción exitosa');
          this.router.navigate(['/pais']);
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

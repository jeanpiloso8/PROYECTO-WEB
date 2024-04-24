import { Component, inject, OnInit } from '@angular/core';
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { Router, ActivatedRoute } from '@angular/router';
import { RolesService } from '../roles.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../core/services/spinner.service';

@Component({
  selector: 'app-modificar-rol',
  templateUrl: './modificar-rol.component.html',
  styleUrl: './modificar-rol.component.scss'
})
export class ModificarRolComponent  implements OnInit {

  private readonly toastr = inject(ToastrService);
  private readonly rolService = inject(RolesService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  
  public modelo: any;
  public StateEnum = TipoAccion.Update;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.rolService.consultaId(params['id'])
          .subscribe({
            next: (respuesta) => {              
              if(respuesta.isSuccess == true)
                {
                  this.modelo = respuesta.result;
                }              
            },
            error: () => this.router.navigate(['/rol'])
          });
      },
      error: (error) => {
        this.toastr.error(cadenaErrores(error))
      }
    });
  }

  guardarCambios(data: any) {
    this.spinnerService.showGlobalSpinner();
    this.rolService.editar(this.modelo.id,data).subscribe({
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

import { Component, inject, OnInit } from '@angular/core';
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../usuarios.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../core/services/spinner.service';


@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrl: './modificar-usuario.component.scss'
})
export class ModificarUsuarioComponent  implements OnInit  {

  private readonly toastr = inject(ToastrService);
  private readonly userService = inject(UsuariosService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public modelo: any;
  public StateEnum = TipoAccion.Update;


  ngOnInit(): void {
    this.spinnerService.showGlobalSpinner();
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.userService.consultaId(params['id'])
          .subscribe({
            next: (respuesta) => {    
              this.spinnerService.hideGlobalSpinner();          
              if(respuesta.isSuccess == true)
                {
                  this.modelo = respuesta.result;
                }              
            },
            error: () => this.router.navigate(['/usuario'])
          });
      },
      error: (error) => {
        this.spinnerService.hideGlobalSpinner();
        this.toastr.error(cadenaErrores(error))
      }
    });
  }

  guardarCambios(data: any) {
    this.spinnerService.showGlobalSpinner();
    this.userService.editar(this.modelo.id,data).subscribe({
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

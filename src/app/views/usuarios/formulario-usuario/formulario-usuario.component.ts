import { Component, EventEmitter, Input, OnInit, 
         HostListener , Output, ViewChild, ViewChildren, 
         ElementRef, inject } from '@angular/core';
import { FormControl, FormGroup , Validators } from '@angular/forms';
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { RolDTO } from '../../roles/roles'
import { RolesService } from '../../roles/roles.service'
import { ToastrService } from 'ngx-toastr';
import { FormValidationService } from '../../../core/services/form-validation.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrl: './formulario-usuario.component.scss'
})
export class FormularioUsuarioComponent implements OnInit  {

  private readonly rolService = inject(RolesService);
  private readonly validationService = inject(FormValidationService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  
  public default : string = 'Default';
  public fields: Object = { text: 'name', value: 'id' };
  public multiselectWaterMark: string = 'Roles de usuario';    

  @ViewChild('lblEstado') lblEstado!: ElementRef<HTMLLabelElement>;
  @ViewChild('UserName') userName!: ElementRef;

  @Input() errores: string;
  @Input() modelo: any;  
  @Input() StateEnum: TipoAccion; 
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();

  tipoAccion = TipoAccion;
  listadoRoles: RolDTO [] = [];
  formRoles: string[] = [];
  tituloFormulario: string;
  customStylesValidated = false;
  form: FormGroup = this.initForm(); 

  async ngOnInit() {
    await this.fillCombos();
    if (this.StateEnum !== TipoAccion.Create && this.modelo) {
      
      this.form.patchValue(
        {
          UserName: this.modelo.userName,          
          Email: this.modelo.email,
          PhoneNumber: this.modelo.phoneNumber,
          FullName: this.modelo.fullName,
          Status: this.modelo.status,
          Roles: this.modelo.roles   
        }
      );
    }
  }

  async fillCombos() {
    try {
      const response: any = await firstValueFrom(this.rolService.todos());
      if (response.isSuccess) {
        this.listadoRoles = response.result;
      } else {
        this.toastr.error(response.message || 'Error al cargar los roles.');
      }
    } catch (error) {
      this.toastr.error(cadenaErrores(error));
    }
  }

  private setTituloFormulario(): void {
    this.tituloFormulario = this.StateEnum === TipoAccion.Create ? 'Nuevo usuario' : 'Modificar usuario';
  }

  ngAfterViewInit(): void {
    this.userName.nativeElement.focus();
  }

  private initForm(): FormGroup {
    return new FormGroup({
      UserName: new FormControl('', Validators.required),  
      Email: new FormControl('', Validators.email), 
      FullName: new FormControl('', Validators.required), 
      PhoneNumber: new FormControl(''),
      Status: new FormControl(true),
      Roles: new FormControl(this.formRoles)
    });
  }

  setLabelEstado() {
    if (this.lblEstado && this.lblEstado.nativeElement) {
      this.lblEstado.nativeElement.textContent = this.form.get('Status')?.value ? 'Activo' : 'Inactivo';
    }
  }

guardarCambios(): void {

  if (this.form.valid) {
    this.userName.nativeElement.focus();
    this.onSubmit.emit(this.form.value);
  }
}


cancelar():void {
  this.router.navigate(['/usuario']);
}

obtenerError(campoNombre: string): string {
  const campo = this.form.get(campoNombre);
  if (campo && (campo.dirty || campo.touched) && campo.invalid) {
    return this.validationService.obtenerMensajeError(campo);
  }
  return '';
}

@HostListener('window:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  // Combinación para 'Alt+G' - Grabar
  if (event.altKey && event.key === 'g') {
    this.guardarCambios();
    event.preventDefault();
  }
  // Combinación para 'Alt+C' - Cancelar
  else if (event.altKey && event.key === 'c') {
    this.cancelar();
    event.preventDefault();
  }
}



}

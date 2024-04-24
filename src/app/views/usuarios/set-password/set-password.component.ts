import { Component, Input, ViewChildren, inject, ViewChild , ElementRef, QueryList} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { UsuariosService } from '../usuarios.service';
import { FormValidationService } from '../../../core/services/form-validation.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.scss'
})
export class SetPasswordComponent {

    
  @Input() errores: string[] = [];
  @Input() id: any; 
  @Input() username: any; 

  @ViewChild('inputNewPassword') inputPassword!: ElementRef;
  @ViewChildren('inputNewPassword, inputNewPasswordRepeat') inputs!: QueryList<ElementRef>;
  private readonly activeModal = inject(NgbActiveModal);
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UsuariosService);
  private readonly toastr = inject(ToastrService);
  private readonly validationService = inject(FormValidationService);
  form = this.initForm();
  loading = false;

  initForm(): FormGroup{
    return this.formBuilder.group({
      NewPassword: ['', {validators: [Validators.required, Validators.minLength(6)]}] ,
      NewPasswordRepeat: ['', {validators: [Validators.required, Validators.minLength(6)]}]
}, { validators: this.validationService.ConfirmedValidator('NewPassword', 'NewPasswordRepeat') });
  }

  onKeydown(event: KeyboardEvent, controlName: string) {
    if (event.key === "Enter") {
      event.preventDefault();
  
      // Obtiene el control de formulario usando el nombre pasado y lo marca como touched
      const control = this.form.get(controlName);
      if (control) {
        control.markAsTouched();
      }
  
      // La lógica para mover el foco al siguiente input sigue igual
      const index = this.inputs.toArray().findIndex(input => input.nativeElement === event.target);
      if (index >= 0 && index < this.inputs.length - 1) {
        const nextInput = this.inputs.toArray()[index + 1].nativeElement;
        nextInput.focus();
      } else if (index === this.inputs.length - 1) {
        this.inputs.first.nativeElement.focus();
      }
    }
  }

  guardarCambios() {
    this.loading = true;
    this.userService.setPassword(this.id, this.form.value).subscribe({
      next: (respuesta) => {
       

        this.toastr.success('Contraseña actualizada correctamente.');
        this.loading = false;
        this.activeModal.close();

      },
      error: (error) => {
        // console.log(error);
        this.loading = false;
        this.toastr.error(cadenaErrores(error));
      }
    });
  };

  ngAfterViewInit(): void {
    this.inputPassword.nativeElement.focus();
  }

  obtenerError(campoNombre: string): string {
    const campo = this.form.get(campoNombre);
    if(campo)
      {
        return ((campo.dirty || campo.touched) && campo.invalid) ? this.validationService.obtenerMensajeError(campo) : '';
      }
      else
      {
        return '';
      }
  }
  
  cerrar()
  {
    this.activeModal.close(); // O usar .close() según corresponda
  }


}

import { Component, Input, OnInit, ViewChild, ViewChildren, ElementRef , AfterViewInit, QueryList, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
import { UsuariosService } from '../../../views/usuarios/usuarios.service';
import { cadenaErrores } from '../../utilities/parsearErrores';
import {FormValidationService} from '../../../core/services/form-validation.service'
import {  ButtonModule,
          CardModule,
          FormModule,
          GridModule,
          ButtonGroupModule,
          BadgeModule,
          SpinnerModule} from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  standalone: true,
  imports: [ButtonModule,
            CardModule,
            FormModule,
            GridModule,
            ButtonGroupModule,
            BadgeModule,
            SpinnerModule,
            ReactiveFormsModule]
})
export class ChangePasswordComponent implements AfterViewInit {
  loading = false;
  changePassword: any;

  @Input() errores: string[] = [];
  @ViewChild('inputPassword') inputPassword!: ElementRef;
  @ViewChildren('inputPassword, inputNewPassword, inputNewPasswordRepeat') inputs!: QueryList<ElementRef>;


  private readonly activeModal = inject(NgbActiveModal);
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UsuariosService);
  private readonly toastr = inject(ToastrService);
  private readonly validationService = inject(FormValidationService);
  form = this.initForm();

  constructor() {};


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

    initForm(): FormGroup{
      return this.formBuilder.group({
        Password: ['', {validators: [Validators.required, Validators.minLength(6)]}],
        NewPassword: ['', {validators: [Validators.required, Validators.minLength(6)]}] ,
        NewPasswordRepeat: ['', {validators: [Validators.required, Validators.minLength(6)]}]
  }, { validators: this.validationService.ConfirmedValidator('NewPassword', 'NewPasswordRepeat') });
    }

    ngAfterViewInit(): void {
      this.inputPassword.nativeElement.focus();
    }

  

    guardarCambios() {
      this.loading = true;
      this.userService.changePassword(this.form.value).subscribe({
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

  
    
obtenerError(campoNombre: string): string {
  const campo = this.form.get(campoNombre);
  return ((campo.dirty || campo.touched) && campo.invalid) ? this.validationService.obtenerMensajeError(campo) : '';
}

cerrar()
{
  this.activeModal.close(); // O usar .close() según corresponda
}


}

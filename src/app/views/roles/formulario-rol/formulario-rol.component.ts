import { Component, HostListener, EventEmitter, Input, 
         OnInit, Output, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
import { FormValidationService } from '../../../core/services/form-validation.service'
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-rol',
  templateUrl: './formulario-rol.component.html',
  styleUrl: './formulario-rol.component.scss'
})
export class FormularioRolComponent implements OnInit, AfterViewInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly validationService = inject(FormValidationService);

  @Input() modelo: any;  
  @Input() StateEnum: TipoAccion; 
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  customStylesValidated = false;

  
  @ViewChild('rolName') rolName!: ElementRef;
  form = this.initForm();
  tituloFormulario: string;

  ngOnInit(): void {
    this.setTituloFormulario();
    if (this.StateEnum !== TipoAccion.Create && this.modelo) {
      
      this.form.patchValue(
        {
          Name: this.modelo.name,          
        }
      );
    }
  }

ngAfterViewInit(): void {
  this.rolName.nativeElement.focus();

}

private setTituloFormulario(): void {
  this.tituloFormulario = this.StateEnum === TipoAccion.Create ? 'Nuevo rol' : 'Modificar rol';
}

private initForm(): FormGroup {
  return this.formBuilder.group({
    Name: ['', [Validators.required, Validators.minLength(3), this.validationService.primeraLetraMayuscula()]]
  });
}


guardarCambios(): void {
  this.customStylesValidated = true;
  if (this.form.valid) {
    this.onSubmit.emit(this.form.value);
  }
}

cancelar():void {
  this.router.navigate(['/rol']);
}

obtenerError(campoNombre: string): string {
  const campo = this.form.get(campoNombre);
  return campo ? this.validationService.obtenerMensajeError(campo) : '';
}

@HostListener('window:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  // Combinación para 'Alt+G' - Grabar
  if (event.altKey && event.key === 'g') {
    this.guardarCambios();
    event.preventDefault(); // Previene la acción por defecto (opcional)
  }
  // Combinación para 'Alt+C' - Cancelar
  else if (event.altKey && event.key === 'c') {
    this.cancelar();
    event.preventDefault(); // Previene la acción por defecto (opcional)
  }
}

}

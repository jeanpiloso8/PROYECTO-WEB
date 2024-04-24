import { Component, HostListener, EventEmitter, Input, 
  OnInit, Output, ViewChild, ElementRef, AfterViewInit, 
  inject } from '@angular/core';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
import { FormValidationService } from '../../../core/services/form-validation.service'
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { RegionesService } from '../../regiones/regiones.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { Location } from '@angular/common';
import { SecurityService } from '../../../core/services/security.service'
import { formatearFecha } from '../../../shared-features/utilities/formatearFecha'


@Component({
  selector: 'app-formulario-pais',
  templateUrl: './formulario-pais.component.html',
  styleUrl: './formulario-pais.component.scss'
})
export class FormularioPaisComponent  implements OnInit, AfterViewInit  {

  @Input() errores: string;
  @Input() modelo: any;  
  @Input() StateEnum: TipoAccion; 
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();

  customStylesValidated = false;
  localWaterMark = 'Seleccione una región.';
  regiones: any[];
  fields: Object = { text: 'descripcion', value: 'idRegion' };

  @ViewChild('descripcion') descripcion!: ElementRef;
  form: FormGroup;
  tituloFormulario: string;

  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private validationService: FormValidationService,
    private spinnerService: SpinnerService,
    private toastr: ToastrService,
    private regionesService: RegionesService,
    private securityService: SecurityService
  ) {
    this.form = this.initForm();
  }


  ngOnInit(): void {
    this.loadInitialData();
  }

  private async loadInitialData() {
    this.spinnerService.showGlobalSpinner();
    try {
      const response: any = await firstValueFrom(this.regionesService.todos());
      this.spinnerService.hideGlobalSpinner();
      if (response.isSuccess) {
        this.regiones = response.result;
        this.patchFormValues();
      } else {
        this.toastr.error(response.message || 'Error al cargar las regiones.');
      }
    } catch (error) {
      this.spinnerService.hideGlobalSpinner();
      this.toastr.error(cadenaErrores(error));
    }
  }

    
ngAfterViewInit(): void {
  this.descripcion.nativeElement.focus();

}
  

private initForm(): FormGroup {
  return this.formBuilder.group({
    idPais:  [0],  
    descripcion: ['', [Validators.required,  this.validationService.primeraLetraMayuscula()]], 
    idRegion: [, [Validators.required]],
    codigoDiscado: [null],
    usuarioCreacion: [null],
    fechaCreacion: [null],
    equipoCreacion: [null],
    usuarioModificacion: [null],
    fechaModificacion: [null],
    equipoModificacion: [null],
  });
}

private patchFormValues() {
  if (this.StateEnum !== TipoAccion.Create && this.modelo) {

    this.form.patchValue(
      {
        idPais: this.modelo.idPais,
        idRegion: this.modelo.idRegion,      
        descripcion: this.modelo.descripcion,       
        codigoDiscado: this.modelo.codigoDiscado,   
        usuarioCreacion: this.modelo.usuarioCreacion,   
        fechaCreacion: this.modelo.fechaCreacion,   
        equipoCreacion: this.modelo.equipoCreacion,   
        usuarioModificacion: this.modelo.usuarioModificacion,   
        fechaModificacion: this.modelo.fechaModificacion,   
        equipoModificacion: this.modelo.equipoModificacion
      }
    );
  }
}

guardarCambios(): void {


  if (this.form.valid) {

    const updateData = {
      usuarioCreacion: this.StateEnum === TipoAccion.Create ? this.securityService.getUserName() : undefined,
      fechaCreacion: this.StateEnum === TipoAccion.Create ? formatearFecha(new Date()) : undefined,
      usuarioModificacion: this.StateEnum === TipoAccion.Update ? this.securityService.getUserName() : undefined,
      fechaModificacion: this.StateEnum === TipoAccion.Update ? formatearFecha(new Date()) : undefined,
    };
    this.form.patchValue(updateData);
    this.onSubmit.emit(this.form.value);
  }
}

cancelar():void {
  this.router.navigate(['/pais']);
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

obtenerError(campoNombre: string): string {
  const campo = this.form.get(campoNombre);
  return campo ? this.validationService.obtenerMensajeError(campo) : '';
}

}

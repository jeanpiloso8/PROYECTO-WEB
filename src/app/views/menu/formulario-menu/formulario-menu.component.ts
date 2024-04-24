import { Component, EventEmitter, Input, OnInit, 
  HostListener , Output, ViewChild, ViewChildren, 
  ElementRef, inject, 
  AfterViewInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup , Validators } from '@angular/forms';
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { MenuService } from '../../menu/menu.service'
import { ToastrService } from 'ngx-toastr';
import { FormValidationService } from '../../../core/services/form-validation.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { SpinnerService } from '../../../core/services/spinner.service';
import { DropDownTree } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-formulario-menu',
  templateUrl: './formulario-menu.component.html',
  styleUrl: './formulario-menu.component.scss'
})

export class FormularioMenuComponent  implements OnInit, AfterViewInit  {

  private readonly formBuilder = inject(FormBuilder);
  private readonly menuService = inject(MenuService);
  private readonly validationService = inject(FormValidationService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly spinnerService = inject(SpinnerService);

  @ViewChild('lblEstado') lblEstado!: ElementRef<HTMLLabelElement>;
  @ViewChild('nombre') nombre!: ElementRef;

  @Input() errores: string;
  @Input() modelo: any;  
  @Input() StateEnum: TipoAccion; 
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();

  tipoAccion = TipoAccion;
  listadoMenu: { [key: string]: any }[] = [];
  selectedMenu: string[]=[''];
  form: FormGroup;
  treeObj!: DropDownTree;
  fields: any = { dataSource: [], value: 'id', text: 'name', child: 'subChild', expanded: 'expanded' };

   constructor()
   {
    this.form = this.initForm();
   }

   ngOnInit(): void {
    this.loadInitialData();
  }

private async loadInitialData() {
  this.spinnerService.showGlobalSpinner();
  try {
    const response: any = await firstValueFrom(this.menuService.arbol());
    this.spinnerService.hideGlobalSpinner();
    if (response.isSuccess) {
      this.fields.dataSource = this.transformToTreeFormat(response.result);
      this.treeObj = new DropDownTree({
        fields: this.fields,
        allowFiltering: true,
        showClearButton: true,
        placeholder: 'Seleccione el menú padre',
        changeOnBlur: false,
        value: this.modelo?.padre_id ? [this.modelo.padre_id.toString()] : []
      });
      this.treeObj.appendTo('#default');
      this.patchFormValues();
    } else {
      this.toastr.error(response.message || 'Error al cargar los menús.');
    }
  } catch (error) {
    this.spinnerService.hideGlobalSpinner();
    this.toastr.error(cadenaErrores(error));
  }
}

private patchFormValues() {
  if (this.StateEnum !== TipoAccion.Create && this.modelo) {

    this.form.patchValue(
      {
        id: this.modelo.id,     
        nombre: this.modelo.nombre,   
        menu_id: this.modelo.menu_id,    
        orden: this.modelo.orden,
        padre_id: this.modelo.padre_id,
        icono: this.modelo.icono,
        url: this.modelo.url,
        activo: this.modelo.activo   
      }
    );             
  }
}

  async ngAfterViewInit() {    
    this.nombre.nativeElement.focus();
  }

  async fillCombos() {
    try {
      const response: any = await firstValueFrom(this.menuService.arbol());
      if (response.isSuccess) {
           
        this.listadoMenu = this.transformToTreeFormat(response.result) as { [key: string]: any }[];

      } else {
        this.toastr.error(response.message || 'Error al cargar el combo de menu.');
      }
    } catch (error) {
      this.toastr.error(cadenaErrores(error));
    }
  }

  private transformToTreeFormat(items: any[]): any[] {
    return items.map(item => ({
      id: item.id.toString(),
      name: item.nombre,
      subChild: item.menus ? this.transformToTreeFormat(item.menus) : []
    }));
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      id:  [0],  
      nombre: ['', [Validators.required,  this.validationService.primeraLetraMayuscula()]], 
      orden: [0, [Validators.required]], 
      menu_id: [this.menuService.menu, [Validators.required]], 
      padre_id: [], 
      url:  [''],
      icono:  [''],
      activo:  [true]
    });
  }

  setLabelEstado() {
    if (this.lblEstado && this.lblEstado.nativeElement) {
      this.lblEstado.nativeElement.textContent = this.form.get('activo')?.value ? 'Activo' : 'Inactivo';
    }
  }

  guardarCambios(): void {
    if (this.form.valid) {
      this.form.get('padre_id').setValue(this.getPadreValue());
      if (this.formularioValidado())
        {
          this.nombre.nativeElement.focus();
          this.onSubmit.emit(this.form.value);
        }      
    }
  }

  formularioValidado(): boolean {
    const padre_id = this.form.get('padre_id').value;
    if (padre_id === this.form.get('id').value) {
      this.toastr.error("El menú padre no puede ser el mismo que el menú actual.");
      return false;
    }
    return true;
  }

  getPadreValue(): number | null {
    const value = this.treeObj.value;
    return Array.isArray(value) && value.length ? parseInt(value[0], 10) : null;
  }


  cancelar():void {
    this.router.navigate(['/menu']);
  }
  
  obtenerError(campoNombre: string): string {
    const campo = this.form.get(campoNombre);
    return ((campo.dirty || campo.touched) && campo.invalid) ? this.validationService.obtenerMensajeError(campo) : '';
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

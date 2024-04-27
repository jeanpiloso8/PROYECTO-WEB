import { Component, Input, OnInit } from '@angular/core';
import { TipoAccion } from 'src/app/shared-features/enums/TipoAccion';
import { vendedor } from '../../visitas-vendedor/datasources';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormValidationService } from 'src/app/core/services/form-validation.service';
import { cilPlus,cilTrash} from '@coreui/icons';
import {DetRuta } from './../models/Ruta';
import {clientes } from '../datasources';
import {FormularioDetalle } from './../models/Formulario';
@Component({
  selector: 'app-formulario-rutero',
  templateUrl: './formulario-rutero.component.html',
  styleUrl: './formulario-rutero.component.scss'
})
export class FormularioRuteroComponent implements OnInit {
  icons = { cilPlus,cilTrash };
  @Input() errores: string[] = [];
  @Input() accion! :TipoAccion;
  titulo:string;
  cbvendedor:any[]=[];
  cbcliente:any[]=[];
  FormTable: any;
  Form:any;
  public localFieldsVendedor: Object = { text: 'nombre', value: 'codigo' };
  public localFieldsCliente: Object = { text: 'nombre', value: 'codigo' };
  public detalleRutas: DetRuta[] = [];
  public detalleFila: string = 'detalleFila';
  ndocumento = new FormControl('', {validators: [Validators.required]});
  vendedor =  new FormControl('', {validators: [Validators.required, Validators.minLength(2)]});
  fecha = new FormControl('', {validators: [Validators.required, Validators.minLength(2)]});
  descripcion = new FormControl('', {validators: [Validators.required, Validators.minLength(2),this.validationService.primeraLetraMayuscula()]});
  estadoBotones = {
    btnNuevo: false,
    btnModificar: false,
    btnGrabar: false, // Suponiendo que quieres que este esté deshabilitado inicialmente
    btnAnular: false,
    btnSalir: false,
  };
  constructor(private fb: FormBuilder, private toastr: ToastrService,private validationService:FormValidationService){}
  ngOnInit(): void {
    this.cbvendedor=vendedor;
    this.cbcliente=clientes
    this.inicializar();
    this.barraBotones();
  }

  inicializar(){
       //inicializamos controles del formulario
       if(this.accion == TipoAccion.Create){
        this.titulo="Registrar Rutas";
       }else{
        this.titulo="Modificar Rutas";
       }
       this.Form = new FormGroup({
        ndocumento: this.ndocumento,
        vendedor : this.vendedor,
        fecha: this.fecha,
        descripcion:this.descripcion
      });

      this.FormTable = this.fb.group({
        codigo_cliente: ["", [Validators.required]],
       });
  }
  barraBotones(){
    this.estadoBotones.btnSalir = true;
    if (this.accion == TipoAccion.Read){
      this.estadoBotones.btnNuevo = true;
      this.estadoBotones.btnModificar = true;
      this.estadoBotones.btnAnular = true;
      this.estadoBotones.btnGrabar = false;
    }
    else if (this.accion == TipoAccion.Create || this.accion == TipoAccion.Update){
      this.estadoBotones.btnNuevo = false;
      this.estadoBotones.btnModificar = false;
      this.estadoBotones.btnAnular = false;
      this.estadoBotones.btnGrabar = true;
    }
  }
  obtenerError(campoNombre: string): string {
    const campo = this.Form.get(campoNombre);
    return campo ? this.validationService.obtenerMensajeError(campo) : '';
  }
  
  public eliminarFilaDetalleFn(idx: number) {

    if(this.accion == TipoAccion.Create){
      this.FormTable.removeControl(this.detalleRutas[idx].cnoFormulario);
      const grupoProducto = { ... this.detalleRutas[idx] };
      this.detalleRutas.splice( idx , 1 );
     // this.OrdenarIndex();
    }else{
      if(this.accion == TipoAccion.Update){
        this.detalleRutas[idx].estado ="Delete";
      }
    }
  }
  onNgModelChange(event: any, idx: number) {
    if (event === null) {
      this.detalleRutas[idx].codigo_cliente = "";
      this.detalleRutas[idx].direccion = "";
      this.detalleRutas[idx].telefono = "";
    }
  }
  enfocarSiguienteCelda(nextInput: number, idx: number) {

    switch (nextInput) {
      
      case 0:
          this.btnNuevoProducto();
        break;
    }
  }
  handleKeydown(event: KeyboardEvent, nextInput: number, idx: number): void {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      this.enfocarSiguienteCelda(nextInput, idx);
    }
  }
   
  actualizarFilaDetalle($event: any, idx: number, celda: string) {
    
    
    const valor:any = this.FormTable.get(this.detalleRutas[idx].cnoFormulario).get(celda).value;
    let estado = this.detalleRutas[idx].estado;
   if(estado == "Read"){
      this.detalleRutas[idx].estado ="Update";
    }
    switch (celda) {

      case 'codigo_cliente':
       const duplicado = this.detalleRutas.filter( c => c.codigo_cliente == $event.itemData.codigo && c.estado !== "Delete");
     
        if (duplicado.length > 0 ){
          this.toastr.warning(`Código ${$event.itemData.codigo} ya se encuentra en el listado.`, 'Información del Sistema');
            this.FormTable.get(this.detalleRutas[idx].cnoFormulario).get(celda).patchValue('');//da error xq el tipo de dato es number

        }else{
                          
            this.detalleRutas[idx].codigo_cliente =  $event.itemData.codigo;
            this.detalleRutas[idx].direccion = $event.itemData.direccion;
            this.detalleRutas[idx].telefono = $event.itemData.telefono;                               
        }
         break;
       
          }
          console.log(this.detalleRutas);
}
inicializarFromTable(name: string) {
  const formGroup = this.fb.group({ ... FormularioDetalle });
  this.FormTable.addControl(name, formGroup);
}
ValidarNameFila(nombref: string): string {
  let nombre = nombref;
  if(this.detalleRutas.filter((item:any) => item.cnoFormulario === nombref).length > 0) {
    nombre = this.detalleFila+"V"+ this.detalleRutas.length;
  }
  return nombre;
}
btnNuevoProducto() {
  //this.lisproduct=[];
  
  
     const name = this.detalleFila + this.detalleRutas.length; 
     this.inicializarFromTable(this.ValidarNameFila(name));
   // const secuencia: number = this.ordenProduccionDet.length + 1; // FIX OBTENER LA SECUENCIA MAYOR DE LA LISTA
    const detalle: DetRuta = { ... new DetRuta() }
    detalle.cnoFormulario = this.ValidarNameFila(name);
    detalle.codigo_cliente ="";
    let idcab =0;
    if(this.accion == TipoAccion.Create) idcab= 0; else idcab =0 ;//caso contrario secuencial
    detalle.id_cab = idcab;
    detalle.estado ="Create";
  
  
  if(this.detalleRutas.length > 0 && this.detalleRutas != undefined){
    
    let lastItem =  { ...this.detalleRutas[this.detalleRutas.length - 1] };
    if(lastItem.estado !== "Delete"){
      if(lastItem.codigo_cliente != "" ) {
     
        this.detalleRutas.push(detalle);
       }else{
        this.toastr.warning("Debe seleccionar cliente","Error");
       }
    }else{
      this.detalleRutas.push(detalle);
    }
   
    
  }else{
    
    this.detalleRutas.push(detalle);
  }

  }
}

import { Component, Input, OnInit, inject } from '@angular/core';
import { TipoAccion } from 'src/app/shared-features/enums/TipoAccion';
import { vendedor } from '../../visitas-vendedor/datasources';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormValidationService } from 'src/app/core/services/form-validation.service';
import { cilPlus,cilTrash} from '@coreui/icons';
import {CabRuta, DetRuta } from './../models/Ruta';
import {clientes } from '../datasources';
import {FormularioDetalle } from './../models/Formulario';
import { RuteroVendedorService } from '../rutero-vendedor.service';
import { firstValueFrom } from 'rxjs';
import {parsearErrores} from '../../../shared-features/utilities/parsearErrores'
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-formulario-rutero',
  templateUrl: './formulario-rutero.component.html',
  styleUrl: './formulario-rutero.component.scss'
})
export class FormularioRuteroComponent implements OnInit {
  icons = { cilPlus,cilTrash };
  @Input() errores: string[] = [];
  @Input() accion! :TipoAccion;
  private readonly ruteroService = inject(RuteroVendedorService);
  titulo:string;
  cbvendedor:any[]=[];
  cbcliente:any[]=[];
  FormTable: any;
  Form:any;
  anulado :string="";
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
    btnAgregar: false,
    controlTable:false,
  };
  constructor(private fb: FormBuilder, private toastr: ToastrService,private validationService:FormValidationService,private datePipe: DatePipe){}
  ngOnInit(): void {
    this.accion=TipoAccion.Read;
    this.cbvendedor=vendedor;
    this.cbcliente=clientes
    this.inicializar();
    this.limpiar();
    this.barraBotones();
  }

  async inicializar(){
        //inicializamos controles del formulario
      try{
        
         this.Form = new FormGroup({
          ndocumento: this.ndocumento,
          vendedor : this.vendedor,
          fecha: this.fecha,
          descripcion:this.descripcion
        });
  
        this.FormTable = this.fb.group({
          codigo_cliente: ["", [Validators.required]],
         });


         if(this.accion == TipoAccion.Create){
          this.titulo="Registrar Rutas";
          await this.obtenerSecuencial();
         }else{
          this.titulo="Modificar Rutas";
         }


      }catch (error) {
      this.errores = parsearErrores(error);
      const mensajeError = this.errores.join(', ');
      this.toastr.error(mensajeError);
    }
      
  }
  barraBotones(){
    this.estadoBotones.btnSalir = true;
    if (this.accion == TipoAccion.Read){
      this.estadoBotones.btnNuevo = true;
      this.estadoBotones.btnModificar = true;
      this.estadoBotones.btnAnular = true;
      this.estadoBotones.btnAgregar=false;
      this.estadoBotones.controlTable=false;
      this.estadoBotones.btnGrabar = false;
      this.Form.get('ndocumento')?.enable();
      this.Form.get('vendedor')?.disable();
      this.Form.get('fecha')?.disable();
      this.Form.get('descripcion')?.disable();
    }
    else if (this.accion == TipoAccion.Create || this.accion == TipoAccion.Update){
      this.estadoBotones.btnNuevo = false;
      this.estadoBotones.btnModificar = false;
      this.estadoBotones.btnAnular = false;
      this.estadoBotones.btnAgregar=true;
      this.estadoBotones.controlTable=true;
      this.estadoBotones.btnGrabar = true;
      this.Form.get('ndocumento')?.disable();
      this.Form.get('vendedor')?.enable();
      this.Form.get('fecha')?.enable();
      this.Form.get('descripcion')?.enable();
    }
  }
  async nuevo() {

    try
    {
      this.accion = TipoAccion.Create;
      this.limpiar();
      await this.obtenerSecuencial();
      this.barraBotones();
    }
    catch (error) {
      this.errores = parsearErrores(error);
      const mensajeError = this.errores.join(', ');
      this.toastr.error(mensajeError);
    }
  }
  async modificar() {

    try{
         const id = this.Form.controls.ndocumento.value;
         let consulta = await this.consultar(id);
   
         if (consulta) {
           if(this.anulado !== "AN"){
             this.accion = TipoAccion.Update;
             this.barraBotones();
           }else{
             this.toastr.error('Registro se encuentra anulado');
           }
   
         }
       } catch (error) {
         this.errores = parsearErrores(error);
         const mensajeError = this.errores.join(', ');
         this.toastr.error(mensajeError);
       }
   
     }
  Cancelar() {
    if (this.accion == TipoAccion.Read) {
      this.obtenerSecuencial();
      this.limpiar();
      this.barraBotones();
      // cerramos la ventana
    }
    else if (this.accion == TipoAccion.Create || this.accion == TipoAccion.Update) {
      Swal.fire({
        title: "Seguro desea Cancelar Transacción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          this.accion = TipoAccion.Read;
          this.limpiar();
          this.barraBotones();

        }
      });
    }
  }
  limpiar() {

    this.detalleRutas = [];
    const currentDate = new Date().toISOString().split('T')[0];
    if (this.accion != TipoAccion.Read) {
      this.Form.patchValue({
        ndocumento: "",
      });
    }
    this.Form.patchValue({
      vendedor: "",
      descripcion: "",
      fecha: currentDate
    });
    this.FormTable = this.fb.group({
      cliente:  ["", [Validators.required]]
     });
    }
    EnterConsulta(){
      const id = this.Form.controls.ndocumento.value;
      this.consultar(id);
    }

    async consultar(id:string) {
      let result: boolean = true;
      // Suponiendo que 'id' es el identificador que necesitas para verificar si el documento existe
  
      this.accion = TipoAccion.Read;
      this.limpiar();
     
      
      // Espera el resultado de existe_documento
      try{
  
        if(id != null  && id != "" && id != undefined){
  
         const existe = await this.existe_documento(id);
          if (!existe) {
            //this.toastr.info('no existe documento con secuencia ingresada');
            result = false;
          }
        }else{
          this.toastr.info('no existe numero documento');
          result = false;
        }
        this.barraBotones();
      }catch(errores){
        throw errores;
      }
      return result;
    }

  existe_documento(id: string): Promise<boolean> {
    //this.cbcliente=[];
    let idx: number = 0;
    this.anulado = "";
    return new Promise((resolve, reject) => {
      this.ruteroService.DetRutaID(id).subscribe({
        next: (data) => {
          if (data.result) {
            resolve(true);
            this.Form.patchValue({
              ndocumeto: data.result.id_cab,
              vendedor: data.result.vendedor,
              descripcion: data.result.observacion,
              fecha: data.result.fecha != undefined ? this.datePipe.transform(new Date(data.result.fecha), 'yyyy-MM-dd') : ""
            });
            this.anulado = data.result.estado;
            data.result.rutasDetalles.forEach((element: any, index: number) => {
              const name = this.detalleFila + index;
              element.cnoFormulario = name;
              //element.codigo_producto = element.codigo_producto;

              this.inicializarFromTable(name);
            });
            this.detalleRutas = data.result.rutasDetalles;
            idx = 0;
            this.detalleRutas.forEach(detalle => {
              const nombreForm = detalle.cnoFormulario;
              const client = detalle.cliente;
              const nclient = detalle.ncliente;
              ///this.cbcliente.push({ codigo: client, name: nclient });

              this.FormTable.get(nombreForm).get('codigo_cliente').patchValue(client);

              detalle.estado = "Read";
              //  this.agregarAtributoProductoFn(idx);
              idx = idx + 1;

            });
          } else {
            resolve(false);
          }
        },
        error: (error) => {
          resolve(false);
          this.errores = parsearErrores(error);
          const mensajeError = this.errores.join(', ');
          this.toastr.error(mensajeError);
        }
      });

    });
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
      this.detalleRutas[idx].cliente = "";
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
       const duplicado = this.detalleRutas.filter( c => c.cliente == $event.itemData.codigo && c.estado !== "Delete");
     
        if (duplicado.length > 0 ){
          this.toastr.warning(`Código ${$event.itemData.codigo} ya se encuentra en el listado.`, 'Información del Sistema');
            this.FormTable.get(this.detalleRutas[idx].cnoFormulario).get(celda).patchValue('');//da error xq el tipo de dato es number

        }else{
                          
            this.detalleRutas[idx].cliente =  $event.itemData.codigo;
            this.detalleRutas[idx].direccion = $event.itemData.direccion;
            this.detalleRutas[idx].telefono = $event.itemData.telefono;    
            const ncliente = this.cbcliente.find(cliente => cliente.codigo === $event.itemData.codigo);  
            this.detalleRutas[idx].ncliente = ncliente.nombre;                            
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
 // console.log(this.Form.control.vendedor.value);

    if(this.Form.controls.vendedor.value != undefined && this.Form.controls.vendedor.value != "" ){
      const name = this.detalleFila + this.detalleRutas.length; 
      this.inicializarFromTable(this.ValidarNameFila(name));
    // const secuencia: number = this.ordenProduccionDet.length + 1; // FIX OBTENER LA SECUENCIA MAYOR DE LA LISTA
     const detalle: DetRuta = { ... new DetRuta() }
     detalle.cnoFormulario = this.ValidarNameFila(name);
     detalle.cliente ="";
    detalle.vendedor=this.Form.controls.vendedor.value;
     let idcab =0;
     if(this.accion == TipoAccion.Create) idcab= 0; else idcab =0 ;//caso contrario secuencial
     detalle.id_cab = idcab;
     detalle.estado ="Create";
   
   
   if(this.detalleRutas.length > 0 && this.detalleRutas != undefined){
     
     let lastItem =  { ...this.detalleRutas[this.detalleRutas.length - 1] };
     if(lastItem.estado !== "Delete"){
       if(lastItem.cliente != "" ) {
      
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
    }else{
      this.toastr.warning("Debe seleccionar vendedor","Error");
    }
    

  }
  async obtenerSecuencial() {
    try {
      const data = await firstValueFrom(this.ruteroService.GetSecuencial());
      this.Form.patchValue({
        ndocumento: data,
      });
    } catch (errores) {
      // Lanza el error para que pueda ser capturado por el try-catch de quien llame a obtenerSecuencial
      throw errores;
    }
  }

  async PosRutas(){
    if(this.Form.valid){
      this.detalleRutas = this.detalleRutas.filter((item:any) => item.cliente !== "");
      try{
        if (this.detalleRutas.length === 0 ) {
          this.toastr.warning('No existe detalles de Rutas', 'Rutas', { timeOut: 2000 });
          return;
        }
        let idcab = 0;
        let estadoCab = "A";
        let observ = this.Form.controls.descripcion.value;
        if (this.accion == TipoAccion.Create) {
          idcab = 0;
        } else if (this.accion == TipoAccion.Delete) {
          idcab = this.Form.controls.ndocumento.value;
          estadoCab = "I";
          observ = observ + " " + "Registro ANULADO";
        } else { idcab = this.Form.controls.ndocumento.value; }
        const nvendedor = this.cbvendedor.find(vendedor => vendedor.codigo === this.Form.controls.vendedor.value);
        let cab: CabRuta = {
          id_cab: idcab,
          fecha: this.Form.controls.fecha.value,
          vendedor: this.Form.controls.vendedor.value,
          nvendedor:nvendedor.nombre,
          observacion: this.Form.controls.descripcion.value,
          estado : estadoCab,
          RutasDetalles: this.detalleRutas,         
        }
       // console.log(cab);
        this.ruteroService.crearRuta(cab).subscribe({
          next: (respuesta) => {
            if(this.accion == TipoAccion.Create){
              this.toastr.success('Registro Grabado Correctamente');
            }else if(this.accion == TipoAccion.Update){
              this.toastr.success('Registro Modificado Correctamente');
            }else if(this.accion == TipoAccion.Delete){
              this.toastr.error('Registro Eliminado Correctamente');
            }
            const id = this.Form.controls.ndocumento.value;
            this.consultar(id);
          },
          error: (error) => {
      
            this.errores = parsearErrores(error);
            const mensajeError = this.errores.join(', ');
            this.toastr.error(mensajeError);
          }
        });

      }catch(e){
        this.toastr.error('Error al Grabar Registro', 'Rutas', { timeOut: 2000 });
      }
    }else{
      this.toastr.warning('Debe llenar todos los campos', 'Rutas', { timeOut: 2000 });
    }
  }
}

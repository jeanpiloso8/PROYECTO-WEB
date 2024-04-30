import { Component, OnInit, inject } from '@angular/core';
import { RuteroVendedorService } from '../rutero-vendedor.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { ToastrService } from 'ngx-toastr';
import { cab,det } from '../datasources';
import { CommandModel, GridModel, SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { cilSearch,cilPlus } from '@coreui/icons';
import { vendedor } from '../../visitas-vendedor/datasources';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoAccion } from 'src/app/shared-features/enums/TipoAccion';
import { Router } from '@angular/router';
@Component({
  selector: 'app-listado-rutero',
  templateUrl: './listado-rutero.component.html',
  styleUrl: './listado-rutero.component.scss'
})
export class ListadoRuteroComponent implements OnInit {
  icons = {  cilSearch,cilPlus };
  private readonly ruteroService = inject(RuteroVendedorService);
  private readonly toastr = inject(ToastrService);
crutas :any[]=[];
drutas :any[]=[];
cbVendedor:any[]=[];
public localFielvendedor: Object = { text: 'nombre',value:'codigo'};
public childGrid: GridModel;
public editSettings: Object = { allowEditing: false, allowAdding: true, allowDeleting: false, showDeleteConfirmDialog: true };
public commands?: CommandModel[];
public pageOption: Object;
  public toolbar?: ToolbarItems[] | object;
  searchSettings: SearchSettingsModel = { fields: ['id_cab','nvendedor','fecha'] };
  Form :any;
  fechadesde = new FormControl('', {validators: [Validators.required]});
  fechahasta = new FormControl('', {validators: [Validators.required]});
  vendedor = new FormControl('', {validators: [Validators.required]});
  public accion = TipoAccion.Read;
  private readonly router = inject(Router);
  constructor(){}
  ngOnInit(): void {
    this.inicializar();
    this.cbVendedor=vendedor;
    this.commands = [{ buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-eye' }, title: 'PDF' },
    { buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-edit' }, title: 'Modificar' },
    { buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-delete' }, title: 'Eliminar' },
    ];
   

    this.pageOption = { pageCount: 5, pageSize: 15 };
    this.toolbar = ['Search'];

    this.Obtener("Todos",this.Form.controls.fechadesde.value,this.Form.controls.fechahasta.value);
   
 
  }
  inicializar(){
    this.Form = new FormGroup({
      fechadesde:this.fechadesde,
      fechahasta:this.fechahasta,
      vendedor:this.vendedor,
    });
    const currentDate = new Date().toISOString().split('T')[0];
    this.Form.patchValue({
      fechadesde: currentDate,
      fechahasta: currentDate
    });
   // this.obtenerData(this.Form.controls.fechadesde.value,this.Form.controls.fechahasta.value,"");
  }
  search(){
    const vendedorValue = this.Form.controls.vendedor.value;
    const fechaDesdeValue = this.Form.controls.fechadesde.value;
    const fechaHastaValue = this.Form.controls.fechahasta.value;

    // Verificar si el campo vendedor está vacío y establecerlo en "Todos" si es así
    const vendedor = vendedorValue ? vendedorValue : 'Todos';

    this.Obtener(vendedor,fechaDesdeValue,fechaHastaValue);
  }
  Obtener(vendedor:string,dfecha:string,hfecha:string){
    this.crutas=[];
    this.drutas=[];
    this.ruteroService.CabRura(vendedor,dfecha,hfecha).subscribe({
      next: (respuesta) => {
        if (respuesta.isSuccess)
        {        
          this.crutas = respuesta.result;
          this.crutas.forEach(item => {
            // Concatenar los rutasDetalles del elemento actual al arreglo de todos los rutasDetalles
            this.drutas.push(...item.rutasDetalles);
          });
            
          this.childGrid = {
            dataSource: this.drutas,
            queryString: 'id_cab',
            columns: [
                { field: 'ncliente', headerText: 'Cliente', textAlign: 'Left', width: 100 },
                { field: 'direccion', headerText: 'Dirección', width: 120 }
            ]
        };
        }
      },
      error: (errores) => {
        this.toastr.error(cadenaErrores(errores));
      }
    });
  }
  


  public commandClick(args: any): void {

    if (args.commandColumn.title && args.commandColumn.title === 'Modificar') {
      const Id = args.rowData.id_cab;
      this.modificar(Id);
    }
    else if (args.commandColumn.title && args.commandColumn.title === 'Eliminar') {
      const Id = args.rowData.id_cab;
      console.log(Id);
    }
  }

  modificar(Id:number){
    this.router.navigate(['/ruterovendedor/modifica', Id]);
    
  }

}

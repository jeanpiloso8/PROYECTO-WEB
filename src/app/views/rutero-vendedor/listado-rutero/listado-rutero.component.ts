import { Component, OnInit, inject } from '@angular/core';
import { RuteroVendedorService } from '../rutero-vendedor.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { ToastrService } from 'ngx-toastr';
import { cab,det } from '../datasources';
import { CommandModel, GridModel, SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { cilSearch,cilPlus } from '@coreui/icons';
import { vendedor } from '../../visitas-vendedor/datasources';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

    this.crutas=cab;
    this.drutas=det;
    this.childGrid = {
      dataSource: this.drutas,
      queryString: 'id_cab',
      columns: [
          { field: 'ncliente', headerText: 'Cliente', textAlign: 'Left', width: 100 },
          { field: 'direccion', headerText: 'Dirección', width: 120 }
      ]
  };
 
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
  consulta(){
    this.ruteroService.CabRura("Todos","2024-04-27","2024-04-27").subscribe({
      next: (respuesta) => {
        if (respuesta.isSuccess)
        {
          
          this.crutas = respuesta.result;
          this.ruteroService.DetRura("Todos","2024-04-27","2024-04-27").subscribe({
            next: (respuesta) => {
              if (respuesta.isSuccess)
              {
                
                this.drutas = respuesta.result;
                console.log(this.crutas);
                console.log(this.drutas);
              }
            },
            error: (errores) => {
              this.toastr.error(cadenaErrores(errores));
            }
          });
        }
      },
      error: (errores) => {
        this.toastr.error(cadenaErrores(errores));
      }
    });
  }
  
  public commandClick(args: any): void {

    if (args.commandColumn.title && args.commandColumn.title === 'Modificar') {
      const Id = args.rowData.codigo;
      console.log(Id);
      //this.router.navigate(['/cotizacion/modificar']);
    }
    else if (args.commandColumn.title && args.commandColumn.title === 'Eliminar') {
      const Id = args.rowData.codigo;
      console.log(Id);
    }
  }
}

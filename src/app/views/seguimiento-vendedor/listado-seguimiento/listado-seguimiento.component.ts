import { Component, OnInit, ViewChild } from '@angular/core';
import { cilSearch,cilPlus } from '@coreui/icons';
import { ServiceService } from '../../seguimiento-vendedor/service.service';
import { CommandModel, ToolbarItems, GridComponent, PdfQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { vendedor } from '../../visitas-vendedor/datasources';
@Component({
  selector: 'app-listado-seguimiento',
  templateUrl: './listado-seguimiento.component.html',
  styleUrl: './listado-seguimiento.component.scss'
})
export class ListadoSeguimientoComponent implements OnInit {
  icons = {  cilSearch,cilPlus };
  datos: any[]=[];
  public toolbar?: ToolbarItems[] | object;
  public commands?: CommandModel[];
  public usernamerules = { required: true };
  public editparams = { params: { popupHeight: '500px' }};
  public pageOption: Object;
  public isInitial: Boolean = true;
  @ViewChild('grid') public grid: GridComponent;
  cbVendedor:any[]=[];
  public localFielvendedor: Object = { text: 'nombre',value:'codigo'};
  Form :any;
  fechadesde = new FormControl('', {validators: [Validators.required]});
  fechahasta = new FormControl('', {validators: [Validators.required]});
  vendedor = new FormControl('', {validators: [Validators.required]});
  constructor(private service : ServiceService,private toastr: ToastrService){}
ngOnInit(): void {
  this.cbVendedor=vendedor;
  this.commands = [{ buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-location'}, title:'Ubicacion' },
  ];
  this.pageOption = {pageCount: 5, pageSize:50};
  this.toolbar = ['ExcelExport', 'PdfExport', 'CsvExport','Search'];
  this.inicializar();
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
  this.obtenerData(this.Form.controls.fechadesde.value,this.Form.controls.fechahasta.value,"");
}
obtenerData(desde:string,hasta:string,vendedor:string) {
    const body = {
      "op":"ConsultarVisita",
    "data":{
      "vendedor":vendedor,
      "dfecha":desde,
      "hfecha":hasta
    } 
    } 
      
    this.service.obtener(body).subscribe(data => {
      this.datos = data;
    })
  }
  consultar(){
    this.obtenerData(this.Form.controls.fechadesde.value,this.Form.controls.fechahasta.value,this.Form.controls.vendedor.value);
  }
  public commandClick(args: any): void {

    if (args.commandColumn.title && args.commandColumn.title=== 'Ubicacion')
    {

      console.log(args.rowData);
      if(args.rowData.latitud !="GPS Desactivado"){
        const titulo = 'Ubicación';
        const url = `https://www.google.com/maps?q=${args.rowData.latitud},${args.rowData.longitud}&output=embed&t=${titulo}`;
        window.open(url, "Diseño Web", "_blank");
      }else{
        this.toastr.info('Vendedor tiene el GPS DESACTIVADO');
      }
    
    }
  }
  dataBound() {
    if(this.isInitial) {
        this.grid.toolbarModule.toolbar.hideItem(2, true);
        this.isInitial = false;
    }
  }
  toolbarClick(args: ClickEventArgs): void {

    switch (args.item.id) {
        case 'DefaultExport_pdfexport':
            this.grid.pdfExport();
            break;
        case 'DefaultExport_excelexport':
            this.grid.excelExport();
            break;
        case 'DefaultExport_csvexport':
            this.grid.csvExport();
            break;
    }
  }
  exportQueryCellInfo(args: ExcelQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs): void {
    if (args.column.headerText === 'Employee Image') {
        if ((args as any).name === 'excelQueryCellInfo') {
            args.image = { height: 75, base64: (args as any).data.EmployeeImage, width: 75 };
        } else {
            args.image = { base64: (args as any).data.EmployeeImage };
        }
    }
    if (args.column.headerText === 'Email ID') {
        args.hyperLink = {
            target: 'mailto:' + (args as any).data.EmailID,
            displayText: (args as any).data.EmailID
        };
    }
  }
}

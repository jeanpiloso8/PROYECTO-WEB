import { Component, ViewChild, inject } from '@angular/core';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { MenuService } from '../menu.service'
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { EditSettingsModel, ToolbarItems,TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import { IEditCell , CommandModel} from '@syncfusion/ej2-angular-grids';
import { SpinnerService } from '../../../core/services/spinner.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { closest } from '@syncfusion/ej2-base';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-menu',
  templateUrl: './listado-menu.component.html',
  styleUrl: './listado-menu.component.scss'
})
export class ListadoMenuComponent {

    @ViewChild('treegrid') public treeGridObj?: TreeGridComponent;

    public data?: Object[];
    public editSettings?: EditSettingsModel;
    public toolbarOptions?: ToolbarItems[] | any;
    public errores: string = '';
    public numericParams: IEditCell;
    public commands?: CommandModel;

    private readonly toastr = inject(ToastrService);
    private readonly spinnerService = inject(SpinnerService);
    private readonly menuService = inject(MenuService);
    private readonly router = inject(Router);

    constructor() {}

    public ngOnInit(): void {
        
        this.cargarRegistros();

        this.commands = [{ buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-edit', click: this.onUpdate.bind(this) }, title:'Modificar' },
                         { buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-delete', click: this.onDelete.bind(this) }, title:'Eliminar' },
        ]as CommandModel;

        this.toolbarOptions = [{text: 'Nuevo', tooltipText: 'Nuevo - Alt+N' , prefixIcon: 'e-add' , id: 'Nuevo', align:'left'}, "Search"];

        this.numericParams = { params: {
          validateDecimalOnType: true,
          decimals: 0,
          format: 'N' }};

        this.editSettings = { allowEditing: false, allowAdding: false, allowDeleting: false, mode: 'Row' };
    }

    guardarCambios()
    {}


    cargarRegistros(){

      this.spinnerService.showGlobalSpinner();
      this.menuService.arbol().subscribe({
        next: (respuesta) => {
          this.spinnerService.hideGlobalSpinner();
          if (respuesta.isSuccess)
          {
            this.data = respuesta.result;
          }
        },
        error: (errores) => {
          this.spinnerService.hideGlobalSpinner();
          this.toastr.error(cadenaErrores(errores));
        }
      });

    }
    

    public onUpdate = (args: Event) => {
      let id: number = this.getId(args);
      this.router.navigate(['/menu/modificar', id]);
  }

    public onDelete = (args: Event) => {
      let id: number = this.getId(args);
      this.eliminar(id);      
  }

  getId(args: Event):number
  {
    let id: number = 0;
    let rowIndex: number = (<HTMLTableRowElement>closest(args.target as Element, '.e-row')).rowIndex;    
    let data: any[] = (this.treeGridObj as TreeGridComponent).getCurrentViewRecords();
    if (data[rowIndex]){ id = data[rowIndex].id; }
    return id;
  }

    public commandClick(args: any): void {


      console.log(args);
      if (args.commandColumn.title && args.commandColumn.title=== 'Modificar')
      {
        const userId = args.rowData.id;
        this.router.navigate(['/menu/modificar', userId]);
      }
      else if (args.commandColumn.title && args.commandColumn.title=== 'Eliminar')
      {
        this.eliminar(args);
      }
    
  }

  clickHandler(args: ClickEventArgs): void {
    
    if (args.item.id === 'Nuevo') {
      this.router.navigate(['/menu/nuevo']);
    }
  }

  
async eliminar(id: number) {
  const result = await Swal.fire({
    title: 'Confirmación',
    text: '¿Está seguro que desea borrar el registro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, borrar!',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    this.spinnerService.showGlobalSpinner();
    try {
      const respuesta: any = await firstValueFrom(this.menuService.borrar(id));
      if (respuesta.isSuccess) {
        // Esperar a que cargarRegistros se complete antes de continuar
        this.cargarRegistros();
        this.toastr.success('Acción exitosa');

      } else {
        this.toastr.error(cadenaErrores(respuesta.message));
      }
    } catch (errores) {
      this.toastr.error(cadenaErrores(errores));
    } finally {
      this.spinnerService.hideGlobalSpinner();
    }
  }
}

}

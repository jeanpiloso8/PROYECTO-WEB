import { Component, ViewChild ,inject, HostListener } from '@angular/core';
import { CiudadesService } from '../ciudades.service'
import { GridComponent, CommandModel , ToolbarItems} from '@syncfusion/ej2-angular-grids';
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { ToastrService } from 'ngx-toastr';
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { Router } from '@angular/router';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { SpinnerService } from '../../../core/services/spinner.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-listado-ciudades',
  templateUrl: './listado-ciudades.component.html',
  styleUrl: './listado-ciudades.component.scss'
})
export class ListadoCiudadesComponent {

  private readonly ciudadesService = inject(CiudadesService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly spinnerService = inject(SpinnerService);

  @ViewChild('grid') grid?: GridComponent;
  public data: any[] = [];
  public editSettings: Object = { allowEditing: false, allowAdding: true, allowDeleting: false, showDeleteConfirmDialog: true };
  public toolbar?: ToolbarItems[] | object;
  public commands?: CommandModel[];
  public sortOptions?: object;
  public pageSettings = { pageCount: 5 };
  public editparams = { params: { popupHeight: '300px' }};
  public tipoAccion = TipoAccion.Read;

  ngOnInit(): void {
    this.toolbar = [{ text: 'Nuevo', tooltipText: 'Nuevo - Alt+N', prefixIcon: 'e-add', id: 'Nuevo' },'Search','ColumnChooser'];
    this.commands = [{ buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-edit'}, title:'Modificar' },
                     { buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-delete'}, title:'Eliminar' }
                    ];
    this.cargarRegistros();
    this.sortOptions = { columns: [{ field: 'provincia.descripcion', direction: 'Ascending' }] };
  }

  cargarRegistros(): void {
    this.spinnerService.showGlobalSpinner();
    this.ciudadesService.todos().subscribe({
      next: (respuesta) => {
        this.spinnerService.hideGlobalSpinner();
        this.data = respuesta.isSuccess ? respuesta.result : []
      },
      error: (errores) => {
        this.spinnerService.hideGlobalSpinner();
        this.toastr.error(cadenaErrores(errores))}
    });
  }

  public commandClick(args: any): void {

    if (args.commandColumn.title && args.commandColumn.title=== 'Modificar')
    {
      const id = args.rowData.idCiudad;
      this.router.navigate(['/ciudad/modificar', id]);
    }
    else if (args.commandColumn.title && args.commandColumn.title=== 'Eliminar')
    {
      this.eliminar(args);
    }
  }

  async eliminar(args: any) {
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
        const respuesta: any = await firstValueFrom(this.ciudadesService.borrar(args.rowData.idCiudad));
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

  clickHandler(args: ClickEventArgs): void {
    
    if (args.item.id === 'Nuevo') {
      this.router.navigate(['/ciudad/nuevo']);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Combinación para 'Alt+N' - Nuevo
    if (event.altKey && event.key === 'n') {
      this.router.navigate(['/ciudad/nuevo']);
      event.preventDefault(); // Previene la acción por defecto (opcional)
    }
  }
  


}

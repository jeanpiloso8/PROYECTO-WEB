import { Component, ViewChild ,inject, HostListener } from '@angular/core';
import { RolesService } from '../roles.service'
import { RolDTO } from '../roles'
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
  selector: 'app-listado-roles',
  templateUrl: './listado-roles.component.html',
  styleUrl: './listado-roles.component.scss'
})
export class ListadoRolesComponent {

  private readonly rolesService = inject(RolesService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly spinnerService = inject(SpinnerService);

  @ViewChild('grid') grid?: GridComponent;
  public data: RolDTO[] = [];
  public editSettings: Object = { allowEditing: false, allowAdding: true, allowDeleting: false, showDeleteConfirmDialog: true };
  public toolbar?: ToolbarItems[] | object;
  public commands?: CommandModel[];
  public rolenamerules = { required: true };
  public pageSettings = { pageCount: 5 };
  public editparams = { params: { popupHeight: '300px' }};
  public tipoAccion = TipoAccion.Read;

  constructor() {}

  ngOnInit(): void {
    this.toolbar = [{ text: 'Nuevo', tooltipText: 'Nuevo - Alt+N', prefixIcon: 'e-add', id: 'Nuevo' },'Search'];
    this.commands = [{ buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-edit'}, title:'Modificar' },
                     { buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-delete'}, title:'Eliminar' }
                    ];
    this.cargarRegistros();
  }

  cargarRegistros(): void {
    this.spinnerService.showGlobalSpinner();
    this.rolesService.todos().subscribe({
      next: (respuesta) => {
        this.spinnerService.hideGlobalSpinner();
        this.data = respuesta.isSuccess ? respuesta.result : []},
      error: (errores) => {
        this.spinnerService.hideGlobalSpinner();
        this.toastr.error(cadenaErrores(errores))}
    });
  }
  

  public commandClick(args: any): void {

    if (args.commandColumn.title && args.commandColumn.title=== 'Modificar')
    {
      const userId = args.rowData.id;
      this.router.navigate(['/rol/modificar', userId]);
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
      const respuesta: any = await firstValueFrom(this.rolesService.borrar(args.rowData.id));
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
      this.router.navigate(['/rol/nuevo']);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Combinación para 'Alt+N' - Nuevo
    if (event.altKey && event.key === 'n') {
      this.router.navigate(['/rol/nuevo']);
      event.preventDefault(); // Previene la acción por defecto (opcional)
    }
  }
  
}

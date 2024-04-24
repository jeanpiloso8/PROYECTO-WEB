import { Component, ViewChild , inject, HostListener ,ElementRef} from '@angular/core';
import { UsuariosService } from '../usuarios.service'
import { GridComponent, CommandModel , ToolbarItems} from '@syncfusion/ej2-angular-grids';
import { TipoAccion } from '../../../shared-features/enums/TipoAccion'
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../core/services/spinner.service';
import { cadenaErrores } from '../../../shared-features/utilities/parsearErrores'
import { SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
import { firstValueFrom } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalStateService } from '../../../core/services/modal-state.service'
import { SetPasswordComponent } from '../set-password/set-password.component'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrl: './listado-usuarios.component.scss'
})
export class ListadoUsuariosComponent {

  private readonly userService = inject(UsuariosService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly modalService = inject(NgbModal);
  private readonly modalStateService = inject(ModalStateService);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('grid') grid?: GridComponent;
  public data: any[] = [];
  public editSettings: Object = { allowEditing: false, allowAdding: true, allowDeleting: false, showDeleteConfirmDialog: true };
  public toolbar?: ToolbarItems[] | object;
  public commands?: CommandModel[];
  public pageSettings = { pageCount: 5 };
  public editparams = { params: { popupHeight: '300px' }};
  public tipoAccion = TipoAccion.Read;
  public rowData: any;
  public searchOptions?: SearchSettingsModel;
  

  constructor() {}

  ngOnInit(): void {
    this.toolbar = [{ text: 'Nuevo', tooltipText: 'Nuevo - Alt+N', prefixIcon: 'e-add', id: 'Nuevo' },'Search'];
    this.commands = [{ buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-edit'}, title:'Modificar' },
                     { buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-lock'} , title:'Set Password' },
                     { buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-delete'}, title:'Eliminar' },
                     ];
    this.cargarRegistros();
  }

  cargarRegistros(): void {
    this.spinnerService.showGlobalSpinner();
    this.userService.todos().subscribe({
      next: (respuesta) => {
        this.spinnerService.hideGlobalSpinner();
        this.data = respuesta.isSuccess ? respuesta.result : []},
      error: (errores) => {
        this.spinnerService.hideGlobalSpinner();
        this.toastr.error(cadenaErrores(errores));
      }
    });
  }

  public commandClick(args: any): void {

    if (args.commandColumn.title && args.commandColumn.title=== 'Modificar')
    {
      const userId = args.rowData.id;
      this.router.navigate(['/usuario/modificar', userId]);
    }
    else if (args.commandColumn.title && args.commandColumn.title=== 'Eliminar')
    {
      this.eliminar(args);
    }
    else if (args.commandColumn.title && args.commandColumn.title=== 'Set Password')
    {
      const modalRef = this.modalService.open(SetPasswordComponent);
      modalRef.componentInstance.id = args.rowData.id;
      modalRef.componentInstance.username = args.rowData.userName;
      this.modalStateService.setModalOpen(true);
      modalRef.result.then(() => {
        this.modalStateService.setModalOpen(false);
      });
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
      const respuesta: any = await firstValueFrom(this.userService.borrar(args.rowData.id));
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

transformRolesToBadgeArray(roles: string): string[] {
  return roles.split(', ');
}

  clickHandler(args: ClickEventArgs): void {
    
    if (args.item.id === 'Nuevo') {
      this.router.navigate(['/usuario/nuevo']);
    }
  }


  @HostListener('window:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  // Combinación para 'Alt+N' - Nuevo
  if (event.altKey && event.key === 'n') {
    this.router.navigate(['/usuario/nuevo']);
    event.preventDefault(); // Previene la acción por defecto (opcional)
  }
}
}

import { AfterViewInit, Component, inject, ViewChild , ElementRef} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { SpinnerService } from '../../core/services/spinner.service'
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { UsuariosService } from '../../views/usuarios/usuarios.service'
import { cilZoomIn, cilTrash, cilLibrary } from '@coreui/icons';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent
  ]
})
export class DefaultLayoutComponent implements AfterViewInit {
  
  private readonly spinnerService = inject(SpinnerService);
  private readonly userService = inject(UsuariosService);

  icons = { cilZoomIn, cilTrash, cilLibrary };
  navMenu! : any [];
  itemsMenu: any [];
  buscador = '';
  errores: string = '';

  @ViewChild('overflow') sidebar!: any;
  // @ViewChild('search') search!: ElementRef;

  constructor() {

    this.spinnerService.createGlobalSpinner();
    this.userService.getMenuUsuario().subscribe({
      next: (respuesta) => {
        // Asume que el body de la respuesta contiene los datos del menú
        // Ajusta según la estructura real de tu respuesta
        this.navMenu = respuesta.body;
        // this.itemsMenu = respuesta.body;

      },
      error: (errores) => {
        console.error(errores);
      }
    });
  }


  async ngAfterViewInit() {    
    // this.search.nativeElement.focus();
  }

  // filtrarMenu(args: any) {

  //   this.buscador = args.target.value;
  //   if (this.buscador.length > 0) {
  //     this.navMenu = this.items.filter(c=> c.name.toUpperCase().includes(this.buscador.toUpperCase()));
  //   }
  //   else {
  //     this.navMenu = this.itemsMenu;
  //   }
  // }

    onScrollbarUpdate($event: any) {
         if ($event.verticalUsed) {

    }
  }

//   filtrarMenu(event: any) {
//     const searchText = event.target.value.toLowerCase();
  
//     if (searchText) {
//       this.navMenu = this.filterNodes(this.itemsMenu, searchText);
//     } else {
//       this.navMenu = [...this.itemsMenu];  // reset to full menu if search is cleared
//     }
//   }
  

//   /**
//  * Recursively filter menu items based on search text.
//  */
// filterNodes(items: any[], searchText: string): any[] {
//   const filteredItems:any = [];

//   items.forEach(item => {
//     let { children } = item;
//     if (children && children.length > 0) {
//       // Recursively filter children
//       children = this.filterNodes(children, searchText);
//     }

//     // Add the item if it matches or any of its children matches
//     if (item.name.toLowerCase().indexOf(searchText) !== -1 || children.length > 0) {
//       filteredItems.push({
//         ...item,
//         children  // only add filtered children
//       });
//     }
//   });
//   return filteredItems;
// }
}

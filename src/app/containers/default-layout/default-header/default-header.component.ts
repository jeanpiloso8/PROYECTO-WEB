import { Component, DestroyRef, inject, Input } from '@angular/core';
import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  ProgressBarDirective,
  ProgressComponent,
  SidebarToggleDirective,
  TextColorDirective,
  ThemeDirective
} from '@coreui/angular';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, filter, map, tap } from 'rxjs/operators';
import { UsuariosService } from '../../../views/usuarios/usuarios.service'
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeProfilePicComponent } from '../../../shared-features/components/change-profile-pic/change-profile-pic.component';
import { ChangePasswordComponent } from '../../../shared-features/components/change-password/change-password.component';
import { ModalStateService } from '../../../core/services/modal-state.service'
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { Renderer2, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SecurityService } from 'src/app/core/services/security.service';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [ContainerComponent, 
    HeaderTogglerDirective, 
    SidebarToggleDirective, 
    IconDirective, 
    HeaderNavComponent, 
    NavItemComponent, 
    NavLinkDirective, 
    RouterLink, 
    RouterLinkActive, 
    NgTemplateOutlet, 
    BreadcrumbRouterComponent, 
    ThemeDirective, 
    DropdownComponent, 
    DropdownToggleDirective, 
    TextColorDirective, 
    AvatarComponent, 
    DropdownMenuDirective, 
    DropdownHeaderDirective, 
    DropdownItemDirective, 
    BadgeComponent, 
    DropdownDividerDirective, 
    ProgressBarDirective, 
    ProgressComponent, 
    DropDownListModule,
    NgStyle
  ]
})
export class DefaultHeaderComponent extends HeaderComponent implements AfterViewInit {
  @Input() sidebarId: string = 'sidebar1';
  public imagenUrl: string = "./assets/img/avatars/default.png";
  private destroy$ = new Subject<void>();

  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  
   // Injecting services directly in the properties.
   private readonly router = inject(Router);
   private readonly securityService = inject(SecurityService);
   private readonly userService = inject(UsuariosService);
   private readonly modalService = inject(NgbModal);
   private readonly toastr = inject(ToastrService);
   private readonly modalStateService = inject(ModalStateService);

  constructor(private renderer: Renderer2,
             @Inject(DOCUMENT) private document: Document) {
    super();
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');
    
  
    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          
          this.colorMode.set(theme);
          

        }),

        
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  async ngOnInit() {
    await this.getProfilePic();
  }

  ngAfterViewInit() {

    let temaPredeterminado = localStorage.getItem('coreui-free-angular-admin-template-theme-default') || 'light'; // Ejemplo: 'light' como predeterminado
    // Remueve las comillas del valor recuperado
    temaPredeterminado = temaPredeterminado?.replace(/"/g, '') || 'light'; // Remplaza las comillas dobles y usa 'light' como valor predeterminado si es null

    this.setTheme(temaPredeterminado);
  }
  
  setTheme(tema: string) {

    const temaUrl = tema === 'dark'
      ? 'https://cdn.syncfusion.com/ej2/22.1.34/bootstrap5-dark.css'
      : 'https://cdn.syncfusion.com/ej2/22.1.34/bootstrap5.css';


    const linkElement = this.document.getElementById('theme-link') as HTMLLinkElement;
    if (linkElement) {
      this.renderer.setAttribute(linkElement, 'href', temaUrl);
    } else {
      
      const linkEl = this.renderer.createElement('link');
      this.renderer.setAttribute(linkEl, 'rel', 'stylesheet');
      this.renderer.setAttribute(linkEl, 'id', 'theme-link');
      this.renderer.setAttribute(linkEl, 'href', temaUrl);
      this.renderer.appendChild(this.document.head, linkEl);
    }
  }
  
  
  logout(): void {
    try {
        this.securityService.logout();
        this.router.navigate(['/login']);
    } catch (error) {
        this.toastr.error('Error during logout');
        console.error(error);
    }
}

  changeProfilePic() {
      const modalRef = this.modalService.open(ChangeProfilePicComponent);
      this.modalStateService.setModalOpen(true);
      modalRef.result.then(() => {
        this.getProfilePic();
        this.modalStateService.setModalOpen(false);
      });
  }


  async getProfilePic() {
    try {
      const resultado = await this.userService.getProfilePic(); // Usar directamente await si ya es una Promise
      if (resultado) {
        const blob = new Blob([resultado], { type: 'image/jpeg' });
        this.imagenUrl = URL.createObjectURL(blob);
      }
    } catch (error) {
      // this.toastr.error('Failed to load profile picture');
      console.error(error);
    }
  }

  changePassword() {
      const modalRef = this.modalService.open(ChangePasswordComponent);
      this.modalStateService.setModalOpen(true);

      modalRef.result.then(() => {
        this.modalStateService.setModalOpen(false);
      });
  }

}
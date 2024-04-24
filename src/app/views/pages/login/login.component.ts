import { Component, OnInit , inject, DestroyRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { parsearErrores } from '../../../shared-features/utilities/parsearErrores'
import { firstValueFrom } from 'rxjs';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, 
         TextColorDirective, CardComponent, CardBodyComponent, FormDirective, 
         InputGroupComponent, InputGroupTextDirective, FormControlDirective, 
         ButtonDirective, SpinnerModule , ColorModeService} from '@coreui/angular';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { SecurityService } from '../../../core/services/security.service'
import { ReactiveFormsModule } from '@angular/forms';
import { delay, filter, map, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedFeaturesModule } from '../../../shared-features/shared-features.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ContainerComponent, 
            RowComponent, 
            ColComponent, 
            CardGroupComponent, 
            TextColorDirective, 
            CardComponent, 
            CardBodyComponent, 
            FormDirective, 
            InputGroupComponent, 
            InputGroupTextDirective, 
            IconDirective, 
            FormControlDirective, 
            ButtonDirective, 
            NgStyle,
            SpinnerModule,
            SharedFeaturesModule,
            ReactiveFormsModule]
          })

export class LoginComponent  implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly securityService = inject(SecurityService);

  loading = false;
  redirectURL = "";
  form: FormGroup = new FormGroup({});
  errores: string[] = [];

  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #colorModeService = inject(ColorModeService);
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly colorMode = this.#colorModeService.colorMode;

  constructor() {

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

     ngOnInit(): void {
      this.form = this.formBuilder.group({
        username: [
          '',
          {
            validators: [Validators.required],
          },
        ],
        password: [
          '',
          {
            validators: [Validators.required]
          }
        ]
      });
    }

    private async checkServerStatus(): Promise<boolean> {
      // Utiliza firstValueFrom para convertir el Observable a una Promise
      return firstValueFrom(this.securityService.checkServerStatus());
    }

    async onSubmit() {
      
      this.loading = true;
      if (await this.checkServerStatus()) {
        this.redirectURL = "/";
      
      this.securityService.login(this.form.value).subscribe({
        next: (respuesta: any) => {

          
          if (respuesta.isSuccess && respuesta.isSuccess==true) {
            this.securityService.saveSession(respuesta.result);
    
            let params = this.route.snapshot.queryParams;
            if (params['redirectURL']) {
              this.redirectURL = params['redirectURL'];
            }
    
            if (this.redirectURL) {
              this.router.navigateByUrl(this.redirectURL).catch(() => this.router.navigate(['/']));
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.loading = false;
            this.errores = parsearErrores(respuesta);
          }
        },
        error: (errores) => {
          this.loading = false;
          this.errores = parsearErrores(errores);
        }
      });
    
      }else {
        this.errores = [];
        this.loading = false;}

    }

}
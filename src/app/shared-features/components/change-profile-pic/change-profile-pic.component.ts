import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from '../../../views/usuarios/usuarios.service'
import { cadenaErrores, parsearErrores } from '../../../shared-features/utilities/parsearErrores';
import {  ButtonModule,
          CardModule,
          FormModule,
          GridModule,
          ButtonGroupModule,
          BadgeModule,
          SpinnerModule} from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-profile-pic',
  templateUrl: './change-profile-pic.component.html',
  styleUrl: './change-profile-pic.component.scss',
  standalone: true,
  imports: [ButtonModule,
            CardModule,
            FormModule,
            GridModule,
            ButtonGroupModule,
            BadgeModule,
            SpinnerModule,
            ReactiveFormsModule]
})
export class ChangeProfilePicComponent {

  private readonly activeModal = inject(NgbActiveModal);
  private readonly userService = inject(UsuariosService);
  private readonly toastr = inject(ToastrService);

  public loading = false;
  public imageModel: any;
  public selectedFile: any = null;


  @Input() errores: string[] = [];
  

  constructor() {
   
  }

  grabar() {
    if (this.selectedFile == null) {

      this.toastr.error('Seleccione una imagen válida.');
      
    } else if (!this.selectedFile.type.startsWith('image/')) {
      this.selectedFile = null;

      this.toastr.error('Sólo se permiten archivos tipo imagen.');

    } else {
      if (this.selectedFile.size > 1000000) {

        this.toastr.error('El tamaño de la imagen es mayor a 1MB.');

        return;
      } else {

        this.loading = true;
        this.userService.changeProfilePic(this.selectedFile).subscribe({
          next: (respuesta) => {

              this.toastr.success('Imagen de perfil actualizada correctamente.');
              this.loading = false;
              this.activeModal.close();

            
          },
          error: (error) => {
            // console.log(error);
            this.loading = false;
            this.toastr.error(cadenaErrores(error));
          }
        });
      }
    }    
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (_event) => {
      this.imageModel = reader.result;
    };
  }

  
cerrar()
{
  this.activeModal.close(); // O usar .close() según corresponda
}
}

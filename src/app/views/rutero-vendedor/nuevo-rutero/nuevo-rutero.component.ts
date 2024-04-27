import { Component } from '@angular/core';
import { TipoAccion } from 'src/app/shared-features/enums/TipoAccion';
@Component({
  selector: 'app-nuevo-rutero',
  templateUrl: './nuevo-rutero.component.html',
  styleUrl: './nuevo-rutero.component.scss'
})
export class NuevoRuteroComponent {
  errores: string[] = [];
  public StateEnum = TipoAccion.Create;
}

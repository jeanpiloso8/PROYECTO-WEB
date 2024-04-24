import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MostrarErroresComponent } from './components/mostrar-errores/mostrar-errores.component';


@NgModule({
  declarations: [MostrarErroresComponent],
  imports: [
    CommonModule
  ],
  exports: [
    MostrarErroresComponent  
  ]
})
export class SharedFeaturesModule { }

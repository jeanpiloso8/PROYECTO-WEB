import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';


@Component({
  selector: 'app-page401',
  templateUrl: './page401.component.html',
  styleUrl: './page401.component.scss',
  standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]
})
export class Page401Component {

  constructor(private router: Router) { }

  navigate() {
    this.router.navigateByUrl("/login");
 }

}

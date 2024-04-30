import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommandModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { DetMultimedia } from '../models/DetMultimedia';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listado-audio',
  templateUrl: './listado-audio.component.html',
  styleUrl: './listado-audio.component.scss'
})
export class ListadoAudioComponent implements OnInit {
  @Input() modelo: any;
  @Input() id: any;
  private readonly activeModal = inject(NgbActiveModal); 
  public toolbar?: ToolbarItems[] | object;
  public commands?: CommandModel[];
  public usernamerules = { required: true };
  public editparams = { params: { popupHeight: '500px' }};
  public pageOption: Object;
 dataImg : DetMultimedia[] = [];
 constructor(private toastr: ToastrService){ 

 }
  ngOnInit(): void {
    this.dataImg = this.modelo;
    this.commands = [{ buttonOption: { content: '', cssClass: 'e-outline e-small e-icons e-audio'}, title:'Reproducir' },
  ];
    this.pageOption = {pageCount: 5, pageSize:10};
  }

  cerrar() {
    this.activeModal.close(); // O usar .close() según corresponda
  }
  public commandClick(args: any): void{
    if (args.commandColumn.title && args.commandColumn.title=== 'Reproducir'){
      const detalle = args.rowData.detalle;
      const audio = new Audio(detalle);
    audio.play();
    this.toastr.success(`Reproduciendo Audio`, 'Información del Sistema');
    audio.addEventListener('ended', () => {
      this.toastr.info(`Fin de Reprodución`, 'Información del Sistema');
    });
    }
  }
}

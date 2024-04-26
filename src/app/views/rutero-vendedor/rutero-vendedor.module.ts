import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuteroVendedorRoutingModule } from './rutero-vendedor-routing.module';
import { ListadoRuteroComponent } from './listado-rutero/listado-rutero.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule, CardModule, FormModule, HeaderModule, SharedModule, UtilitiesModule , GridModule as GridCoreUI} from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { AggregateService, CommandColumnService, EditService, ExcelExportService, GridModule, GroupService, LazyLoadGroupService, PageService, PdfExportService, ResizeService, SearchService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';

@NgModule({
  declarations: [ListadoRuteroComponent],
  imports: [
    CommonModule,
    RuteroVendedorRoutingModule,
    ReactiveFormsModule,
    FormModule,
    IconModule,
    UtilitiesModule,
    AccordionModule,
    SharedModule,
    GridModule,
    CardModule,
    HeaderModule,
    ToolbarModule,
    ComboBoxModule,
    GridCoreUI,
    
  ],
  providers:[IconSetService,
    AggregateService, GroupService, EditService, ToolbarService, SortService, PageService,CommandColumnService,LazyLoadGroupService ,SearchService,ResizeService,
    ExcelExportService,PdfExportService]
})
export class RuteroVendedorModule { }

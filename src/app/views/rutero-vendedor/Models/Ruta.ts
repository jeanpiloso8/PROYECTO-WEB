export class CabRuta{
    id_cab? : number;
    fecha? : string;
    vendedor? : string;
    nvendedor? : string;
    estado? : string; 
    observacion? : string; 
    RutasDetalles?: DetRuta[];
   }
   export class DetRuta  {
   id_cab? : number;
   vendedor?: string;
   cliente?: string;
   ncliente?:string;
   direccion?:string;
   telefono?: string;
   estado? :string;
   cnoFormulario?: string;
   }
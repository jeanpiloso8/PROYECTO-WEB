export class CabRuta{
    id_cab? : number;
    fecha? : string;
    vendedor? : string;
    estado? : string; 
    observacion? : string; 
    rutaDet?: DetRuta[];
   }
   export class DetRuta  {
id_cab? : number;
   codigo_cliente?: string;
   direccion?:string;
   telefono?: string;
   estado? :string;
   cnoFormulario?: string;
   }
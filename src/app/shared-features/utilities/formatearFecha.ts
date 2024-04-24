import { format } from "date-fns";

export function formatearFecha(fecha: Date): string {
   return format(fecha, 'yyyy-MM-dd HH:mm:ss')
}
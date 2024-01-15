// empleado.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private empleados = new BehaviorSubject<any>([]);
  empleados$ = this.empleados.asObservable();

  agregarEmpleado(empleado: any) {
    const valorActual = this.empleados.value;
    this.empleados.next([...valorActual, empleado]);
  }

  editarEmpleado(index: number, empleado: any) {
    const valorActual = this.empleados.value;
    valorActual[index] = empleado;
    this.empleados.next(valorActual);
  }

  eliminarEmpleado(index: number) {
    const valorActual = this.empleados.value;
    valorActual.splice(index, 1);
    this.empleados.next(valorActual);
  }

  cambiarEstatus(index: number) {
    const valorActual = this.empleados.value;
    valorActual[index].estatus = !valorActual[index].estatus;
    this.empleados.next(valorActual);
  }
}

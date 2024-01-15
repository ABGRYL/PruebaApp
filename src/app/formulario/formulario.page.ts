// formulario.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from '../empleado.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage implements OnInit {
  form: FormGroup;
  empleadoIndex: number | null = null;
  cargos = [
    { id: 1, descripcion: 'Gerente' },
    { id: 2, descripcion: 'Coordinador' },
    { id: 3, descripcion: 'Subdirector' }
  ];
  empleados$ = this.empleadoService.empleados$;

  filtro = '';
  pagina = 0;
  elementosPorPagina = 5;

  constructor(private fb: FormBuilder, private empleadoService: EmpleadoService, private alertController: AlertController) {
    this.form = this.fb.group({
      nombreCompleto: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      edad: ['', Validators.required],
      cargo: ['', Validators.required],
      estatus: [true]
    });
  }

  ngOnInit() {}

  agregarEmpleado() {
    if (this.empleadoIndex !== null) {
      // Si estamos editando un empleado, actualiza el empleado existente
      this.empleadoService.editarEmpleado(this.empleadoIndex, this.form.value);
      this.empleadoIndex = null;
    } else {
      // Si estamos agregando un nuevo empleado, agrega el empleado
      const empleadoConId = {
        ...this.form.value,
        id: Math.floor(Math.random() * 1000) // Genera un número aleatorio entre 0 y 9999
      };
      this.empleadoService.agregarEmpleado(empleadoConId);
    }
    this.form.reset({ estatus: true });
  }

  // Agrega una nueva función para iniciar la edición de un empleado
// Agrega una nueva función para iniciar la edición de un empleado
async iniciarEdicionEmpleado(index: number, empleado: any) {
  if (!empleado.estatus) {
    this.empleadoIndex = index;
    this.form.patchValue(empleado);
  } else {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: 'No se puede editar un empleado con estatus activo',
      buttons: ['OK']
    });

    await alert.present();
  }
}

  editarEmpleado(index: number, empleado: any) {
    this.empleadoService.editarEmpleado(index, empleado);
  }

  eliminarEmpleado(index: number) {
    this.empleadoService.eliminarEmpleado(index);
  }

  cambiarEstatus(index: number) {
    this.empleadoService.cambiarEstatus(index);
  }

  getCargoDescripcion(id: number): string {
  const cargo = this.cargos.find(cargo => cargo.id === id);
  return cargo ? cargo.descripcion : '';
  }

  get empleadosFiltrados() {
    let empleados: any[] = [];
    this.empleados$.subscribe(data => {
      empleados = data;
    });
    return empleados.filter((empleado: any) =>
      empleado.nombreCompleto.includes(this.filtro) ||
      empleado.id.toString().includes(this.filtro) ||
      this.getCargoDescripcion(empleado.cargo).includes(this.filtro)
    );
  }

  paginaAnterior() {
    if (this.pagina > 0) {
      this.pagina--;
    }
  }
  
  paginaSiguiente() {
    if (this.pagina < (this.empleadosFiltrados.length / this.elementosPorPagina) - 1) {
      this.pagina++;
    }
  }

}

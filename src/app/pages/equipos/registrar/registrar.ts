import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../../shared/sidebar/sidebar';

export interface Miembro {
  nombre: string;
  raza: string;
  poder: number;
  estado: 'activo' | 'en_mision' | 'reposo';
}

export interface Equipo {
  id: number;
  nombre: string;
  tipo: 'sayayin' | 'soldado' | 'mercenario' | 'elite';
  rango: string;
  poderTotal: number;
  maxMisiones: number;
  especializaciones: string[];
  observaciones: string;
  miembros: Miembro[];
  estado: 'activo' | 'en_mision' | 'reposo';
  emoji: string;
}

@Component({
  selector: 'app-registrar-equipo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './registrar.html',
  styleUrl: './registrar.scss'
})
export class RegistrarEquipoComponent {

  // ── Formulario nuevo equipo ──
  nuevoEquipo = {
    nombre: '',
    tipo: '',
    rango: 'D',
    poderTotal: 0,
    maxMisiones: 1,
    observaciones: '',
  };

  especializaciones = {
    exterminio: false,
    captura: false,
    reconocimiento: false,
    extraccion: false,
  };

  // ── Nuevo miembro temporal ──
  nuevoMiembro = { nombre: '', raza: 'Sayayin', poder: 0 };

  // ── Miembros en el formulario actual ──
  miembrosActuales: Miembro[] = [
    { nombre: 'Raditz', raza: 'Sayayin', poder: 1200,  estado: 'activo' },
    { nombre: 'Nappa',  raza: 'Sayayin', poder: 4000,  estado: 'activo' },
    { nombre: 'Zarbon', raza: 'Élite',   poder: 23000, estado: 'en_mision' },
  ];

  // ── Filtro lista equipos ──
  filtroEquipos = '';
  filtroTipo    = '';

  // ── Equipos existentes ──
  equipos: Equipo[] = [
    { id:1, nombre:'Escuadrón Vegeta',      tipo:'sayayin',  rango:'A',  poderTotal:120000, maxMisiones:3, especializaciones:['Exterminio'],       observaciones:'', miembros:[], estado:'activo',    emoji:'🔥' },
    { id:2, nombre:'Fuerza Élite Frieza-1', tipo:'elite',    rango:'S',  poderTotal:530000, maxMisiones:5, especializaciones:['Exterminio','Captura'], observaciones:'', miembros:[], estado:'en_mision', emoji:'⚡' },
    { id:3, nombre:'Mercenarios Guldo',      tipo:'mercenario',rango:'B', poderTotal:44500,  maxMisiones:2, especializaciones:['Captura'],           observaciones:'', miembros:[], estado:'activo',    emoji:'🗡' },
    { id:4, nombre:'Ginyu Force',            tipo:'elite',    rango:'S+', poderTotal:120000, maxMisiones:4, especializaciones:['Exterminio','Reconocimiento'], observaciones:'', miembros:[], estado:'en_mision', emoji:'💀' },
    { id:5, nombre:'Unidad Dodoria',         tipo:'soldado',  rango:'A',  poderTotal:22000,  maxMisiones:3, especializaciones:['Extracción'],        observaciones:'', miembros:[], estado:'activo',    emoji:'🌀' },
  ];

  // ── Toast ──
  toastVisible  = false;
  toastMensaje  = '';
  private toastTimer: any;

  // ── Disponibilidad ──
  get disponibles() { return this.equipos.filter(e => e.estado === 'activo').length; }
  get enMision()    { return this.equipos.filter(e => e.estado === 'en_mision').length; }
  get enReposo()    { return this.equipos.filter(e => e.estado === 'reposo').length; }

  get equiposFiltrados(): Equipo[] {
    return this.equipos.filter(e => {
      const matchTexto = !this.filtroEquipos || e.nombre.toLowerCase().includes(this.filtroEquipos.toLowerCase());
      const matchTipo  = !this.filtroTipo   || e.tipo === this.filtroTipo;
      return matchTexto && matchTipo;
    });
  }

  agregarMiembro() {
    if (!this.nuevoMiembro.nombre) return;
    this.miembrosActuales.push({
      nombre: this.nuevoMiembro.nombre,
      raza:   this.nuevoMiembro.raza,
      poder:  this.nuevoMiembro.poder,
      estado: 'activo',
    });
    this.nuevoMiembro = { nombre: '', raza: 'Sayayin', poder: 0 };
    this.mostrarToast('Miembro añadido al equipo ⚔️');
  }

  eliminarMiembro(i: number) {
    this.miembrosActuales.splice(i, 1);
  }

  registrarEquipo() {
    if (!this.nuevoEquipo.nombre || !this.nuevoEquipo.tipo) {
      this.mostrarToast('⚠ Completa nombre y tipo de unidad');
      return;
    }

    const specs = Object.entries(this.especializaciones)
      .filter(([, v]) => v)
      .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));

    const emojis: Record<string, string> = { sayayin:'🔥', soldado:'⚡', mercenario:'🗡', elite:'💀' };

    const equipo: Equipo = {
      id:               this.equipos.length + 1,
      nombre:           this.nuevoEquipo.nombre,
      tipo:             this.nuevoEquipo.tipo as any,
      rango:            this.nuevoEquipo.rango,
      poderTotal:       this.miembrosActuales.reduce((a, m) => a + m.poder, 0) || this.nuevoEquipo.poderTotal,
      maxMisiones:      this.nuevoEquipo.maxMisiones,
      especializaciones: specs,
      observaciones:    this.nuevoEquipo.observaciones,
      miembros:         [...this.miembrosActuales],
      estado:           'activo',
      emoji:            emojis[this.nuevoEquipo.tipo] ?? '⚔️',
    };

    this.equipos.unshift(equipo);
    this.resetForm();
    this.mostrarToast('Equipo registrado exitosamente en el sistema imperial 🚀');
  }

  resetForm() {
    this.nuevoEquipo = { nombre:'', tipo:'', rango:'D', poderTotal:0, maxMisiones:1, observaciones:'' };
    this.especializaciones = { exterminio:false, captura:false, reconocimiento:false, extraccion:false };
    this.miembrosActuales = [];
  }

  mostrarToast(msg: string) {
    this.toastMensaje = msg;
    this.toastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible = false, 3200);
  }

  badgeTipo(tipo: string): string {
    const map: Record<string, string> = {
      sayayin:   'badge-sayayin',
      soldado:   'badge-soldado',
      mercenario:'badge-mercenario',
      elite:     'badge-elite',
    };
    return map[tipo] ?? '';
  }

  labelTipo(tipo: string): string {
    const map: Record<string, string> = {
      sayayin:   'Sayayin',
      soldado:   'Soldado',
      mercenario:'Mercenario',
      elite:     'Élite Imperial',
    };
    return map[tipo] ?? tipo;
  }

  badgeEstadoMiembro(estado: string): string {
    return estado === 'activo' ? 'badge-activo' : estado === 'en_mision' ? 'badge-mision' : 'badge-reposo';
  }

  badgeEstadoEquipo(estado: string): string {
    return estado === 'activo' ? 'badge-activo' : estado === 'en_mision' ? 'badge-mision' : 'badge-reposo';
  }

  labelEstadoEquipo(estado: string): string {
    return estado === 'activo' ? '● Activo' : estado === 'en_mision' ? '● En Misión' : '◌ Reposo';
  }

  formatPoder(v: number): string {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
    if (v >= 1_000)     return (v / 1_000).toFixed(0) + 'k';
    return String(v);
  }
}
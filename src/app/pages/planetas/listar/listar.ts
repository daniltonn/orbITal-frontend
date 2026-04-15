// ──────────────────────────────────────────────────────────
// Listar Planetas — HU2
// Como Comandante de Flota quiero consultar los planetas
// registrados para identificar posibles objetivos de misión
// ──────────────────────────────────────────────────────────

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { Background } from '../../../shared/backgrounds/login/login';

// Interfaz que define la estructura de un planeta en el catálogo
export interface Planeta {
  id: number;
  nombre: string;
  sector: string;
  coordenadas: string;
  nivelTec: number;
  recursos: string;
  poderNativo: number;
  valorEstimado: number;
  estado: 'disponible' | 'en_mision' | 'vendido' | 'evaluacion' | 'peligroso';
  color: string; // color identificador del punto en la tabla
}

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar, Background],
  templateUrl: './listar.html',
  styleUrl: './listar.scss'
})
export class ListarComponent implements OnInit {

  // ── Variables de filtrado (enlazadas con el toolbar via [(ngModel)]) ──
  filtroTexto  = '';
  filtroEstado = '';
  filtroSector = '';

  // ── Control del modal de nuevo planeta ──
  modalAbierto = false;

  // ── Control del toast de confirmación ──
  toastVisible = false;
  toastMensaje = '';
  private toastTimer: any;

  // ── Modelo del formulario dentro del modal ──
  nuevoPlaneta = {
    nombre: '', sector: '', coordenadas: '',
    nivelTec: '1', poderNativo: 0, recursos: '', valorEstimado: 0
  };

  // ── Catálogo de planetas ──
  // 🔧 MOCK: datos simulados hasta que el equipo de backend entregue el endpoint
  planetas: Planeta[] = [
    { id:1, nombre:'Namek',      sector:'SEC-7G', coordenadas:'0423-N', nivelTec:4, recursos:'Esferas del dragón, agua',       poderNativo:72000,  valorEstimado:4500000,  estado:'disponible', color:'#00e5a0' },
    { id:2, nombre:'Vegeta',     sector:'SEC-3A', coordenadas:'0011-V', nivelTec:7, recursos:'Minerales Z, esclavos élite',    poderNativo:120000, valorEstimado:8200000,  estado:'peligroso',  color:'#ffb020' },
    { id:3, nombre:'Freezia-04', sector:'SEC-1B', coordenadas:'0099-F', nivelTec:2, recursos:'Cristales de energía',           poderNativo:8000,   valorEstimado:1100000,  estado:'en_mision',  color:'#7b5cf0' },
    { id:4, nombre:'Arlia',      sector:'SEC-5C', coordenadas:'0202-A', nivelTec:3, recursos:'Fauna exótica, metales raros',   poderNativo:29000,  valorEstimado:2750000,  estado:'evaluacion', color:'#00c9ff' },
    { id:5, nombre:'Kanassa',    sector:'SEC-9D', coordenadas:'0451-K', nivelTec:5, recursos:'Psiónico, población valiosa',    poderNativo:45000,  valorEstimado:3900000,  estado:'vendido',    color:'#5a7090' },
    { id:6, nombre:'Yardrat',    sector:'SEC-4E', coordenadas:'0318-Y', nivelTec:6, recursos:'Tecnología de teletransporte',   poderNativo:35000,  valorEstimado:5100000,  estado:'disponible', color:'#00e5a0' },
    { id:7, nombre:'Meat',       sector:'SEC-2F', coordenadas:'0078-M', nivelTec:1, recursos:'Minerales básicos',              poderNativo:1200,   valorEstimado:190000,   estado:'disponible', color:'#ff4560' },
    { id:8, nombre:'Ceresia',    sector:'SEC-6G', coordenadas:'0502-C', nivelTec:8, recursos:'Mineral de vida, reservas agua', poderNativo:98000,  valorEstimado:11400000, estado:'en_mision',  color:'#ffb020' },
  ];

  // Router inyectado para navegar a la pantalla de asignar misión
  constructor(private router: Router) {}

  ngOnInit(): void {}

  // Filtra planetas según texto libre (nombre, recursos o sector), estado y sector
  get planetasFiltrados(): Planeta[] {
    return this.planetas.filter(p => {
      const matchTexto  = !this.filtroTexto  || p.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) || p.recursos.toLowerCase().includes(this.filtroTexto.toLowerCase()) || p.sector.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const matchEstado = !this.filtroEstado || p.estado === this.filtroEstado;
      const matchSector = !this.filtroSector || p.sector === this.filtroSector;
      return matchTexto && matchEstado && matchSector;
    });
  }

  // Retorna lista de sectores sin duplicados para poblar el select del toolbar
  get sectoresUnicos(): string[] {
    return [...new Set(this.planetas.map(p => p.sector))];
  }

  // Cuenta cuántos planetas tienen un estado específico (usado en las stat cards)
  contarEstado(estado: string): number {
    return this.planetas.filter(p => p.estado === estado).length;
  }

  // Convierte número a romano para mostrar nivel tecnológico (ej: 4 → IV)
  toRoman(n: number): string {
    const map: Record<number, string> = {
      1:'I', 2:'II', 3:'III', 4:'IV', 5:'V',
      6:'VI', 7:'VII', 8:'VIII', 9:'IX', 10:'X'
    };
    return map[n] ?? String(n);
  }

  // Calcula el porcentaje de poder de un planeta relativo al máximo del catálogo
  // Usado para determinar el ancho de la barra de poder en la tabla
  poderPorcentaje(poder: number): number {
    const max = Math.max(...this.planetas.map(p => p.poderNativo));
    return Math.round((poder / max) * 100);
  }

  // Retorna la clase CSS del badge según el estado del planeta
  badgeEstado(estado: string): string {
    const map: Record<string, string> = {
      disponible: 'badge-disponible',
      en_mision:  'badge-mision',
      vendido:    'badge-vendido',
      evaluacion: 'badge-evaluacion',
      peligroso:  'badge-peligroso',
    };
    return map[estado] ?? '';
  }

  // Retorna el texto visible del badge según el estado del planeta
  labelEstado(estado: string): string {
    const map: Record<string, string> = {
      disponible: '● Disponible',
      en_mision:  '● En Misión',
      vendido:    '✓ Vendido',
      evaluacion: '◈ Evaluación',
      peligroso:  '⚠ Peligroso',
    };
    return map[estado] ?? estado;
  }

  // Abre y cierra el modal de registro de nuevo planeta
  abrirModal()  { this.modalAbierto = true;  }
  cerrarModal() { this.modalAbierto = false; }

  // Agrega un nuevo planeta al catálogo con estado inicial 'evaluacion'
  // 🔧 MOCK: reemplazar por llamada al servicio cuando esté disponible el endpoint
  registrarPlaneta() {
    if (!this.nuevoPlaneta.nombre) return; // Validación: nombre requerido
    const nuevo: Planeta = {
      id:            this.planetas.length + 1,
      nombre:        this.nuevoPlaneta.nombre,
      sector:        this.nuevoPlaneta.sector,
      coordenadas:   this.nuevoPlaneta.coordenadas,
      nivelTec:      Number(this.nuevoPlaneta.nivelTec),
      recursos:      this.nuevoPlaneta.recursos,
      poderNativo:   this.nuevoPlaneta.poderNativo,
      valorEstimado: this.nuevoPlaneta.valorEstimado,
      estado:        'evaluacion', // todo planeta nuevo entra en evaluación
      color:         '#7b5cf0',
    };
    this.planetas.unshift(nuevo); // inserta al inicio para mostrar el más reciente primero
    this.cerrarModal();
    this.mostrarToast('Planeta registrado en el catálogo imperial 🪐');
    // Resetea el formulario del modal para el próximo uso
    this.nuevoPlaneta = { nombre:'', sector:'', coordenadas:'', nivelTec:'1', poderNativo:0, recursos:'', valorEstimado:0 };
  }

  // Navega a la pantalla de asignar misión pasando el ID del planeta como query param
  asignarMision(planeta: Planeta) {
    this.router.navigate(['/misiones/asignar'], { queryParams: { planetaId: planeta.id } });
  }

  // Muestra un toast de confirmación durante 3.2 segundos
  mostrarToast(msg: string) {
    this.toastMensaje = msg;
    this.toastVisible = true;
    clearTimeout(this.toastTimer); // cancela timer previo para evitar cierres prematuros
    this.toastTimer = setTimeout(() => this.toastVisible = false, 3200);
  }

  // Formatea el valor estimado en M (millones) o k (miles) con símbolo ₹
  formatValor(v: number): string {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M ₹';
    if (v >= 1_000)     return (v / 1_000).toFixed(0) + 'k ₹';
    return v + ' ₹';
  }

  // Formatea el poder nativo en k (miles) para mejor legibilidad
  formatPoder(v: number): string {
    if (v >= 1_000) return (v / 1_000).toFixed(0) + 'k';
    return String(v);
  }
}
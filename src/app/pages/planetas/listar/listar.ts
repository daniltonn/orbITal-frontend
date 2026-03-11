import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  color: string;
}

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar.html',
  styleUrl: './listar.scss'
})
export class ListarComponent implements OnInit {

  filtroTexto = '';
  filtroEstado = '';
  filtroSector = '';

  modalAbierto = false;
  toastVisible = false;
  toastMensaje = '';
  private toastTimer: any;

  nuevoPlaneta = {
    nombre: '', sector: '', coordenadas: '',
    nivelTec: '1', poderNativo: 0, recursos: '', valorEstimado: 0
  };

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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  get planetasFiltrados(): Planeta[] {
    return this.planetas.filter(p => {
      const matchTexto  = !this.filtroTexto  || p.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) || p.recursos.toLowerCase().includes(this.filtroTexto.toLowerCase()) || p.sector.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const matchEstado = !this.filtroEstado || p.estado === this.filtroEstado;
      const matchSector = !this.filtroSector || p.sector === this.filtroSector;
      return matchTexto && matchEstado && matchSector;
    });
  }

  get sectoresUnicos(): string[] {
    return [...new Set(this.planetas.map(p => p.sector))];
  }

  contarEstado(estado: string): number {
    return this.planetas.filter(p => p.estado === estado).length;
  }

  toRoman(n: number): string {
    const map: Record<number, string> = {
      1:'I', 2:'II', 3:'III', 4:'IV', 5:'V',
      6:'VI', 7:'VII', 8:'VIII', 9:'IX', 10:'X'
    };
    return map[n] ?? String(n);
  }

  poderPorcentaje(poder: number): number {
    const max = Math.max(...this.planetas.map(p => p.poderNativo));
    return Math.round((poder / max) * 100);
  }

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

  abrirModal()  { this.modalAbierto = true; }
  cerrarModal() { this.modalAbierto = false; }

  registrarPlaneta() {
    if (!this.nuevoPlaneta.nombre) return;
    const nuevo: Planeta = {
      id:            this.planetas.length + 1,
      nombre:        this.nuevoPlaneta.nombre,
      sector:        this.nuevoPlaneta.sector,
      coordenadas:   this.nuevoPlaneta.coordenadas,
      nivelTec:      Number(this.nuevoPlaneta.nivelTec),
      recursos:      this.nuevoPlaneta.recursos,
      poderNativo:   this.nuevoPlaneta.poderNativo,
      valorEstimado: this.nuevoPlaneta.valorEstimado,
      estado:        'evaluacion',
      color:         '#7b5cf0',
    };
    this.planetas.unshift(nuevo);
    this.cerrarModal();
    this.mostrarToast('Planeta registrado en el catálogo imperial 🪐');
    this.nuevoPlaneta = { nombre:'', sector:'', coordenadas:'', nivelTec:'1', poderNativo:0, recursos:'', valorEstimado:0 };
  }

  asignarMision(planeta: Planeta) {
    this.router.navigate(['/app/misiones/asignar'], { queryParams: { planetaId: planeta.id } });
  }

  mostrarToast(msg: string) {
    this.toastMensaje = msg;
    this.toastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible = false, 3200);
  }

  formatValor(v: number): string {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M ₹';
    if (v >= 1_000)     return (v / 1_000).toFixed(0) + 'k ₹';
    return v + ' ₹';
  }

  formatPoder(v: number): string {
    if (v >= 1_000) return (v / 1_000).toFixed(0) + 'k';
    return String(v);
  }
}
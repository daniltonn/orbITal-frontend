import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/ApiService';
import {
  CreatePlanetDto,
  PlanetaEstadoDto,
  GalaxiaDto,
  AtmosferaDto,
  RecursoDto,
  RecursoCreateDto,
  RecursoPlanetaCreateDto,
} from '../models/planet.dto';

// Mapa al valor entero del enum NivelTecnologico en el backend (1-based: Primitivo=1, Medieval=2, Avanzado=3, Interestelar=4)
const TECH_LEVEL_NUMS: Record<string, number> = {
  'primitive':    1,
  'medieval':     2,
  'advanced':     3,
  'interstellar': 4,
};

const LIFE_LEVEL_NAMES: Record<string, string> = {
  'low':       'Bajo',
  'medium':    'Medio',
  'high':      'Alto',
  'advanced':  'Avanzado',
  'primitive': 'Primitiva',
};

@Injectable({ providedIn: 'root' })
export class PlanetService {

  constructor(private api: ApiService) {}

  getEstados(): Observable<PlanetaEstadoDto[]> {
    return this.api.get<PlanetaEstadoDto[]>('PlanetaEstado');
  }

  getGalaxias(): Observable<GalaxiaDto[]> {
    return this.api.get<any>('Galaxias').pipe(
      map(res => res?.data ?? res)
    );
  }

  getAtmosferas(): Observable<AtmosferaDto[]> {
    return this.api.get<any>('Atmosferas').pipe(
      map(res => res?.data ?? res)
    );
  }

  getRecursos(): Observable<RecursoDto[]> {
    return this.api.get<any>('Recursos').pipe(
      map(res => res?.data ?? res)
    );
  }

  getPlanetas(): Observable<any[]> {
    return this.api.get<any[]>('Planetas');
  }

  crearRecurso(dto: RecursoCreateDto): Observable<RecursoDto> {
    return this.api.post('Recursos', dto).pipe(
      map(res => res?.data ?? res)
    );
  }

  asignarRecurso(dto: RecursoPlanetaCreateDto): Observable<any> {
    return this.api.post('RecursosPlanetarios', dto).pipe(
      map(res => res?.data ?? res)
    );
  }

  create(dto: CreatePlanetDto): Observable<any> {
    const payload = {
      Nombre:               dto.name,
      Id_Galaxia:           dto.galaxy,
      Nivel_Tecnologico:    dto.techLevel != null ? (TECH_LEVEL_NUMS[dto.techLevel] ?? 0) : 0,
      Id_Atmosfera:         dto.atmosphere,
      Poblacion:            dto.estimatedPop,
      Nivel_Vida_Planeta:   dto.lifeLevel ? (LIFE_LEVEL_NAMES[dto.lifeLevel] ?? 'Bajo') : 'Bajo',
      Id_Estado:            dto.status ?? 1,
      Fecha_Descubrimiento: dto.identificationDate
        ? new Date(dto.identificationDate).toISOString()
        : new Date().toISOString(),
      Descripcion: dto.description || null,
      Color1:      dto.primaryColor   || null,
      Color2:      dto.secondaryColor || null,
      Color3:      dto.accentColor    || null,
      Activo:      true,
      CoordenadaX: dto.coordinates.x,
      CoordenadaY: dto.coordinates.y,
      CoordenadaZ: dto.coordinates.z,
    };

    return this.api.post('Planetas', payload);
  }
}

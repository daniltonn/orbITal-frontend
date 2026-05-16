export type TechLevel = 'primitive' | 'medieval' | 'advanced' | 'interstellar';
export type LifeLevel = 'low' | 'medium' | 'high' | 'advanced' | 'primitive';

export interface PlanetCoordinates {
  x: number | null;
  y: number | null;
  z: number | null;
}

// ── Catálogos del backend ─────────────────────────────────────────────────

export interface GalaxiaDto {
  id_Galaxia: number;
  nombre:     string;
}

export interface AtmosferaDto {
  id_Atmosfera: number;
  nombre:       string;
  descripcion:  string | null;
}

export interface RecursoDto {
  id_Recurso:    number;
  nombre:        string;
  tipo_Recurso:  string;
  unidad_Medida: string;
}

export interface PlanetaEstadoDto {
  id_Estado:   number;
  nombre:      string;
  descripcion: string | null;
}

// ── DTOs de envío ─────────────────────────────────────────────────────────

export interface RecursoCreateDto {
  nombre:         string;
  tipo_Recurso:   string;
  unidad_Medida?: string;
  rareza?:        string;
  descripcion?:   string;
}

export interface RecursoPlanetaCreateDto {
  id_Planeta:        number;
  id_Recurso:        number;
  cantidad_Estimada: number;
}

export interface PlanetResource {
  idRecurso: number | null;  // null cuando el usuario crea un recurso nuevo (no del catálogo)
  name:      string;
  unit:      string;
  quantity:  number | null;
}

export interface CreatePlanetDto {
  name:               string;
  identificationDate: string | null;
  coordinates:        PlanetCoordinates;
  galaxy:             number | null;   // id_Galaxia
  estimatedPop:       number | null;
  description:        string;
  primaryColor:       string;
  secondaryColor:     string;
  accentColor:        string;
  status:             number | null;   // Id_Estado
  atmosphere:         number | null;   // id_Atmosfera
  techLevel:          TechLevel | null;
  lifeLevel:          LifeLevel | null;
  resources:          PlanetResource[];
}

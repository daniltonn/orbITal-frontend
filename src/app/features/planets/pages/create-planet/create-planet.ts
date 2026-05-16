import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { forkJoin, of, switchMap, map, timer, catchError, Observable } from 'rxjs';

import { PlanetGeneralPanel }   from '../../components/planet-general-panel/planet-general-panel';
import { PlanetResourcesPanel } from '../../components/planet-resources-panel/planet-resources-panel';
import { PlanetService }        from '../../services/planet.service';
import { CreatePlanetDto, GalaxiaDto, AtmosferaDto, RecursoDto, RecursoCreateDto } from '../../models/planet.dto';
import { Background }           from '../../../../shared/backgrounds/login/login';
import { Sidebar }              from '../../../../shared/sidebar/sidebar';

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

@Component({
  selector:    'app-create-planet',
  standalone:  true,
  imports:     [CommonModule, RouterModule, ReactiveFormsModule, PlanetGeneralPanel, PlanetResourcesPanel, Background, Sidebar],
  templateUrl: './create-planet.html',
  styleUrl:    './create-planet.scss',
})
export class CreatePlanet implements OnInit {

  form!: FormGroup;
  saved    = false;
  saving   = false;
  errorMsg = '';

  estadoOptions:    { id: number; label: string }[] = [];
  galaxiaOptions:   GalaxiaDto[]  = [];
  atmosferaOptions: AtmosferaDto[] = [];
  recursoOptions:   RecursoDto[]  = [];

  constructor(
    private fb:            FormBuilder,
    private planetService: PlanetService,
  ) {}

  private nameExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const raw = (control.value as string)?.trim();
      if (!raw) return of(null);
      const normalized = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
      return timer(600).pipe(
        switchMap(() => this.planetService.getPlanetas()),
        map((response: any) => {
          const planets: any[] = Array.isArray(response)
            ? response
            : (response?.data ?? response?.items ?? response?.value ?? []);
          const exists = planets.some(p => {
            const nombre =
              p.nombre ?? p.Nombre ??
              (Object.entries(p as Record<string, any>)
                .find(([k]) => k.toLowerCase() === 'nombre')?.[1] ?? '');
            return String(nombre).toLowerCase() === normalized.toLowerCase();
          });
          return exists ? { nameExists: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name:               ['', [Validators.required, Validators.maxLength(40)], [this.nameExistsValidator()]],
      identificationDate: [null, Validators.required],
      coordinates: this.fb.group({
        x: [null, [Validators.required, Validators.min(-999999), Validators.max(999999)]],
        y: [null, [Validators.required, Validators.min(-999999), Validators.max(999999)]],
        z: [null, [Validators.required, Validators.min(-999999), Validators.max(999999)]],
      }),
      galaxy:         [null, Validators.required],
      estimatedPop:   [null, [Validators.required, Validators.min(0), Validators.max(1000000000000)]],
      description:    ['', Validators.maxLength(500)],
      primaryColor:   ['#b073ff', [Validators.required, Validators.pattern(HEX_PATTERN)]],
      secondaryColor: ['#4b8cff', [Validators.required, Validators.pattern(HEX_PATTERN)]],
      accentColor:    ['#4be3d0', [Validators.required, Validators.pattern(HEX_PATTERN)]],
      status:         [null, Validators.required],
      atmosphere:     [null, Validators.required],
      techLevel:      [null, Validators.required],
      lifeLevel:      [null, Validators.required],
      resources:      this.fb.array([]),
    });

    forkJoin({
      estados:    this.planetService.getEstados(),
      galaxias:   this.planetService.getGalaxias(),
      atmosferas: this.planetService.getAtmosferas(),
      recursos:   this.planetService.getRecursos(),
    }).subscribe({
      next: ({ estados, galaxias, atmosferas, recursos }) => {
        this.estadoOptions    = estados.map(e => ({ id: e.id_Estado, label: e.nombre }));
        this.galaxiaOptions   = galaxias;
        this.atmosferaOptions = atmosferas;
        this.recursoOptions   = recursos;
      },
    });
  }

  get resourcesArray(): FormArray {
    return this.form.get('resources') as FormArray;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const invalids = this.collectInvalidControls(this.form);
      console.warn('[CreatePlanet] Formulario inválido. Campos con error:', invalids);
      return;
    }

    this.saving = true;
    const v = this.form.value;

    const dto: CreatePlanetDto = {
      name:               v.name,
      identificationDate: v.identificationDate,
      coordinates:        v.coordinates,
      galaxy:             v.galaxy,
      estimatedPop:       v.estimatedPop,
      description:        v.description,
      primaryColor:       v.primaryColor,
      secondaryColor:     v.secondaryColor,
      accentColor:        v.accentColor,
      status:             v.status,
      atmosphere:         v.atmosphere,
      techLevel:          v.techLevel,
      lifeLevel:          v.lifeLevel,
      resources:          v.resources,
    };

    this.errorMsg = '';

    // Si un recurso "nuevo" ya existe en el catálogo por nombre, reutilizar su ID
    const allResources: any[] = v.resources;
    const preResolved = allResources.map(r => {
      if (r.idRecurso != null || !r.name?.trim()) return r;
      const match = this.recursoOptions.find(
        o => o.nombre.toLowerCase() === r.name.trim().toLowerCase()
      );
      return match ? { ...r, idRecurso: match.id_Recurso } : r;
    });

    const toCreate = preResolved.filter(r => r.idRecurso == null && r.name?.trim() && r.tipo?.trim());

    const createNew$ = toCreate.length > 0
      ? forkJoin(toCreate.map(r => this.planetService.crearRecurso({
          nombre:        r.name.trim(),
          tipo_Recurso:  r.tipo.trim(),
          rareza:        r.rareza?.trim() || undefined,
          unidad_Medida: r.unit?.trim()   || undefined,
          descripcion:   r.descripcion?.trim() || undefined,
        } as RecursoCreateDto)))
      : of([] as RecursoDto[]);

    createNew$.pipe(
      switchMap(created => {
        let newIdx = 0;
        const resolved = preResolved.map(r =>
          r.idRecurso == null && r.name?.trim() && r.tipo?.trim()
            ? { ...r, idRecurso: created[newIdx++]?.id_Recurso }
            : r
        );
        return this.planetService.create(dto).pipe(map(res => ({ res, resolved })));
      }),
      switchMap(({ res, resolved }) => {
        const idPlaneta: number = res?.data?.id_Planeta;
        if (!idPlaneta) return of([]);

        const asignaciones = resolved
          .filter(r => r.idRecurso != null && r.quantity != null)
          .map(r => this.planetService.asignarRecurso({
            id_Planeta:        idPlaneta,
            id_Recurso:        r.idRecurso,
            cantidad_Estimada: r.quantity,
          }));

        return asignaciones.length > 0 ? forkJoin(asignaciones) : of([]);
      })
    ).subscribe({
      next: () => {
        this.saving = false;
        this.saved  = true;
        setTimeout(() => { this.saved = false; }, 3000);
      },
      error: (err) => {
        this.saving   = false;
        this.errorMsg = err?.error?.message ?? 'Error al registrar el planeta. Intenta de nuevo.';
      },
    });
  }

  onCancel(): void {
    this.form.reset({
      primaryColor:   '#b073ff',
      secondaryColor: '#4b8cff',
      accentColor:    '#4be3d0',
    });
    this.resourcesArray.clear();
  }

  private collectInvalidControls(group: import('@angular/forms').AbstractControl, prefix = ''): string[] {
    const result: string[] = [];
    if ('controls' in group) {
      const controls = (group as any).controls;
      for (const key of Object.keys(controls)) {
        const ctrl = controls[key];
        const path = prefix ? `${prefix}.${key}` : key;
        if (ctrl.invalid) {
          result.push(`${path}: ${JSON.stringify(ctrl.errors)}`);
          result.push(...this.collectInvalidControls(ctrl, path));
        }
      }
    }
    return result;
  }
}

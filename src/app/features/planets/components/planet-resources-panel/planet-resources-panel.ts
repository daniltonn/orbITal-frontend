import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { TechLevel, LifeLevel, AtmosferaDto, RecursoDto } from '../../models/planet.dto';
import { PlanetService } from '../../services/planet.service';

@Component({
  selector:    'app-planet-resources-panel',
  standalone:  true,
  imports:     [CommonModule, ReactiveFormsModule],
  templateUrl: './planet-resources-panel.html',
  styleUrl:    './planet-resources-panel.scss',
})
export class PlanetResourcesPanel {

  @Input() form!: FormGroup;
  @Input() atmosferaOptions: AtmosferaDto[] = [];
  @Input() recursoOptions:   RecursoDto[]   = [];

  constructor(private fb: FormBuilder, private planetService: PlanetService) {}

  resourceModes:   ('select' | 'new')[] = [];
  savingResource:  boolean[] = [];
  resourceSaved:   boolean[] = [];
  resourceSaveErr: string[]  = [];

  get resourcesArray(): FormArray {
    return this.form.get('resources') as FormArray;
  }

  addResource(): void {
    this.resourceModes.push('select');
    this.savingResource.push(false);
    this.resourceSaved.push(false);
    this.resourceSaveErr.push('');
    this.resourcesArray.push(
      this.fb.group({
        idRecurso:   [null],
        name:        [''],
        tipo:        [''],
        rareza:      [''],
        descripcion: [''],
        unit:        [''],
        quantity:    [null, [Validators.required, Validators.min(0)]],
      })
    );
  }

  removeResource(i: number): void {
    this.resourcesArray.removeAt(i);
    this.resourceModes.splice(i, 1);
    this.savingResource.splice(i, 1);
    this.resourceSaved.splice(i, 1);
    this.resourceSaveErr.splice(i, 1);
  }

  setNewMode(i: number): void {
    this.resourceModes[i]   = 'new';
    this.resourceSaved[i]   = false;
    this.resourceSaveErr[i] = '';
    const group = this.resourcesArray.at(i) as FormGroup;
    group.patchValue({ idRecurso: null, name: '', tipo: '', rareza: '', descripcion: '', unit: '' });
  }

  setSelectMode(i: number): void {
    this.resourceModes[i]   = 'select';
    this.resourceSaved[i]   = false;
    this.resourceSaveErr[i] = '';
    const group = this.resourcesArray.at(i) as FormGroup;
    group.patchValue({ idRecurso: null, name: '', tipo: '', rareza: '', descripcion: '', unit: '' });
  }

  saveNewResource(i: number): void {
    const group  = this.resourcesArray.at(i) as FormGroup;
    const name     = (group.get('name')?.value     ?? '').trim() as string;
    const tipo     = (group.get('tipo')?.value     ?? '').trim() as string;
    const rareza   = (group.get('rareza')?.value   ?? '').trim() as string;
    const unit     = (group.get('unit')?.value     ?? '').trim() as string;
    const quantity = group.get('quantity')?.value;

    this.resourceSaveErr[i] = '';

    if (!name || !tipo || !rareza || !unit || quantity == null || quantity === '') {
      this.resourceSaveErr[i] = 'Todos los campos obligatorios deben completarse.';
      return;
    }

    // Si ya existe en el catálogo, reutilizar su ID
    const existing = this.recursoOptions.find(
      o => o.nombre.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      group.patchValue({ idRecurso: existing.id_Recurso });
      this.resourceSaved[i] = true;
      return;
    }

    this.savingResource[i] = true;
    this.planetService.crearRecurso({
      nombre:        name,
      tipo_Recurso:  tipo,
      rareza,
      unidad_Medida: (group.get('unit')?.value ?? '').trim() || undefined,
      descripcion:   (group.get('descripcion')?.value ?? '').trim() || undefined,
    }).subscribe({
      next: (created) => {
        this.savingResource[i] = false;
        this.resourceSaved[i]  = true;
        group.patchValue({ idRecurso: created.id_Recurso });
      },
      error: (err) => {
        this.savingResource[i]  = false;
        this.resourceSaveErr[i] = err?.error?.message ?? 'Error al guardar el recurso.';
      },
    });
  }

  atmAcronym(nombre: string): string {
    const words = nombre.trim().split(/\s+/);
    if (words.length === 1) return nombre.length <= 5 ? nombre : nombre.substring(0, 4);
    return words.map(w => w[0]).join('').toUpperCase();
  }

  getSelectedUnit(i: number): string {
    const id = this.resourcesArray.at(i).get('idRecurso')?.value;
    return this.recursoOptions.find(r => r.id_Recurso === id)?.unidad_Medida ?? '';
  }

  toggleAtmosphere(id: number): void {
    const current = this.form.get('atmosphere')?.value;
    this.form.get('atmosphere')?.setValue(current === id ? null : id);
  }

  selectTech(value: TechLevel): void {
    this.form.get('techLevel')?.setValue(value);
  }

  selectLifeLevel(value: LifeLevel): void {
    this.form.get('lifeLevel')?.setValue(value);
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { GalaxiaDto } from '../../models/planet.dto';

@Component({
  selector:    'app-planet-general-panel',
  standalone:  true,
  imports:     [CommonModule, ReactiveFormsModule],
  templateUrl: './planet-general-panel.html',
  styleUrl:    './planet-general-panel.scss',
})
export class PlanetGeneralPanel {

  @Input() form!: FormGroup;
  @Input() estadoOptions:  { id: number; label: string }[] = [];
  @Input() galaxiaOptions: GalaxiaDto[] = [];

  get coordsGroup(): FormGroup {
    return this.form.get('coordinates') as FormGroup;
  }

  get descriptionLength(): number {
    return this.form.get('description')?.value?.length ?? 0;
  }

  get hasCoords(): boolean {
    const c = this.coordsGroup;
    return c.get('x')?.value != null || c.get('y')?.value != null || c.get('z')?.value != null;
  }

  get planetGradient(): string {
    const p = this.form.get('primaryColor')?.value   ?? '#b073ff';
    const s = this.form.get('secondaryColor')?.value ?? '#3a0e8e';
    const a = this.form.get('accentColor')?.value    ?? '#7a2cff';
    return `radial-gradient(circle at 32% 30%, ${p} 0%, ${a} 35%, ${s} 70%, #14043f 100%)`;
  }

  onColorPick(field: string, value: string): void {
    this.form.get(field)?.setValue(value);
    this.form.get(field)?.markAsTouched();
  }

  normalizePlanetName(): void {
    const ctrl = this.form.get('name');
    const val: string = (ctrl?.value ?? '').trim();
    if (!val) return;
    const normalized = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    if (normalized !== ctrl?.value) {
      ctrl?.setValue(normalized, { emitEvent: true });
    }
  }

  hasError(path: string, err?: string): boolean {
    const c = this.form.get(path);
    if (!c || !c.touched) return false;
    return err ? c.hasError(err) : c.invalid;
  }

  coordError(axis: string): boolean {
    const c = this.coordsGroup.get(axis);
    return !!c && c.touched && c.invalid;
  }
}

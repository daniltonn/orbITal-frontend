import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.html',
  imports: [CommonModule],
  styleUrls: ['./card.scss']
})
export class CardComponent {

  @Input() nombre!: string;
  @Input() rol!: string;
  @Input() poder!: number;

  // 👇 NUEVO
  @Input() color!: string;
}
import { Component } from '@angular/core';
import { usuarios } from './usuarios';
import { CardComponent } from './card/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  templateUrl: './listar-usuarios.html',
  imports: [CardComponent, CommonModule],
  styleUrls: ['./listar-usuarios.scss']
})
export class ListarUsuariosComponent {

  usuarios = usuarios

}
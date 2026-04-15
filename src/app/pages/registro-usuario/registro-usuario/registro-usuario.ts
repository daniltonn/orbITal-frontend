import { Component } from '@angular/core';
import { PanelRegistroUsuario } from "../panel-registro-usuario/panel-registro-usuario";
import { PanelInfoRol } from "../panel-info-rol/panel-info-rol";
import { Background } from '../../../shared/backgrounds/login/login';
import { Sidebar } from '../../../shared/sidebar/sidebar';

@Component({
  selector: 'app-registro-usuario-registro-usuario',
  standalone: true,
  imports: [PanelRegistroUsuario, PanelInfoRol, Background, Sidebar],
  templateUrl: './registro-usuario.html',
  styleUrl: './registro-usuario.scss',

  
})
export class RegistroUsuario {
  rol: string = '';
}
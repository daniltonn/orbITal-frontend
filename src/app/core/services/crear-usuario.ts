import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioRequest {
  nombre: string;
  correo: string;
  password: string;
  id_Rol: number;
  id_Jerarquia: number;
}

@Injectable({
  providedIn: 'root'
})
export class CrearUsuarioService {

  private apiUrl = 'http://localhost:5186/api/Auth/register';

  constructor(private http: HttpClient) {}

  registrarUsuario(data: UsuarioRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
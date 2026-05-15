import { ApiService } from '../../core/services/ApiService';
import { Injectable } from '@angular/core';
import { Rol } from '../models/rol.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private api: ApiService) {}

  getRoles(): Observable<Rol[]> {
    return this.api.get('roles');
  }
}
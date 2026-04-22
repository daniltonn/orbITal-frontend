import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../core/services/ApiService';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(private api: ApiService) {}

    getUsers(): Observable<User[]> {
        return this.api.get('usuarios');
    }

    
}
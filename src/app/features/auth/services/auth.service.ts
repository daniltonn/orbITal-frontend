import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../core/services/ApiService';
import { LoginDto } from '../models/login.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: ApiService) {}

  login(data: LoginDto): Observable<string> {
    return this.api.post('auth/login', data).pipe(
      tap((res) => {
        localStorage.setItem('usuario', JSON.stringify(res));
      })
    );
  }
}
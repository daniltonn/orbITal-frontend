import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5186/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
  return this.http.post(`${this.apiUrl}/login`, {
    correo: email,
    password: password
  }, { responseType: 'text' }); // 👈 CLAVE
}
}
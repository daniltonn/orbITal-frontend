import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable( { providedIn: "root"})

export class ApiService {

    private baseUrl = 'http://localhost:5186/api';

    constructor(private http: HttpClient ){}

    get<T>(endpoint: string){
        return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
    }

    post(endpoint: string, body: any, options?: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${endpoint}`,
      body,
      {
        observe: 'body', // 👈 CLAVE
        ...options
      }
    );
  }

    put<T>(endpoint: string, body: any){
        return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body);
    }

    delete<T>(endpoint: string){
        return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
    }

}
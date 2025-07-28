import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
interface LoginResponse {
  token: string;
}

import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'jwt_token';
  private userRoleSubject = new BehaviorSubject<string | null>(
    this.getUserRole()
  );
  public userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>('http://localhost:8080/api/auth/login', {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.token);
          const decoded: any = jwtDecode(res.token);
          this.userRoleSubject.next(decoded.role); // Notify subscribers
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userRoleSubject.next(null);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  register(user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }) {
    return this.http.post('http://localhost:8080/api/auth/register', user);
  }
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded token:', decoded); 
      return decoded.id ?? null;
    } catch {
      return null;
    }
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject } from 'rxjs';
// import { tap } from 'rxjs/operators';

// // Response interface
// interface LoginResponse {
//   message: string;
//   token: string;
//   user: {
//     id: string;
//     email: string;
//   };
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:4000/api/auth';
//   private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
//   public token$ = this.tokenSubject.asObservable();

//   constructor(private http: HttpClient) {}

//   login(email: string, password: string): Observable<LoginResponse> {
//     return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
//       tap(response => {
//         if (response && response.token) {
//           localStorage.setItem('token', response.token);
//           localStorage.setItem('userEmail', response.user.email);
//           this.tokenSubject.next(response.token);
//         }
//       })
//     );
//   }

//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   isLoggedIn(): boolean {
//     return !!this.getToken();
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userEmail');
//     this.tokenSubject.next(null);
//   }

//   getUserEmail(): string | null {
//     return localStorage.getItem('userEmail');
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

// Response interfaces
interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
  };
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth';
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(email: string, password: string, confirmPassword: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      email,
      password,
      confirmPassword
    });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userEmail', response.user.email);
          this.tokenSubject.next(response.token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    this.tokenSubject.next(null);
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
}
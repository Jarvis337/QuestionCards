// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class QuestionService {
//   baseUri: string = 'http://localhost:4000/api/questions';

//   constructor(private http: HttpClient) { }

//   // Get all questions
//   getQuestions(): Observable<any> {
//     return this.http.get(`${this.baseUri}`);
//   }
// }


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class QuestionService {
//   private apiUrl = 'http://localhost:4000/api/questions';

//   constructor(private http: HttpClient) { }

//   // 💡 CHANGE 1: Accept the technology name as a parameter
//   getQuestionsByTechnology(technology: string): Observable<any[]> {
//     // 💡 CHANGE 2: Use the correct backend route structure
//     const url = `${this.apiUrl}/by-technology/${technology}`;
    
//     // The backend now returns an array of questions directly (e.g., the 'questions' array for Java)
//     return this.http.get<any[]>(url);
//   }

//   // You can remove or rename the old getQuestions() method if it's no longer used.
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:4000/api/questions';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all questions
  getAllQuestions(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrl, { headers });
  }

  // Get questions by technology
  getQuestionsByTechnology(technology: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/by-technology/${technology}`, { headers });
  }
}
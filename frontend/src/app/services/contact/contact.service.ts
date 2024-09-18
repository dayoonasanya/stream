import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private readonly API_URL = 'http://localhost:5000/api/contact';

  constructor(private http: HttpClient) {}

  /**
   * Submit the contact form
   * @param name 
   * @param email 
   * @param subject 
   * @param message 
   * @returns Observable<any>
   */
  submitContactForm(name: string, email: string, subject: string, message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = { name, email, subject, message };

    return this.http.post(`${this.API_URL}`, body, { headers });
  }

  /**
   * Subscribe to the newsletter
   * @param email 
   * @returns Observable<any>
   */
  subscribeToNewsletter(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = { email };

    return this.http.post(`${this.API_URL}/subscribe`, body, { headers });
  }
}

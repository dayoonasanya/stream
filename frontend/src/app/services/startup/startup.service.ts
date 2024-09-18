import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  private readonly API_URL = 'http://localhost:5000/api/startups';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Create startup profile (User)
   * @param startupData 
   */
  createStartupProfile(startupData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.API_URL}/create`, startupData, { headers });
  }

  /**
   * Update startup profile (User)
   * @param userId 
   * @param startupData 
   */
  updateStartupProfile(userId: string, startupData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.API_URL}/${userId}/update`, startupData, { headers });
  }

  /**
   * Get all startups (Admin)
   */
  getAllStartups(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}`, { headers });
  }

  /**
   * Get startup profile by ID (User or Admin)
   * @param userId 
   */
  getStartupById(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/${userId}`, { headers });
  }

  /**
   * Helper method to get authorization headers with the JWT token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
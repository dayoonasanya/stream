import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvestorService {

  private readonly API_URL = 'http://localhost:5000/api/investors';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Create an investor profile (User)
   * @param investorData 
   */
  createInvestorProfile(investorData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.API_URL}/create`, investorData, { headers });
  }

  /**
   * Update an investor profile (User)
   * @param investorData 
   */
  updateInvestorProfile(investorData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.API_URL}/update`, investorData, { headers });
  }

  /**
   * Get all investors (Admin only)
   */
  getAllInvestors(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/all`, { headers });
  }

  /**
   * Get investor profile by ID (User)
   */
  getInvestorProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/me`, { headers });
  }

  /**
   * Helper method to get authorization headers with the JWT token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
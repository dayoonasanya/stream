import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private readonly API_URL = 'http://localhost:5000/api/organizations';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Create an organization profile (User)
   * @param organizationData 
   */
  createOrganizationProfile(organizationData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.API_URL}/create`, organizationData, { headers });
  }

  /**
   * Update an organization profile (User)
   * @param organizationData 
   */
  updateOrganizationProfile(organizationData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.API_URL}/update`, organizationData, { headers });
  }

  /**
   * Set organization verification status (Admin)
   * @param organizationId 
   * @param isVerified 
   */
  setOrganizationVerification(organizationId: string, isVerified: boolean): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.API_URL}/${organizationId}/verify`, { isVerified }, { headers });
  }

  /**
   * Get all organizations (Public)
   */
  getAllOrganizations(): Observable<any> {
    return this.http.get(`${this.API_URL}/all`);
  }

  /**
   * Delete an organization (Admin or User)
   * @param organizationId 
   */
  deleteOrganization(organizationId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.API_URL}/${organizationId}`, { headers });
  }

  /**
   * Get the organization profile of the authenticated user (User)
   */
  getOrganizationProfileByUserId(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/profile`, { headers });
  }

  /**
   * Get an organization profile by organization ID (Public/Admin)
   * @param organizationId 
   */
  getOrganizationProfileById(organizationId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${organizationId}`);
  }

  /**
   * Helper method to get authorization headers with the JWT token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly API_URL = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Get all users (Admin)
   */
  getAllUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/users`, { headers });
  }

  /**
   * Get user by ID (Admin)
   * @param userId 
   */
  getUserById(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/users/${userId}`, { headers });
  }

  /**
   * Get users by role (Admin)
   * @param role 
   */
  getUsersByRole(role: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/users/role/${role}`, { headers });
  }

  /**
   * Update user account status (Admin)
   * @param userId 
   * @param isActive 
   */
  setUserAccountStatus(userId: string, isActive: boolean): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.API_URL}/users/${userId}/status`, { isActivated: isActive }, { headers });
  }

  /**
   * Delete a user (Admin)
   * @param userId 
   */
  deleteUser(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.API_URL}/users/${userId}`, { headers });
  }

  /**
   * Get all organizations (Admin)
   */
  getAllOrganizations(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/organizations`, { headers });
  }

  /**
   * Verify an organization (Admin)
   * @param organizationId 
   * @param isVerified 
   */
  verifyOrganization(organizationId: string, isVerified: boolean): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.API_URL}/organizations/${organizationId}/verify`, { isVerified }, { headers });
  }

  /**
   * Delete an organization (Admin)
   * @param organizationId 
   */
  deleteOrganization(organizationId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.API_URL}/organizations/${organizationId}`, { headers });
  }

  /**
   * Get projects by type (Admin)
   * @param type 
   */
  getProjectsByType(type: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/projects/type/${type}`, { headers });
  }

  /**
   * Set project visibility (Admin)
   * @param projectId 
   * @param isPublic 
   */
  setProjectVisibility(projectId: string, isPublic: boolean): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.API_URL}/projects/${projectId}/visibility`, { isPublic }, { headers });
  }

  /**
   * Delete a project (Admin)
   * @param projectId 
   */
  deleteProject(projectId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.API_URL}/projects/${projectId}`, { headers });
  }

  /**
   * Categorize a project (Admin)
   * @param projectId 
   * @param category 
   */
  categorizeProject(projectId: string, category: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.API_URL}/projects/${projectId}/category`, { category }, { headers });
  }

  /**
   * Get all transactions for a project (Admin)
   * @param projectId 
   */
  getTransactionsByProject(projectId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/transactions/project/${projectId}`, { headers });
  }

  /**
   * Get transaction by ID (Admin)
   * @param transactionId 
   */
  getTransactionById(transactionId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/transactions/${transactionId}`, { headers });
  }

  /**
   * Register a new admin (Admin)
   * @param email 
   * @param password 
   */
  registerAdmin(email: string, password: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = { email, password };
    return this.http.post(`${this.API_URL}/admins`, body, { headers });
  }

  /**
   * Helper method to get authorization headers with the JWT token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
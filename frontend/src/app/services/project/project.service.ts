import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly API_URL = 'http://localhost:5000/api/projects';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Create a new project (Organization or Startup users)
   * @param projectData 
   */
  createProject(projectData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.API_URL}/create`, projectData, { headers });
  }

  /**
   * Update an existing project (Organization or Startup users)
   * @param projectId 
   * @param updatedData 
   */
  updateProject(projectId: string, updatedData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.API_URL}/${projectId}/update`, updatedData, { headers });
  }

  /**
   * Delete a project (Organization or Startup users)
   * @param projectId 
   */
  deleteProject(projectId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.API_URL}/${projectId}`, { headers });
  }

  /**
   * Get projects by type (Public)
   * @param type 
   */
  getProjectsByType(type: string): Observable<any> {
    return this.http.get(`${this.API_URL}/type/${type}`);
  }

  /**
   * Set project visibility (Organization or Startup users)
   * @param projectId 
   * @param isPublic 
   */
  setProjectVisibility(projectId: string, isPublic: boolean): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.API_URL}/${projectId}/visibility`, { isPublic }, { headers });
  }

  /**
   * Categorize a project (Organization or Startup users)
   * @param projectId 
   * @param category 
   */
  categorizeProject(projectId: string, category: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.API_URL}/${projectId}/category`, { category }, { headers });
  }

  /**
   * Adjust project target amount based on investments/donations
   * @param projectId 
   * @param newAmount 
   */
  adjustTargetAmount(projectId: string, newAmount: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.API_URL}/${projectId}/adjust-amount`, { newAmount }, { headers });
  }

  /**
   * Get all projects (Public)
   */
  getAllProjects(): Observable<any> {
    // Public method, no auth headers required
    return this.http.get(`${this.API_URL}`);
  }

  /**
   * Get a single project by ID (Public)
   * @param projectId 
   */
  getProjectById(projectId: string): Observable<any> {
    // Public method, no auth headers required
    return this.http.get(`${this.API_URL}/${projectId}`);
  }

  /**
   * Helper method to get authorization headers with the JWT token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}

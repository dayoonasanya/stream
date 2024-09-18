import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Get all users (Admin only)
   */
  getAllUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    // Fetch users where `isDeleted` is false
    return this.http.get(`${this.API_URL}/all?isDeleted=false`, { headers });
  }

  /**
   * Get user by ID (Admin or User)
   * @param userId 
   */
  getUserById(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/${userId}`, { headers });
  }

  /**
   * Get users by role (Admin only)
   * @param role 
   */
  getUsersByRole(role: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/role/${role}`, { headers });
  }

  /**
   * Update user profile
   * @param profileData 
   */
  updateProfile(profileData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.API_URL}/profile`, profileData, { headers });
  }

  /**
   * Activate or deactivate a user (Admin or User)
   * @param userId 
   * @param isActivated 
   */
  setAccountStatus(userId: string, isActivated: boolean): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.API_URL}/account/${userId}/status`, { isActivated }, { headers });
  }

  /**
   * Delete user (Admin or User)
   * @param userId 
   */
  deleteUser(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.API_URL}/${userId}`, { headers });
  }

  /**
   * Change user password
   * @param currentPassword 
   * @param newPassword 
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.API_URL}/password/change`, { currentPassword, newPassword }, { headers });
  }

  /**
   * Forgot password (Send reset link via email)
   * @param email 
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/password/forgot`, { email });
  }

  /**
   * Reset password (User submits new password)
   * @param token 
   * @param newPassword 
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/password/reset`, { token, newPassword });
  }

  /**
   * Helper method to get authorization headers with the token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
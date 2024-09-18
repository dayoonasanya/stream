import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:5000/api/auth';
  private tokenKey = 'auth-token';
  private roleKey = 'user-role';
  private loggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Login the user
   * @param email 
   * @param password 
   * @returns Observable
   */
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.API_URL}/login`, loginData).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.roleKey, response.user.role);
        this.loggedIn = true;
      })
    );
  }

  /**
   * Register a new user
   * @param email 
   * @param password 
   * @param role 
   * @returns
   */
  register(email: string, password: string, role: string): Observable<any> {
    const registerData = { email, password, role };
    return this.http.post<any>(`${this.API_URL}/register`, registerData);
  }

  /**
   * Check if user is authenticated (has a valid token)
   * @returns boolean
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    this.loggedIn = !!token;
    return this.loggedIn;
  }

  /**
   * Check if user has the required role to access a route
   * @param requiredRole 
   * @returns boolean
   */
  hasRole(requiredRole: string): boolean {
    const userRole = localStorage.getItem(this.roleKey);
    return userRole === requiredRole;
  }

  /**
   * Get the current user's role from localStorage
   * @returns string
   */
  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  /**
   * Logout the
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }

  /**
   * Get the JWT token from localStorage
   * @returns string | null
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  decodeToken(token: string): any {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken?.userId || null;
    }
    return null;
  }
}
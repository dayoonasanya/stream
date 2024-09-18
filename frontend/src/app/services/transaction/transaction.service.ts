import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly API_URL = 'http://localhost:5000/api/transactions';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Process a transaction (Donation or Investment)
   * @param transactionData 
   */
  processTransaction(transactionData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.API_URL}/process`, transactionData, { headers });
  }

  /**
   * Update transaction status (Webhook)
   * @param transactionData 
   */
  updateTransactionStatus(transactionData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/update-status`, transactionData);
  }

  /**
   * Get transaction by ID
   * @param transactionId 
   */
  getTransactionById(transactionId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/${transactionId}`, { headers });
  }

  /**
   * Get all transactions for a specific project
   * @param projectId 
   */
  getTransactionsByProject(projectId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/project/${projectId}`, { headers });
  }

  /**
   * Calculate investor share percentage
   * @param shareData 
   */
  calculateInvestorShare(shareData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.API_URL}/calculate-share`, shareData, { headers });
  }

  /**
   * Helper method to get authorization headers with the JWT token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  /**
 * Get all transactions (Admin)
 */
  getAllTransactions(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.API_URL}/all`, { headers });
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuOpen = false;
  isAuthenticated: boolean = false;
  userRole: string | null = null;
  profileImageUrl: string = 'assets/profile.jpg'; // Default
  profileCardVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userRole = this.authService.getUserRole();
    this.setProfileImage();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleProfileCard() {
    this.profileCardVisible = !this.profileCardVisible;
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  isOrganizationOrStartup(): boolean {
    return this.userRole === 'ORGANIZATION' || this.userRole === 'STARTUP';
  }

  isInvestor(): boolean {
    return this.userRole === 'INVESTOR';
  }

  setProfileImage() {
    // Set different default images based on role
    if (this.isInvestor()) {
      this.profileImageUrl = 'assets/profile.jpg';
    } else if (this.isOrganizationOrStartup()) {
      this.profileImageUrl = 'assets/logo.svg';
    } else {
      this.profileImageUrl = 'assets/profile.jpg';
    }
  }
}
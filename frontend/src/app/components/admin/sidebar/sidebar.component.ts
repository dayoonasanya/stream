import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userName: string = 'John Doe';
  avatarUrl: string = 'assets/profile.jpg';
  searchTerm: string = '';
  sidebarLinks: any[] = [];
  filteredLinks: any[] = [];

  constructor(
    private authService: AuthService, 
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadSidebarLinks();
  }

  loadUserProfile(): void {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token || '');
    const userId = decodedToken?.userId;

    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (user) => {
          this.userName = `${user.profile?.firstName || 'John'} ${user.profile?.lastName || 'Doe'}`;
          this.avatarUrl = user.profile?.avatar || 'assets/profile.jpg';
        },
        (error) => {
          console.error('Failed to load user profile', error);
        }
      );
    }
  }

  loadSidebarLinks(): void {
    this.sidebarLinks = [
      { label: 'Dashboard', icon: 'pi pi-objects-column', route: '/admin/dashboard' },
      { label: 'Users', icon: 'pi pi-user', route: '/admin/users' },
      { label: 'Investors', icon: 'pi pi-users', route: '/admin/investors' },
      { label: 'Organizations', icon: 'pi pi-stop', route: '/admin/organizations' },
      { label: 'Startups', icon: 'pi pi-clone', route: '/admin/startups' },
      { label: 'Projects', icon: 'pi pi-tags', route: '/admin/projects' },
      { label: 'Settings', icon: 'pi pi-spin pi-cog', route: '/admin/profile' },
    ];
    this.filteredLinks = [...this.sidebarLinks];
  }

  onLogout(): void {
    this.authService.logout();
  }

  onSearchChange(searchTerm: string): void {
    this.filteredLinks = this.sidebarLinks.filter(link =>
      link.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

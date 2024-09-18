import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent {
  isSidebarOpen = false;
  currentSidebarTab: string | null = null;

  toggleSidebar(tab: string) {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.currentSidebarTab = this.isSidebarOpen ? tab : null;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  watchScreen() {
    if (window.innerWidth <= 1024) {
      this.isSidebarOpen = false;
    }
  }
}

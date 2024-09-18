import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project/project.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.css']
})
export class UserProjectsComponent implements OnInit {
  projects: any[] = [];
  loading: boolean = true;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    // Fetch all projects when component initializes
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;  // Store fetched projects
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
        this.loading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project/project.service';
import { Project } from '../../../interfaces/project';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  displayProjectModal: boolean = false;
  
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  showNotification: boolean = false;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    forkJoin({
      organizationProjects: this.projectService.getProjectsByType('ORGANIZATION_PROJECT'),
      startupProjects: this.projectService.getProjectsByType('STARTUP_PROJECT')
    }).subscribe(
      ({ organizationProjects, startupProjects }) => {
        this.projects = [...organizationProjects, ...startupProjects];
      },
      (error) => {
        this.showError('Failed to load projects');
      }
    );
  }

  viewProject(project: Project): void {
    this.selectedProject = project;
    this.displayProjectModal = true;
  }

  closeModal(): void {
    this.displayProjectModal = false;
  }

  deleteProject(projectId: string): void {
    this.projectService.deleteProject(projectId).subscribe(
      () => {
        this.projects = this.projects.filter(project => project.id !== projectId);
        this.showSuccess('Project deleted successfully');
      },
      (error) => {
        this.showError('Failed to delete project');
      }
    );
  }

  showSuccess(message: string): void {
    this.notificationMessage = message;
    this.notificationType = 'success';
    this.showNotification = true;
  }

  showError(message: string): void {
    this.notificationMessage = message;
    this.notificationType = 'error';
    this.showNotification = true;
  }

  closeNotification(): void {
    this.showNotification = false;
  }
}
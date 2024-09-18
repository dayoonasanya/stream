import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin/admin.service';
import { TransactionService } from '../../../services/transaction/transaction.service';
import Chart from 'chart.js/auto';
import { StartupService } from '../../../services/startup/startup.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalUsers: number = 0;
  totalOrganizations: number = 0;
  totalStartups: number = 0;
  totalProjects: number = 0;
  totalTransactions: number = 0;

  constructor(
    private adminService: AdminService, 
    private startupService: StartupService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.initializeCharts();
  }

  loadDashboardData(): void {
    this.adminService.getAllUsers().subscribe(users => {
      const filteredUsers = users.filter((user: any) => user.role !== 'ADMIN' && !user.isDeleted);
      this.totalUsers = filteredUsers.length;
      this.animateCount('totalUsers', this.totalUsers);
    });

    this.adminService.getAllOrganizations().subscribe(orgs => {
      this.totalOrganizations = orgs.length;
      this.animateCount('totalOrganizations', this.totalOrganizations);
    });

    this.startupService.getAllStartups().subscribe(startups => {
      this.totalStartups = startups.length;
      this.animateCount('totalStartups', this.totalStartups);
    });

    this.adminService.getProjectsByType('ORGANIZATION_PROJECT').subscribe(projects => {
      this.totalProjects = projects.length;
      this.animateCount('totalProjects', this.totalProjects);
    });

    this.transactionService.getAllTransactions().subscribe(transactions => {
      this.totalTransactions = transactions.length;
    });
  }

  initializeCharts(): void {
    const bubbleChartCtx = document.getElementById('hs-bubble-chart') as HTMLCanvasElement;
    if (bubbleChartCtx) {
      new Chart(bubbleChartCtx, {
        type: 'bubble',
        data: {
          datasets: [
            {
              label: 'Income',
              data: [{ x: 10, y: 20, r: 15 }, { x: 15, y: 10, r: 10 }],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: 'Outcome',
              data: [{ x: 20, y: 30, r: 12 }, { x: 25, y: 20, r: 8 }],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
          ]
        },
        options: {
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            }
          }
        }
      });
    }

    const areaChartCtx = document.getElementById('hs-curved-area-charts') as HTMLCanvasElement;
    if (areaChartCtx) {
      new Chart(areaChartCtx, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April'],
          datasets: [
            {
              label: 'Income',
              data: [100, 200, 300, 400],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              fill: true,
            },
            {
              label: 'Outcome',
              data: [150, 250, 350, 450],
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              fill: true,
            }
          ]
        },
        options: {
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            }
          }
        }
      });
    }
  }

  animateCount(elementId: string, endValue: number): void {
    const element = document.getElementById(elementId);
    let startValue = 0;
    const duration = 1000;
    const increment = Math.ceil(endValue / (duration / 16.66));
    
    const counter = setInterval(() => {
      startValue += increment;
      if (startValue >= endValue) {
        startValue = endValue;
        clearInterval(counter);
      }
      if (element) {
        element.textContent = startValue.toString();
      }
    }, 16.66);
  }
}

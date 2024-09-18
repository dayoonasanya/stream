import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-core',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, RouterModule],
  templateUrl: './core.component.html',
  styleUrl: './core.component.css'
})
export class CoreComponent {

}

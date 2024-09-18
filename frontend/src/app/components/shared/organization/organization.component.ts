import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../footer/footer.component';
import { NavbarComponent } from '../../navbar/navbar.component';


@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [ CommonModule, FooterComponent, NavbarComponent ],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.css'
})
export class OrganizationComponent {

}

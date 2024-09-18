import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FooterComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  loading: boolean = true;
  visibleCards: number[] = [0, 1, 2];
  currentCardIndex: number = 2;

  cards = [
    { title: 'Funding Opportunities', description: 'We connect businesses with investors looking to support innovative solutions. Find the perfect funding match for your project.', icon: 'assets/about/money.svg' },
    { title: 'Mentorship', description: 'Our team of experienced mentors will guide you through the growth process, offering advice on product development, strategy, and scaling.', icon: 'assets/about/opportunities.svg' },
    { title: 'Partnerships', description: 'We help you build strong, strategic partnerships that will accelerate your business’s growth and ensure long-term success.', icon: 'assets/about/partner.svg' },
    { title: 'Innovative Tools', description: 'Access cutting-edge tools and technologies to streamline your business processes and stay ahead of the competition.', icon: 'assets/about/innovative.svg' }
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 100);

    
    setInterval(() => {
      this.rotateCards();
    }, 3000);
  }

  rotateCards(): void {
    this.visibleCards = this.visibleCards.map(i => (i + 1) % this.cards.length);
  }
}

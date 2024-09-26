import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { BlogDetailComponent } from '../blog-detail/blog-detail.component';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, BlogDetailComponent],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {
  blogs = [
    {
      title: 'How Stream Connects Investors with High-Impact Projects',
      date: '5 September 2024',
      image: 'https://i.ibb.co/DYxtCJq/img-1.png',
      description: 'Stream is revolutionizing the investment landscape by providing a seamless platform where investors can discover and fund high-potential projects. Learn how Stream ensures transparency and success for both investors and startups.'
    },
    {
      title: 'Top 5 Reasons Why Startups Should Choose Stream for Funding',
      date: '8 September 2024',
      image: 'https://i.ibb.co/3C5HvxC/img-2.png',
      description: 'Looking for funding? Discover the top reasons why startups are choosing Stream to connect with investors. From streamlined processes to a supportive community, see how Stream can elevate your project to new heights.'
    },
    {
      title: 'Investing in the Future: How Stream Empowers Investors',
      date: '10 September 2024',
      image: 'https://i.ibb.co/Ms4qyXp/img-3.png',
      description: 'Stream empowers investors by offering a curated list of projects with detailed insights and transparent data. Learn how you can make informed investment decisions and contribute to the growth of innovative startups.'
    },
    {
      title: 'Success Stories: Startups That Achieved Their Goals Through Stream',
      date: '12 September 2024',
      image: 'https://i.ibb.co/6Wfjf2w/img-4.png',
      description: 'Read about startups that have successfully secured funding and achieved their milestones with the help of Stream. These stories highlight the potential of the platform to connect innovative ideas with the right investors.'
    },
    {
      title: 'The Role of Direct Investments in Startup Growth',
      date: '15 September 2024',
      image: 'https://i.ibb.co/3yvZBpm/img-5.png',
      description: 'Direct investments can be a game-changer for startups. Learn how Stream facilitates direct investments and how it benefits both parties in the investment process.'
    },
    {
      title: 'Building a Stronger Startup Community with Stream',
      date: '18 September 2024',
      image: 'https://i.ibb.co/gDdnJb5/img-6.png',
      description: 'Stream is more than just a funding platform. It’s a community where startups and investors collaborate, share insights, and grow together. Discover how we’re building a thriving ecosystem for innovation and success.'
    }
  ];
  
  selectedBlog: any = null;

  selectBlog(blog: any) {
    this.selectedBlog = blog;
  }

  closeBlogDetail() {
    this.selectedBlog = null;
  }
}

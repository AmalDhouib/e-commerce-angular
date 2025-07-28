import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AboutComponent } from '../about/about.component';
import { ProductListComponent } from '../features/products/list/product-list.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, AboutComponent, ProductListComponent,RouterLink],
})
export class HomeComponent implements OnInit {
  doorOpened = false;

  constructor(private router: Router) {}

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
  openDoor() {
    this.doorOpened = true;
    setTimeout(() => {
      this.router.navigate(['/products']);
    }, 1200); }
  slides = [
    {
      image: 'assets/img/bg1.jpg',
      title: 'Get started with your favorite shopping',
      subtitle: 'Discover unique handmade items today',
    },
    {
      image: 'assets/img/bg2.jpg',
      title: 'Crafted with love',
      subtitle: 'Support local artisans and small businesses',
    },
    {
      image: 'assets/img/bg3.jpg',
      title: 'Your style, your story',
      subtitle: 'Buy personalized and meaningful products',
    },
  ];

  currentSlide = 0;

  ngOnInit(): void {}

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  startShopping(): void {
    console.log('Start shopping!');
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports:[RouterLink,CommonModule],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userRole: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getUserRole();

    this.authService.userRole$.subscribe((role) => {
      this.isLoggedIn = !!role;
      this.userRole = role;
    });
  }

  logout() {
    this.authService.logout();
    window.location.href = '/'; // optional: reload or navigate
  }
}

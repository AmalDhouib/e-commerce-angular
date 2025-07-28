import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  error = '';
  role = 'USER';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      role: this.role,
    })
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const errorMessage =
            typeof err.error === 'string'
              ? err.error
              : err.error?.message || 'Unknown error';

          import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
              icon: 'error',
              title: 'Registration failed',
              text: errorMessage,
            });
          });
        },
      });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: User = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.register(this.user).subscribe({
      next: (user) => {
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }
}

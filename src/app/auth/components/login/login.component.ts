import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import Encryption from '../../../shared/security/Encryption';
import { Token } from '../../interfaces/token.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  //injections
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  public loginForm = this._fb.group({
    username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{2,20}$')]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[-_*?!@/().#])[A-Za-z\\d-_.*?!@/().#]{10,20}$')]],
  });

  public validateForm(): void {
    if (this.loginForm.invalid) {
      return this.loginForm.markAllAsTouched();
    }
    const username = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;
    const encryptedPassword = Encryption.encryptPassword(password!);
    this._authService.getLogin(username!, encryptedPassword).subscribe({
      next: (res:Token) => {
        localStorage.setItem('session_token', res.access_token);
        this._router.navigate(['/home']);
      },
      error: (error:HttpErrorResponse) => {
        console.error('Error during login:', error);
      }
    });
  }

  public togglePassword(id: string): void {
    const passwordField = document.getElementById(id) as HTMLInputElement;
    passwordField.type = passwordField.type === 'text' ? 'password' : 'text';
  }

}

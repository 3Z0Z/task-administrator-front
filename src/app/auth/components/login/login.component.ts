import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth-service.service';

import Encryption from '../../../shared/security/Encryption';
import { Token } from '../../../shared/interfaces/token.interface';
import { SwalService } from '../../../shared/services/swal.service';
import { SessionVariables } from '../../../helpers/session-variables';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html'
})
export default class LoginComponent {

  //injections
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _swalService = inject(SwalService);

  public loginForm = this._fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
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
        sessionStorage.setItem(SessionVariables.session_token, res.access_token);
        sessionStorage.setItem(SessionVariables.session_expiration, (new Date().getTime() + 15 * 60 * 1000).toString());
        this._router.navigate(['/home']);
        this._swalService.showSuccessToast('Inicio de sesión exitoso');
      },
      error: () => {
        this._swalService.showErrorToast('Credenciales incorrectas, por favor, intenta nuevamente.');
      }
    });
  }

  public togglePassword(id: string): void {
    const passwordField = document.getElementById(id) as HTMLInputElement;
    passwordField.type = passwordField.type === 'text' ? 'password' : 'text';
  }

}

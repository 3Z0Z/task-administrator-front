import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth-service.service';
import { RegisterAccount } from '../../interfaces/register.interface';
import { SwalService } from '../../../shared/services/swal.service';

import Encryption from '../../../shared/security/Encryption';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html'
})
export default class RegisterComponent {

  //injections
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _swalService = inject(SwalService);

  public registerForm = this._fb.group({
    username: ['', [Validators.required, Validators.pattern('^[a-zA-Z*\\d]{2,20}$')]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[-_*?!@/().#=])[A-Za-z\\d-_*?!@/().#=]{10,20}$')]],
    email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$')]]
  });

  public validateForm(): void {
    if (this.registerForm.invalid) {
      return this.registerForm.markAllAsTouched();
    }
    const request: RegisterAccount = {
      username: this.registerForm.controls.username.value!,
      password: Encryption.encryptPassword(this.registerForm.controls.password.value!),
      email: this.registerForm.controls.email.value!
    }
    this._authService.registerUser(request).subscribe({
      next: () => {
        this._router.navigate(['/auth/login']);
        this._swalService.showSuccessPopup('Registro exitoso', 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.');
      },
      error: (error: HttpErrorResponse) => {
        this._swalService.showErrorPopup(error.error?.message);
      }
    });
  }

  public togglePassword(id: string): void {
    const passwordField = document.getElementById(id) as HTMLInputElement;
    passwordField.type = passwordField.type === 'text' ? 'password' : 'text';
  }

}

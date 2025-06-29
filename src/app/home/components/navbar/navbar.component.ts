import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { SessionVariables } from '../../../helpers/session-variables';

import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/auth.service';
import { SwalService } from '../../../shared/services/swal.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './navbar.component.html'
})
export default class NavbarComponent implements OnInit {

  private readonly sessionServise = inject(AuthService);
  private readonly swalService = inject(SwalService);

  public username: string = '';

  ngOnInit(): void {
    const token = sessionStorage.getItem(SessionVariables.session_token)!;
    const decoded : { username: string; } = jwtDecode(token);
    this.username = decoded.username;
  }

  public logout(): void {
    this.sessionServise.logout().subscribe({
      next: () => {
        sessionStorage.clear();
        window.location.reload();
        this.swalService.showSuccessToast('Sesión cerrada correctamente.');
      },
      error: () => {
        this.swalService.showErrorToast('Ocurrió un error al cerrar sesión, por favor intente nuevamente.');
      }
    })
  }

}

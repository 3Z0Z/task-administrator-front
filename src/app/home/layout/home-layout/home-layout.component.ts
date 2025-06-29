import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import NavbarComponent from "../../components/navbar/navbar.component";
import FooterComponent from "../../components/footer/footer.component";

import { AuthService } from '../../services/auth.service';
import { SessionVariables } from '../../../helpers/session-variables';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet,
    FooterComponent
  ],
  templateUrl: './home-layout.component.html'
})
export default class HomeLayoutComponent implements OnInit, OnDestroy {

  private readonly _sessionService = inject(AuthService);
  private readonly _router = inject(Router);

  private _refreshTokenSubscription!: ReturnType<typeof setTimeout> | undefined;

  public ngOnInit(): void {
    this.scheduleRefreshToken();
  }

  public ngOnDestroy(): void {
    if (this._refreshTokenSubscription) {
      clearTimeout(this._refreshTokenSubscription);
    }
  }

  private scheduleRefreshToken(): void {
    const expiration = +sessionStorage.getItem(SessionVariables.session_expiration)!;
    const now = Date.now();
    const msUntilExpiration = expiration - now;
    const msUntilRefresh = msUntilExpiration - (1 * 60 * 1000);
    const delay = Math.max(msUntilRefresh, 0);
    this._refreshTokenSubscription = setTimeout(() => {
      this._sessionService.refreshToken().subscribe({
        next: () => {
          this.scheduleRefreshToken();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            sessionStorage.clear();
            this._router.navigate(['/auth']);
          }
        }
      })
    }, delay);
  }

}

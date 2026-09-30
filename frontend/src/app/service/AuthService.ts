import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  of,
  catchError,
  tap
} from 'rxjs';

import { AuthPayload } from '../models/auth-payload';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  private readonly authState$ =
    new BehaviorSubject<boolean>(false);

  private readonly user$ =
    new BehaviorSubject<User | null>(null);

  readonly isAuthenticated$ =
    this.authState$.asObservable();

  readonly currentUser =
    this.user$.asObservable();

  // Usado pelo authGuard
  isAuthenticated(): boolean {
    return this.authState$.value;
  }

  login(payload: AuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login_check`,
      payload
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.authState$.next(true);
      })
    );
  }

  loadCurrentUser(): Observable<User | null> {
    return this.http.get<User>(
      `${this.apiUrl}/me`
    ).pipe(
      tap(user => {
        console.log('User from backend:', user);

        this.user$.next(user);
        this.authState$.next(true);
      }),
      catchError(() => {
        localStorage.removeItem('token');

        this.user$.next(null);
        this.authState$.next(false);

        return of(null);
      })
    );
  }

  logout(): Observable<void> {
    localStorage.removeItem('token');
    this.user$.next(null);
    this.authState$.next(false);

    return of(void 0);
  }
}

import { computed, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { User } from "../models/user";
import { AuthPayload } from "../models/auth-payload";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  private readonly userSignal = signal<User | null>(null);
  readonly currentUser = this.userSignal.asReadonly();

  readonly isAuthenticated = computed(
    () => this.userSignal() !== null
  );

  login(payload: AuthPayload): Observable<User | null> {
    return this.http.post<any>(
      `${this.apiUrl}/login_check`,
      payload
    );
  }

  loadCurrentUser(): Observable<User | null> {
    return this.http.get<User>(
      `${this.apiUrl}/me`
    );

  }

  logout(): Observable<void> {
    this.userSignal.set(null);
    return new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@authinterfaces/user.interfaces';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    stream: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);
  isAdmin = computed( () => (this._user()?.roles?.includes('admin') || this._user()?.roles?.includes('super')) ?? false);

  register( name: string, email: string, password: string ): Observable<boolean>{
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`,{
      fullName: name,
      email: email,
      password: password
    }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      tap((resp) => console.log(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }
  
  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .get<AuthResponse>(`${baseUrl}/auth/check-status`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ token, user }: AuthResponse) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('token', token);

    return true;
  }

  /*Por que el handleAuthSuccess devuelve un true(sin of)?
    porque el map lo que devuelve es el nuevo valor del observable, en cambio en el catchError,
    puede que no devuelva ningun error o que devuelva una excpecion..entonces 
    siempre devolvemos un observable.
    Tenen en cuenta que uno se llama en el catchError y el otro en el map, cada uno espera una cosa.
   */
  
  private handleAuthError(error: any) {
    this.logout();
    /* Hacemos un return of(false) porque en los catchError donde
      llamamos el metodo espera un observable de tipo booleano */
    return of(false);
  }
}
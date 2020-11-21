import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private _http: HttpClient, private router: Router) {}

  public doLogin(email: string, password: string): Observable<{ success: Boolean, message: string }> {
    return new Observable((obs) => {
      this._http.post<any>(environment.baseUrl + '/auth/login/', { username: email, password }, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.setAuthInfo(response);
            obs.next({ success: true, message: 'Logado com sucesso!' });
          },
          error: () => {
            obs.error({ success: false, message: 'Erro ao fazer login!' });
          },
          complete: () => {
            obs.complete();
          }
        });
    });
  }

  public doRegister(name: string, email: string, password: string, password2: string): Observable<{ success: Boolean, message: string }> {
    return new Observable((obs) => {
      this._http.post<any>(environment.baseUrl + '/auth/register/', { name, email, password, password2 }, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })
        .pipe(take(1))
        .subscribe({
          next: () => {
            obs.next({ success: true, message: 'Registrado com sucesso!' });
          },
          error: (response) => {
            if(response.error && response.error.email) {
              return obs.error({ success: false, message: response.error.email[0] });
            }

            obs.error({ success: false, message: 'Erro ao fazer registro!' });
          },
          complete: () => {
            obs.complete();
          }
        });
    });
  }

  private setAuthInfo(loginResult: any) {
    localStorage.setItem('@Medicar-Token', loginResult.token);
    localStorage.setItem('@Medicar-User', JSON.stringify({
      name: loginResult['name'],
      email: loginResult['email']
    }));
  }

  public getToken(): string {
    return localStorage.getItem('@Medicar-Token');
  }

  public getUserInfo(): any {
    return JSON.parse(localStorage.getItem('@Medicar-User'));
  }

  public doLogout() {
    localStorage.removeItem('@Medicar-Token');
    localStorage.removeItem('@Medicar-User');
    this.router.navigate(['login']);
  }

  public isLogged(): Boolean {
    return localStorage.getItem('@Medicar-Token') !== null;
  }
}

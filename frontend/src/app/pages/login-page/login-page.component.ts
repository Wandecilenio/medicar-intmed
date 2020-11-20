import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'medicar-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  public email: string = "";
  public password: string = "";
  public remember: Boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  handleLogin(): void {
    this.authService.doLogin(this.email, this.password)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if(response.success === true) {
            this.toastrService.success('Autenticação', 'Logado com sucesso!');
            this.router.navigate(['app']);
          } else {
            this.toastrService.error('Autenticação', response.message);
          }
        },
        error: (err) => {
          this.toastrService.error('Autenticação', err.message);
        }
      });
  }

  redirectSignup(): void {
    this.router.navigate(['register']);
  }
}

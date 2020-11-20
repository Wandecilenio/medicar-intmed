import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'medicar-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  public name: string = "";
  public email: string = "";
  public password: string = "";
  public password2: string = "";

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  handleRegister(): void {
    this.authService.doRegister(this.name, this.email, this.password, this.password2)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if(response.success === true) {
            this.toastrService.success('Autenticação', response.message);

            // Make Login
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

          } else {
            this.toastrService.error('Autenticação', response.message);
          }
        },
        error: (err) => {
          this.toastrService.error('Autenticação', err.message);
        }
      });
  }

  redirectLogin(): void {
    this.router.navigate(['login']);
  }
}

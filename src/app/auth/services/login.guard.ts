import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take, map } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router){}



  canActivate(): Observable<boolean>{
    return this.authService.usuarioLogado
      .pipe(
        take(1),
        map(usuario => {
          if(!usuario)   // caso não tenha um usuario, ira retornar true, para que o usuario possa voltar a pagina de login
            return true;

          this.router.navigate(["/painel"]); // caso contrario ele se mantem no painel 
          return false;
        })
      )
  }

}

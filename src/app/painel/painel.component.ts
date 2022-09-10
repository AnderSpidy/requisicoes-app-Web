import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})
export class PainelComponent implements OnInit, OnDestroy {
  emailUsuario?: string | null;
  usuarioLogado$: Subscription;

  constructor(private authService:AuthenticationService, private router: Router) { }

//logica de inicialização da pagina
//setup
  ngOnInit(): void {
    this.usuarioLogado$ = this.authService.usuarioLogado.subscribe(usuario => this.emailUsuario = usuario?.email)
  }

  //cleanup
  //quuando nao estivermos mais na tela de painel, é executado esse metodo, paa que senha excluido todos dados referente a essa tela da memoria
  ngOnDestroy(): void {
    this.usuarioLogado$.unsubscribe();
  }

  public sair(){
    this.authService.logout().then(() => this.router.navigate(['/login']));
  }

}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/services/auth.guard';
import { LoginGuard } from './auth/services/login.guard';
import { PainelComponent } from './painel/painel.component';

const routes: Routes = [
  {path: "", redirectTo: "login", pathMatch: "full"},
  {path: "login", component: LoginComponent,canActivate:[LoginGuard]},// isto evita que um usuario logado, entre em uma pagna de login
  {path: "painel", component: PainelComponent,canActivate:[AuthGuard]},//e o authGuard evita que um usuario nao logado, consiga acessar os departamentos, equipamentos etc... (via URL)
  {path: "departamentos",
  loadChildren:() => import("./departamentos/departamento.module")
    .then(m => m.DepartamentoModule),
    canActivate:[AuthGuard]
},
{path: "equipamentos",
  loadChildren:() => import("./equipamentos/equipamento.module")
    .then(m => m.EquipamentoModule),
    canActivate:[AuthGuard]
},
{path: "funcionarios",
  loadChildren:() => import("./funcionarios/funcionario.module")
    .then(m => m.FuncionarioModule),
    canActivate:[AuthGuard]
},
{path: "requisicoes",
  loadChildren:() => import("./requisicoes/requisicao.module")
    .then(m => m.RequisicaoModule),
    canActivate:[AuthGuard]
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

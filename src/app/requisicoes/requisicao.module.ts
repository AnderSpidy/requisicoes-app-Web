import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequisicaoRoutingModule } from './requisicao-routing.module';
import { RequisicaoComponent } from './requisicao.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequisicoesFuncionarioComponent } from './requisicoes-funcionario/requisicoes-funcionario.component';
import { RequisicoesDepartamentoComponent } from './requisicoes-departamento/requisicoes-departamento.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { RequisicoesDetalhesComponent } from './detalhes/requisicoes-detalhes/requisicoes-detalhes.component';
import { RequisicoesDepartamentoPipe } from './pipes/requisicoes-departamento.pipe';
import { PipesrequisicoesFuncionarioPipe } from './pipesrequisicoes-funcionario.pipe';
import { RequisicoesFuncionarioPipe } from './pipes/requisicoes-funcionario.pipe';


@NgModule({
  declarations: [
    RequisicaoComponent,
    RequisicoesFuncionarioComponent,
    RequisicoesDepartamentoComponent,
    DetalhesComponent,
    RequisicoesDetalhesComponent,
    RequisicoesDepartamentoPipe,
    PipesrequisicoesFuncionarioPipe,
    RequisicoesFuncionarioPipe
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    RequisicaoRoutingModule
  ],
  providers:[RequisicaoComponent]
})
export class RequisicaoModule { }

import { Pipe, PipeTransform } from '@angular/core';
import { Requisicao } from '../models/requisicao.model';

@Pipe({
  name: 'requisicoesFuncionario'
})

//A CLASSE ESTÁ CRIADA, POREM NÃO ESTA SENDO UTILIZADA, PARA SABER MAIS INFORMAÇÕES ASSISTA VIDEO 99 - PIPES CUSTOMIZADOS (a partir de 15:00 min)
export class RequisicoesFuncionarioPipe implements PipeTransform {

  transform(requisicoes: Requisicao[]|null,funcionarioId: string): Requisicao[] {
    if(!requisicoes)
      return [];

    return requisicoes.filter(req => req.funcionarioId === funcionarioId);
  }
}

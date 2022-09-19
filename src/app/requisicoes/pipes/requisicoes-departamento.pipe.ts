import { Pipe, PipeTransform } from '@angular/core';
import { Requisicao } from '../models/requisicao.model';

@Pipe({
  name: 'requisicoesDepartamento'
})
export class RequisicoesDepartamentoPipe implements PipeTransform {
//com os pipes costumizados, nos podemos fazer essa filtragem de nossos objetos, antes para assim ficar mais facil de manipupular.(Para mim, a maior vantagem éque nas classes dedominio, não fica aquela coisa verbosa e feia que muitas vezes nao conseguimos entender direito.)
  transform(requisicoes: Requisicao[] | null, departamentoId: string): Requisicao[] {
    if(!requisicoes)
      return[];

    return requisicoes.filter(req => req.departamentoId === departamentoId);
  }

}

import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";
import { Movimentacao } from "./movimentacao.model";

export class Requisicao{
  id:string;
  descricao:string;
  dataAbertura: Date | any;

  equipamentoId?:string | null;
  equipamento?:Equipamento;

  departamentoId: string;
  departamento?: Departamento;

  funcionarioId:string;
  funcionario?: Funcionario;


  //movimentações

  ultimaAtt: Date| any;
  status: string;
  movimentacoes: Movimentacao[];

}

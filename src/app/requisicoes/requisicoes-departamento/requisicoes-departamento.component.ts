import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Movimentacao } from '../models/movimentacao.model';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-departamento',
  templateUrl: './requisicoes-departamento.component.html',
})
export class RequisicoesDepartamentoComponent implements OnInit {

  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  private processoAutenticado$: Subscription; //com esse objeto, toda vez que ele é recebido com subscribe, quando já nao for mais utilizado, é "fechado" se desencrevendo(dessa forma nao pesando a aplicação, pois os sibscribe, são adiciononados aos eventlistners)

  public funcionarioLogado: Funcionario;
  public requisicaoSelecionada: Requisicao;
  public listaStatus: string[] = ["Aberta", "Processando", "Não Autorizada", "Fechada"];
  public form: FormGroup;

  constructor(private requisicaoService: RequisicaoService, private departamentoService: DepartamentoService, private equipamentoService: EquipamentoService, private funcionarioService: FuncionarioService,
    private authService: AuthenticationService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder) { }


  ngOnInit(): void {
    this.form = this.fb.group({

      data: new FormControl(""),
      status: new FormControl("", [Validators.required]),
      descricao: new FormControl("", [Validators.required, Validators.minLength(6)]),
      funcionario: new FormControl(""),

    });

    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();



    this.processoAutenticado$ = this.authService.usuarioLogado.subscribe(usuario => {
      const email: string = usuario?.email!; // ao contrario do ponto de interrogação, o ponto de exclamação significa que 'eu como desenvolvedor estou dizendo que de fato, esse atributo NAO VAI SER NULO!' ou seja -confia pô

      this.funcionarioService.selecionarFuncionarioLogado(email)
        .subscribe(funcionario => {
          this.funcionarioLogado = funcionario;

          this.requisicoes$ = this.requisicaoService.selecionarRequisicoesDepartamentoDoFuncionario(funcionario.departamentoId);
        });
    });
  }
  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get descricao(): AbstractControl | null {
    return this.form.get("descricao");
  }

  get dataAbertura(): AbstractControl | null {
    return this.form.get("dataAbertura");
  }
  get solicitanteId(): AbstractControl | null {
    return this.form.get("solicitanteId");
  }

  get departamentoId(): AbstractControl | null {
    return this.form.get("departamentoId");
  }
  get equipamentoId(): AbstractControl | null {
    return this.form.get("equipamentoId");
  }

  get status(): AbstractControl | null {
    return this.form.get("status");
  }

  //método para gravar o novo departamento
  public async gravar(modal: TemplateRef<any>, requisicao: Requisicao) {
    this.requisicaoSelecionada = requisicao;
    this.requisicaoSelecionada.movimentacoes = requisicao.movimentacoes ? requisicao.movimentacoes : [];

    this.form.reset(); //para limpar todos os dados do formulario

    this.configurarValorespadrão();


    try {
      await this.modalService.open(modal).result;
      if (this.form.dirty && this.form.valid) {

        this.atualizarRequisicao(this.form.value);

        await this.requisicaoService.editar(this.requisicaoSelecionada);

        this.toastrService.success(`A requisição foi salva com sucesso!`, "Cadastro de Requisição:", {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });

      } else {
        this.toastrService.error("Verifique o preenchimento do formulario e tente novamente.", "Cadastro de Requisição:", {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
      }
    } catch (erro) {
      if (erro != "fechar" && erro != "0" && erro != "1")
        this.toastrService.error("Houve um erro ao salvar a sua requisição. Tente Novamente.", "Cadastro de Requisição:", {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
    }
  }


  private atualizarRequisicao(movimentacao: Movimentacao) {
    this.requisicaoSelecionada.movimentacoes.push(movimentacao);
    this.requisicaoSelecionada.status = this.status?.value;
    this.requisicaoSelecionada.ultimaAtt = new Date();
  }

  private configurarValorespadrão(): void {
    this.form.patchValue({
      funcionario: this.funcionarioLogado,
      status: this.requisicaoSelecionada?.status,
      data: new Date()
    });


  }
}

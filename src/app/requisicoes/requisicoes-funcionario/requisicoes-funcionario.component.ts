import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-funcionario',
  templateUrl: './requisicoes-funcionario.component.html',
})
export class RequisicoesFuncionarioComponent implements OnInit, OnDestroy {

  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  private processoAutenticado$: Subscription; //com esse objeto, toda vez que ele é recebido com subscribe, quando já nao for mais utilizado, é "fechado" se desencrevendo(dessa forma nao pesando a aplicação, pois os sibscribe, são adiciononados aos eventlistners)

  public funcionarioLogadoId: string;
  public form: FormGroup;

  constructor(private requisicaoService: RequisicaoService, private departamentoService: DepartamentoService, private equipamentoService: EquipamentoService, private funcionarioService: FuncionarioService,
    private authService: AuthenticationService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder) { }


  ngOnInit(): void {
    this.processoAutenticado$ = this.authService.usuarioLogado.subscribe(usuario =>{
      const email: string = usuario?.email!; // ao contrario do ponto de interrogação, o ponto de exclamação significa que 'eu como desenvolvedor estou dizendo que de fato, esse atributo NAO VAI SER NULO!' ou seja -confia pô

      this.funcionarioService.selecionarFuncionarioLogado(email)
        .subscribe(funcionario => {
          this.funcionarioLogadoId = funcionario.id
        });
    });
  }
  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }
  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
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


  //método para gravar o novo departamento
  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {

    this.form.reset(); //para limpar todos os dados do formulario, caso possa ter

    if (requisicao) // esse if seria para caso o objeto selecionado já seja um departamento, assim já retorna o próprio departamento da EDIÇÂO
    {
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;
      //spread operator (JavaScript)
      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento
      }
      this.form.get("requisicao")?.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      // se o formulario estiver preenchido && valido, então pode gravar
      if (this.form.dirty && this.form.valid) {
        if (requisicao) {
          await this.requisicaoService.editar(this.form.get("requisicao")?.value); // caso seja um departamento ja instanciado, vai para o metodo editar
          this.toastrService.success('ta entrando aqui !', 'Requisicao!', {
            timeOut: 6000,
            progressBar: true,
            positionClass: 'toast-bottom-right'
          });
        }
        else {


          // console.log(this.funcionarioLogado);
          // this.form.get("dataAbertura")?.setValue(new Date(Date.now()).toDateString());
          // this.form.get("funcionario")?.setValue(this.funcionarioLogado);
          // this.form.get("funcionarioId")?.setValue(this.funcionarioLogado.id);

          await this.requisicaoService.inserir(this.form.value) // caso contrario, é inserido um departamento novo

          this.toastrService.success('O requisicao foi salvo com Sucesso!', 'Nova requisicao'+ this.form.value.nome + '!', {
            timeOut: 6000,
            progressBar: true,
            positionClass: 'toast-bottom-right'
          });
        }
      }else{
        this.toastrService.error('O Formulario deve ser preenchido!', 'Falha ao Inserir Novo Funcionario!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });

      }


    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error('Houve um erro ao inserir um novo Funcionario!', 'Falha ao Inserir Novo Funcionario!', {
        timeOut: 6000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    }
  }

  public async excluir(modalExcluir: TemplateRef<any>, requisicao: Requisicao) {
    try {
      await this.modalService.open(modalExcluir).result;


      await this.requisicaoService.excluir(requisicao);

      this.toastrService.info('O requisicao foi excluido com Sucesso!', 'requisicao!', {
        timeOut: 6000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error('Houve um erro ao excluir a requisicao!', 'Falha ao Excluir!', {
        timeOut: 6000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    }

  }


  // private obterFuncionarioLogado(){
  //   this.authService.usuarioLogado
  //     .subscribe(dados =>{
  //       this.funcionarioService.selecionarFuncionarioLogado(dados?.email!) // a exclamação serve para 'forçar' o andamento do fluxo
  //         .subscribe(funcionario => {
  //           this.funcionarioLogado = funcionario;

  //         })
  //     })
  // }
  // private obterRequisiçõesDoFuncionarioLogado(): Observable<Requisicao[]> |any{
  //   this.requisicaoService.selecionarTodos()
  //     .pipe(
  //       map(requisicoes =>{
  //         return requisicoes.filter(req => req.funcionario?.email === this.funcionarioLogado.email);
  //       })
  //     )
  // }

}

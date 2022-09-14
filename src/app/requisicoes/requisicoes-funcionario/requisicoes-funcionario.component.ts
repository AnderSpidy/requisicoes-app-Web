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
    this.form = this.fb.group({
      id: new FormControl(""),
      descricao: new FormControl(""),
      dataAbertura: new FormControl(""),

      funcionarioId: new FormControl(""),
      funcionario: new FormControl(""),

      departamentoId: new FormControl(""),
      departamento: new FormControl(""),

      equipamentoId: new FormControl(""),
      equipameto: new FormControl(""),

      //vou deixar os atributosa da movimentação aqui, pois aparentemete, o ideal e ter todos os atributos do objeto aqui

      ultimaAtt: new FormControl(""),
      status: new FormControl(""),
      movimentacoes: new FormControl("")

    });

    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();



    this.processoAutenticado$ = this.authService.usuarioLogado.subscribe(usuario =>{
      const email: string = usuario?.email!; // ao contrario do ponto de interrogação, o ponto de exclamação significa que 'eu como desenvolvedor estou dizendo que de fato, esse atributo NAO VAI SER NULO!' ou seja -confia pô

      this.funcionarioService.selecionarFuncionarioLogado(email)
        .subscribe(funcionario => {
          this.funcionarioLogadoId = funcionario.id;

          //dessa forma eu estou usando esse metodo do requisição service, em que ele filtra apenas as requisições que são associados ao funcionario que esta logado
          this.requisicoes$ = this.requisicaoService.selecionarRequisicoesFuncionarioAtual(this.funcionarioLogadoId);
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

    this.form.reset(); //para limpar todos os dados do formulario
    this.configurarValorespadrão();
    if(requisicao){
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const funcionario = requisicao.funcionario ? requisicao.funcionario : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;

      const requisicaoCompleta = {
        ...requisicao,// o spread é como clonar um objeto de requisição direto para a requisiçãoCompleta, com todos os atributos de requisição
        departamento,
        funcionario,
        equipamento
      }
      this.form.setValue(requisicaoCompleta);
    }
    try{
      await this.modalService.open(modal).result;
      if(this.form.dirty && this.form.valid){
        if(!requisicao)
          await this.requisicaoService.inserir(this.form.value);
        else
          await this.requisicaoService.editar(this.form.value);

        this.toastrService.success(`A requisição foi salva com sucesso!`, "Cadastro de Requisição:", {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });

      }else{
        this.toastrService.error("Verifique o preenchimento do formulario e tente novamente.","Cadastro de Requisição:", {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
      }
    }catch(erro){
      if(erro != "fechar" && erro != "0" && erro != "1")
        this.toastrService.error("Houve um erro ao salvar a sua requisição. Tente Novamente.", "Cadastro de Requisição:", {
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

  private configurarValorespadrão(): void{

    this.form.get("dataAbertura")?.setValue(new Date());
    this.form.get("equipamentoId")?.setValue(null);
    this.form.get("funcionarioId")?.setValue(this.funcionarioLogadoId);

    //configuração inicial para movimentações
    this.form.get("ultimaAtt")?.setValue(new Date());
    this.form.get("status")?.setValue("Aberta");
  }
}

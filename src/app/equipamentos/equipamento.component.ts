import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './services/equipamento.service';
import { ValidatorDate } from './date.validador';
import { dataFuturaValidators } from '../shared/validators/data-futura.validators';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html'
})
export class EquipamentoComponent implements OnInit {

  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(private equipamentoService: EquipamentoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      numeroSerie: new FormControl("", [Validators.required, Validators.minLength(6)]),
      nomeEquipamento: new FormControl("", [Validators.required, Validators.minLength(3)]),
      preco: new FormControl("", [Validators.required]),
                                          //Aqui eu estava usando o 'ValidatorDate' que tinha criado, que esta no arquivo 'date.validador.ts', mas troquei para esse que esta na pasta 'shared/validators/data-futura.validators.ts' que foi o que o tiago fez no video de "Validadores Customizados"
      dataFabricacao: new FormControl("", [dataFuturaValidators(), Validators.required])
    })
  }
  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get nomeString(): string {
    return this.nomeEquipamento?.value;
  }
  get id() {
    return this.form.get("id");
  }

  get numeroSerie() {
    return this.form.get("numeroSerie");
  }

  get nomeEquipamento() {
    return this.form.get("nomeEquipamento");
  }
  get preco() {
    return this.form.get("preco");
  }
  get dataFabricacao() {
    return this.form.get("dataFabricacao")
  }

  //método para gravar o novo equipamento
  public async gravar(modal: TemplateRef<any>) {

    this.form.reset(); //para limpar todos os dados do formulario, caso possa ter

    try {
      await this.modalService.open(modal).result;
      if (this.form.dirty && this.form.valid) { // isso aqui evita de inserir caso todo o formulario na esteja preenchido!
        await this.equipamentoService.inserir(this.form.value) // caso contrario, é inserido um departamento novo
        this.toastrService.success('O equipamento foi salvo com Sucesso!', 'Novo Equipamento', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
      } else {
        this.toastrService.error('O Formulario deve ser preenchido!', 'Falha ao Inserir Novo Equipamento!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });

      }


    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error('Houve um erro ao inserir um novo Equipamento!', 'Falha ao Inserir Novo Equipamento!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
    }
  }

  public async gravarEditar(modalEditar: TemplateRef<any>, equipamento: Equipamento) {

    this.form.reset(); //para limpar todos os dados do formulario, caso possa ter

    this.form.setValue(equipamento);


    try {
      await this.modalService.open(modalEditar).result;
      if (this.form.dirty && this.form.valid) { // isso aqui evita de inserir caso todo o formulario na esteja preenchido!
        await this.equipamentoService.editar(this.form.value); // caso seja um departamento ja instanciado, vai para o metodo editar
        this.toastrService.success('O equipamento foi editado com Sucesso!', 'Equipamento: ' + equipamento.nomeEquipamento + '!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
      } else {
        this.toastrService.error('O Formulario deve ser preenchido!', 'Falha ao Inserir Novo Equipamento!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });

      }
    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error('Houve um erro ao editar o equipamento: ' + equipamento.nomeEquipamento + '!', 'Falha ao Editar!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
    }
  }


  public async excluir(modalExcluir: TemplateRef<any>, equipamento: Equipamento) {
    try {
      await this.modalService.open(modalExcluir).result;
      await this.equipamentoService.excluir(equipamento);
      this.toastrService.info('O equipamento foi excluido com Sucesso!', 'Equipamento: ' + equipamento.nomeEquipamento + '!', {
        timeOut: 6000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error('Houve um erro ao excluir o equipamento: ' + equipamento.nomeEquipamento + '!', 'Falha ao Excluir!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
    }
  }
}

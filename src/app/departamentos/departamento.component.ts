import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Departamento } from './models/departamento.model';
import { DepartamentoService } from './services/departamento.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html'
})
export class DepartamentoComponent implements OnInit {

  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;


  constructor(private departamentoService: DepartamentoService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.form = this.fb.group({
      id: new FormControl(""),
      nome: new FormControl("",[Validators.required,Validators.minLength(3)]),
      telefone: new FormControl("",[Validators.required,Validators.minLength(12)])
    })
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }


  get id() {
    return this.form.get("id");
  }

  get nome() {
    return this.form.get("nome");
  }
  get telefone() {
    return this.form.get("telefone");
  }

  //método para gravar o novo departamento
  public async gravar(modal: TemplateRef<any>, departamento?: Departamento) {

    this.form.reset(); //para limpar todos os dados do formulario, caso possa ter

    if (departamento) // esse if seria para caso o objeto selecionado já seja um departamento, assim já retorna o próprio departamento da EDIÇÂO
      this.form.setValue(departamento);

    try {
      await this.modalService.open(modal).result;

      if (departamento) {
        await this.departamentoService.editar(this.form.value); // caso seja um departamento ja instanciado, vai para o metodo editar
        this.toastrService.success('O departamento foi editado com Sucesso!', 'Departamento: ' + departamento.nome + '!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });
      }
      else {
        await this.departamentoService.inserir(this.form.value) // caso contrario, é inserido um departamento novo
        this.toastrService.success('O departamento foi inserido com Sucesso!', 'Departamento: ' + this.form.value.nome  + '!', {
          timeOut: 6000,
          progressBar: true,
          positionClass: 'toast-bottom-right'
        });

      }

    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error('Houve um erro ao inserir um novo Departamento!', 'Falha ao Inserir Novo Departamento!', {
        timeOut: 6000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    }
  }

  public async excluir(modalExcluir: TemplateRef<any>, departamento: Departamento) {
    try {
      await this.modalService.open(modalExcluir).result;


      await this.departamentoService.excluir(departamento);

      console.log(`O departamento foi salvo com sucesso `);
    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
      this.toastrService.error('Houve um erro ao excluir o Departamento!', 'Falha ao Excluir o Departamento!', {
        timeOut: 6000,
        progressBar: true,
        positionClass: 'toast-bottom-right'
      });
    }

  }

}

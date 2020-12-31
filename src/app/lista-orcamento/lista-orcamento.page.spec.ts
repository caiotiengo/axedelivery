import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaOrcamentoPage } from './lista-orcamento.page';

describe('ListaOrcamentoPage', () => {
  let component: ListaOrcamentoPage;
  let fixture: ComponentFixture<ListaOrcamentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaOrcamentoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaOrcamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

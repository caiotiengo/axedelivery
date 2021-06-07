import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PoliticaOrcamentoPage } from './politica-orcamento.page';

describe('PoliticaOrcamentoPage', () => {
  let component: PoliticaOrcamentoPage;
  let fixture: ComponentFixture<PoliticaOrcamentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliticaOrcamentoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoliticaOrcamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

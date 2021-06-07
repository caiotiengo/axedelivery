import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrcamentoPage } from './orcamento.page';

describe('OrcamentoPage', () => {
  let component: OrcamentoPage;
  let fixture: ComponentFixture<OrcamentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrcamentoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrcamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalVendaPage } from './modal-venda.page';

describe('ModalVendaPage', () => {
  let component: ModalVendaPage;
  let fixture: ComponentFixture<ModalVendaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalVendaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalVendaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

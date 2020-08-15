import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemVendaPage } from './item-venda.page';

describe('ItemVendaPage', () => {
  let component: ItemVendaPage;
  let fixture: ComponentFixture<ItemVendaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemVendaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemVendaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

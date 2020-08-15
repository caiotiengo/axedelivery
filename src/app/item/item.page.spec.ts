import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemPage } from './item.page';

describe('ItemPage', () => {
  let component: ItemPage;
  let fixture: ComponentFixture<ItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

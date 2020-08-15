import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemViewPage } from './item-view.page';

describe('ItemViewPage', () => {
  let component: ItemViewPage;
  let fixture: ComponentFixture<ItemViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

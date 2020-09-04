import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EntregarPage } from './entregar.page';

describe('EntregarPage', () => {
  let component: EntregarPage;
  let fixture: ComponentFixture<EntregarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntregarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EntregarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

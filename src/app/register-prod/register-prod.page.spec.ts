import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterProdPage } from './register-prod.page';

describe('RegisterProdPage', () => {
  let component: RegisterProdPage;
  let fixture: ComponentFixture<RegisterProdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterProdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterProdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

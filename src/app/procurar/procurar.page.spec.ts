import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProcurarPage } from './procurar.page';

describe('ProcurarPage', () => {
  let component: ProcurarPage;
  let fixture: ComponentFixture<ProcurarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcurarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcurarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

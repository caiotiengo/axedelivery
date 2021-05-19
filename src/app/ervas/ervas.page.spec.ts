import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ErvasPage } from './ervas.page';

describe('ErvasPage', () => {
  let component: ErvasPage;
  let fixture: ComponentFixture<ErvasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErvasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ErvasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

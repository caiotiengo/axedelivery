import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LalaMovePage } from './lala-move.page';

describe('LalaMovePage', () => {
  let component: LalaMovePage;
  let fixture: ComponentFixture<LalaMovePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LalaMovePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LalaMovePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

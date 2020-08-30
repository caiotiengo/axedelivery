import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddProcPage } from './add-proc.page';

describe('AddProcPage', () => {
  let component: AddProcPage;
  let fixture: ComponentFixture<AddProcPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProcPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

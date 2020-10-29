import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GanhosPage } from './ganhos.page';

describe('GanhosPage', () => {
  let component: GanhosPage;
  let fixture: ComponentFixture<GanhosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanhosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GanhosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

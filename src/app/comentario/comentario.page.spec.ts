import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComentarioPage } from './comentario.page';

describe('ComentarioPage', () => {
  let component: ComentarioPage;
  let fixture: ComponentFixture<ComentarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComentarioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComentarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

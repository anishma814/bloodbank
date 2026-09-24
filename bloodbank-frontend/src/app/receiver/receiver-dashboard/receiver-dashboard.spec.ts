import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceiverDashboard } from './receiver-dashboard';

describe('ReceiverDashboard', () => {
  let component: ReceiverDashboard;
  let fixture: ComponentFixture<ReceiverDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiverDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiverDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

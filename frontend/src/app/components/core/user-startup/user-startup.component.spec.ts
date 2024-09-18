import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStartupComponent } from './user-startup.component';

describe('UserStartupComponent', () => {
  let component: UserStartupComponent;
  let fixture: ComponentFixture<UserStartupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStartupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStartupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

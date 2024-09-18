import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInvestorsComponent } from './user-investors.component';

describe('UserInvestorsComponent', () => {
  let component: UserInvestorsComponent;
  let fixture: ComponentFixture<UserInvestorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInvestorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInvestorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralLinkDialogComponent } from './referral-link-dialog.component';


describe('ReferralLinkDialogComponent', () => {
  let component: ReferralLinkDialogComponent;
  let fixture: ComponentFixture<ReferralLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralLinkDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

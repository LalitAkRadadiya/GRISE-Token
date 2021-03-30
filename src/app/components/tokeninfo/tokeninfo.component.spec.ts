import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokeninfoComponent } from './tokeninfo.component';

describe('TokeninfoComponent', () => {
  let component: TokeninfoComponent;
  let fixture: ComponentFixture<TokeninfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokeninfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokeninfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

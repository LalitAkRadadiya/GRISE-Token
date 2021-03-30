import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenMetrixComponent } from './token-metrix.component';

describe('TokenMetrixComponent', () => {
  let component: TokenMetrixComponent;
  let fixture: ComponentFixture<TokenMetrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenMetrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenMetrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

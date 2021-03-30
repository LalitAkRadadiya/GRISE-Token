import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenstatsComponent } from './tokenstats.component';

describe('TokenstatsComponent', () => {
  let component: TokenstatsComponent;
  let fixture: ComponentFixture<TokenstatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenstatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenstatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

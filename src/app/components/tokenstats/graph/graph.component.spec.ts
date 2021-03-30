import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphComponent } from './graph.component';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

describe('GraphComponent', () => {
  let component: GraphComponent;
  let fixture: ComponentFixture<GraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  loading = false;

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.spinnerService.spinnerStateChanged.subscribe(state => this.loading = state);
  }

}

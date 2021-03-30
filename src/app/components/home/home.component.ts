import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  // myObj = JSON.parse('{"name":"John", "age":31, "city":"New York"}');
  // constructor() { }

  public navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
}
  ngOnInit(): void {
  }

}

import { Component } from '@angular/core';
import { environment } from 'client/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() { 
    if(localStorage.length > 0 && localStorage.getItem(environment.key)) {
      localStorage.removeItem(environment.key);
    }
  }
  
}

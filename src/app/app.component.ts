import { Component } from '@angular/core';
// import io from "socket.io";

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <div class="background">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mystery Chess';
}

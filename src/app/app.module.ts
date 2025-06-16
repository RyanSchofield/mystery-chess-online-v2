import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { GameboardComponent } from './gameboard2/gameboard.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { LobbyComponent } from './lobby/lobby.component';

const appRoutes: Routes = [
  // { path: '/', component: GameboardComponent },
  { path: 'start', component: LoginComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'game/:id', component: GameboardComponent },
  { path: 'game/bot', component: GameboardComponent },
  { path: '', component: LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GameboardComponent,
    ChatComponent,
    LoginComponent,
    LobbyComponent
  ],
	imports: [
	  // HttpClientModule,
	  BrowserModule,
	  FormsModule,
		DragDropModule,
		// AppRoutingModule,
		HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    )

// The HttpClientInMemoryWebApiModule module intercepts HTTP requests
// and returns simulated server responses.
// Remove it when a real server is ready to receive requests.
// HttpClientInMemoryWebApiModule.forRoot(
//   InMemoryDataService, { dataEncapsulation: false }
// )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

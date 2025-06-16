import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { io } from "socket.io-client";

type Game = {
    id: number;
    player1: string;
    player2: string;
}


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  
    public socket: any;
    public games: any;

    constructor(
        private router: Router
    ) {
        // this.socket = io("http://192.168.1.6:3000");
        this.socket = io();
        // this.socket = io("http://localhost:3000")
        this.socket.on("gamesList", (games: any) => {
            this.games = games;
            console.log('got some games', games)
        });

        this.socket.on("newGame", (game: any) => {
            // console.log('new game', game);
            this.router.navigate(['/game/' + game.id])
        });

        console.log('lobby constructor');
    }

    public createGame(botGame = false, localGame = false) {
        if (botGame) {
            this.router.navigate(['/game/bot'])
            return
        }

        if (localGame) {
            this.router.navigate(['/game/local'])
            return;
        }
        this.socket.emit("createGame");
    }

    public joinGame(game: Game) {
        this.router.navigate(['/game/' + game.id])
    }

    // ngOnInit() {
    //     this.getGames();
    // }
  
    // getGames() {
    //   if (this.username) {
    //     // Store the username in localStorage
    //     localStorage.setItem('username', this.username);
  
    //     // You can navigate to another page or perform other actions here
    //     // For example, redirect to a dashboard:
    //     this.router.navigate(['/game']);
    //   }
    // }
}

// todo fix capture into check bug

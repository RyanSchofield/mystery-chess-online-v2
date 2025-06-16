import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { io } from "socket.io-client";

import { Alliance } from './alliance.enum';
import { King } from './pieces/king/king.component';
import { Bishop } from './pieces/bishop/bishop.component';
import { Rook } from './pieces/rook/rook.piece';
import { Knight } from './pieces/knight/knight.component';
import { Queen } from './pieces/queen/queen.piece';
import { Pawn } from './pieces/pawn/pawn.piece';
import { ChatComponent } from '../chat/chat.component';
import { GameHelper } from '../game/game.helper';
import { Bot } from '../bot/bot.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';


@Component({
  	selector: 'app-gameboard',
  	templateUrl: './gameboard.component.html',
  	styleUrls: ['./gameboard.component.css']
})
export class GameboardComponent implements OnInit {
	@ViewChild('chat') public chat?: ChatComponent;

  	public tiles?: any;
  	public currentTurn: Alliance = Alliance.WHITE;
	public highlightedTiles: any[][];
	public threatTiles: any[][];
	public whiteGraveyard?: any[];
	public blackGraveyard?: any[];
	public message: string = '';
	public isSpectator: boolean = false;
	public spectatorNumber: number = -1;
	public playerColor?: Alliance;
	public socket: any;

	public AllianceEnum = Alliance;
	
	private _unhighlightedTiles : any[][];
	private _whiteReserve?: any[];
	private _blackReserve?: any[];

	// private _audio = new Audio();

	private _hasWhiteKingMoved: boolean = false;
	private _hasBlackKingMoved: boolean = false;

	public lastMoveCoordinates?: any;

	public engageBot = false;
	public isLocal = false;

	public playerName?: string ;

	@HostListener('window:popstate', ['$event'])
	onPopState(event: any) {
		this.socket.emit('exit');
	}


	constructor(
		private route: ActivatedRoute,
		private router: Router
	) { 
		this.currentTurn = Alliance.WHITE; 
		this.highlightedTiles = GameHelper.noHighlightedTiles(); 
		this.threatTiles = GameHelper.noHighlightedTiles();
		this._unhighlightedTiles = GameHelper.noHighlightedTiles();
		// this.socket = io("http://192.168.1.6:3000");
		// this.socket = io("http://192.168.50.12:3000");
		//test
		this.socket = io(); // DEBUG

		// this.socket = io("http://localhost:3000")
		// console.log('cookie', document.cookie);
		// document.cookie = "username=John Doe, expires=Thu, 18 Dec 2013 12:00:00 UTC";
		// console.log('cookie', document.cookie);
		// console.log('username', localStorage.getItem('username'));

		const url = this.router.url;
		const segments = url.split('/').filter(segment => segment);
		if (segments[segments.length - 1] == 'bot') {
			console.log('play the bot?')
			this.engageBot = true;
			this.playerColor = this.AllianceEnum.WHITE
			return;
		}

		if (segments[segments.length - 1] == 'local') {
			console.log('play locally?')
			this.engageBot = false;
			this.isLocal = true;
			return;
		}

		let username = localStorage.getItem('username');
		if (username) {
			this.playerName = username as string;
			if (username === 'bot tester') {
				this.engageBot = true;
			}
		}

		this.router.events.subscribe((data: any) => console.log('router event', data));

		this._initializeSocket();

		console.log('game constructor, socket connected?', this.socket.connected);
		// maybe emit here to actually join the game.. deals with back button from another page issue

	}

	ngOnInit(): void {
		this._initializeGameboard();
		console.log('ngOnInit, socket connected?', this.socket.connected)
		// this._initializeSocket();
		// console.log('username', localStorage.getItem('username'));
  	}

	ngAfterViewInit() {
		console.log('afterViewInit, socket connected?', this.socket.connected)
	}

	ngOnDestroy() {
		console.log('destroyyyyy')
	}

	drag(event: any) {
		let piece = event.source.data.piece;
		let origin = {x: event.source.data.x, y: event.source.data.y};

		this.highlightedTiles = piece.getValidMoveTiles(origin, this.tiles);
		// add to highlighted tiles here if can castle
		if (
			piece 
			&& piece.typeDisplay === 'king' 
			&& piece.alliance === Alliance.WHITE
		) {
			// console.log('white king picked up');
			if (this._canKingsideCastle(Alliance.WHITE)) {
				// console.log('kingside')
				this.highlightedTiles[0][1] = true;
			}
			if (this._canQueensideCastle(Alliance.WHITE)) {
				// console.log('queen side')
				this.highlightedTiles[0][5] = true;
			}
		} else if (
			piece 
			&& piece.typeDisplay === 'king' 
			&& piece.alliance === Alliance.BLACK
		) {
			// console.log('black king')
			if (this._canKingsideCastle(Alliance.BLACK)) {
				// console.log('king side')
				this.highlightedTiles[7][1] = true;
			}
			if (this._canQueensideCastle(Alliance.BLACK)) {
				// console.log('queen side')
				this.highlightedTiles[7][5] = true;
			}
		}
	}

	drop(event: CdkDragDrop<any>) {
		this.message = '';

		let target = {x: event.container.data.x, y: event.container.data.y};
		let origin = {x: event.item.data.x, y: event.item.data.y};

		// castling logic goes here
		if (event.item.data.piece.typeDisplay == 'king') {
			console.log('picked up king');
			let castled = false;
			if (event.item.data.piece.alliance == Alliance.WHITE 
				&& this._canKingsideCastle(Alliance.WHITE)
				&& target.x == 0
				&& target.y == 1
			) {
				this.tiles[0][1].piece = event.item.data.piece;
				this.tiles[origin.x][origin.y].piece = null;
				this.tiles[0][2].piece = this._whiteReserve?.pop();
				this.tiles[0][0].piece = null;
				castled = true;
			} else if (event.item.data.piece.alliance == Alliance.WHITE 
				&& this._canQueensideCastle(Alliance.WHITE)
				&& target.x == 0
				&& target.y == 5
			) {
				this.tiles[0][5].piece = event.item.data.piece;
				this.tiles[origin.x][origin.y].piece = null;
				this.tiles[0][4].piece = this._whiteReserve?.pop();
				this.tiles[0][7].piece = null;
				castled = true;
			} else if (event.item.data.piece.alliance == Alliance.WHITE 
				&& this._canKingsideCastle(Alliance.WHITE)
				&& target.x == 7
				&& target.y == 0
			) {
				this.tiles[7][1].piece = event.item.data.piece;
				this.tiles[origin.x][origin.y].piece = null;
				this.tiles[7][2].piece = this._blackReserve?.pop();
				this.tiles[7][0].piece = null;
				castled = true;
			} else if (event.item.data.piece.alliance == Alliance.BLACK 
				&& this._canQueensideCastle(Alliance.BLACK)
				&& target.x == 7
				&& target.y == 5
			) {
				this.tiles[7][5].piece = event.item.data.piece;
				this.tiles[origin.x][origin.y].piece = null;
				this.tiles[7][4].piece = this._blackReserve?.pop();
				this.tiles[7][7].piece = null;
				castled = true;
			}

			if (castled) {
				this.currentTurn = this.currentTurn === Alliance.WHITE ? Alliance.BLACK : Alliance.WHITE;

				this.socket.emit("move",  {
					tiles: this.tiles,
					currentTurn: this.currentTurn,
					whiteReserve: this._whiteReserve,
					blackReserve: this._blackReserve,
					whiteGraveyard: this.whiteGraveyard,
					blackGraveyard: this.blackGraveyard
				});

				this.highlightedTiles = this._unhighlightedTiles;
				return;
			}
		}
		

		if (!GameHelper.sameCoordinates(origin, target) && event.item.data.piece.validateMove(origin, target, this.tiles)) {
			let originalTiles = GameHelper.copyTiles(this.tiles);
			let originalWhiteGraveyard = this.whiteGraveyard;
			let originalBlackGraveyard = this.blackGraveyard;
			// console.log(JSON.parse(JSON.stringify(this.tiles)));

			// for (let i = 0; i < 8; i++) {
			// 	for (let j = 0; j < 8; j++) {
			// 		if (originalTiles[i][j].piece) {
			// 			originalTiles[i][j].piece = GameHelper.objectToPiece(originalTiles[i][j].piece);
			// 		} else {
			// 			originalTiles.piece = null;
			// 		}
			// 	}
			// }
			let tempDeadPiece: any = null;
			if (GameHelper.tileHasEnemy(target, this.tiles, event.item.data.piece.alliance)) {
				if (this.tiles[target.x][target.y].piece.alliance === Alliance.WHITE) { //target is white
					if (this.tiles[target.x][target.y].piece.isMysterious) {
						tempDeadPiece = this._whiteReserve?.pop(); //was let deadPiece =
						tempDeadPiece.makeMysterious();
						// this.whiteGraveyard?.push(deadPiece);
					} else {
						tempDeadPiece = this.tiles[target.x][target.y].piece;
						// this.whiteGraveyard?.push(this.tiles[target.x][target.y].piece);
					}
				} else { // target is black
					if (this.tiles[target.x][target.y].piece.isMysterious) {
						tempDeadPiece = this._blackReserve?.pop();
						tempDeadPiece.makeMysterious();
						// this.blackGraveyard?.push(deadPiece);
					} else {
						tempDeadPiece = this.tiles[target.x][target.y].piece;
						// this.blackGraveyard?.push(this.tiles[target.x][target.y].piece);
					}
				}
			}


			this.tiles[target.x][target.y].piece = event.item.data.piece;
			this.tiles[origin.x][origin.y].piece = null;

			// console.log('wtf');
			// console.log('is check?', this.isCheck());
			if (this.isCheck()) {
				// console.log('is check');
				// console.log(JSON.parse(JSON.stringify(this.tiles)));
				
				this.tiles = originalTiles;
				this.whiteGraveyard = originalWhiteGraveyard;
				this.blackGraveyard = originalBlackGraveyard;
				this.highlightedTiles = GameHelper.noHighlightedTiles();
				return;
			}

			if (tempDeadPiece) {
				if (tempDeadPiece.alliance === Alliance.BLACK) {
					this.blackGraveyard?.push(tempDeadPiece);
				} else {
					this.whiteGraveyard?.push(tempDeadPiece);
				}
			}

			if (this.tiles[target.x][target.y].piece.isMysterious) {
				if (this.tiles[target.x][target.y].piece.alliance === Alliance.WHITE) {
					// console.log(this.tiles[target.x][target.y].piece.alliance);
					this.tiles[target.x][target.y].piece = this._whiteReserve?.pop();
				} else {
					this.tiles[target.x][target.y].piece = this._blackReserve?.pop();
				}
			}

			if (this.tiles[target.x][target.y].piece.typeDisplay === 'pawn'
				&& this.tiles[target.x][target.y].piece.alliance === Alliance.WHITE
				&& target.x === 7
			) {
				this.tiles[target.x][target.y].piece = new Queen(Alliance.WHITE);
				this.message = 'Pawn promoted';
				this.chat?.sendMessage(null, this.message);
			}

			if (this.tiles[target.x][target.y].piece.typeDisplay === 'pawn'
				&& this.tiles[target.x][target.y].piece.alliance === Alliance.BLACK
				&& target.x === 0
			) {
				this.tiles[target.x][target.y].piece = new Queen(Alliance.BLACK);
				this.message = 'Pawn promoted';
				this.chat?.sendMessage(null, this.message);
			}

			this.currentTurn = this.currentTurn === Alliance.WHITE ? Alliance.BLACK : Alliance.WHITE;

			this.lastMoveCoordinates ={
				origin: origin,
				target: target 
			};
			// console.log('chat component?', this.chat);
			this.chat?.sendMessage(this.message);

			// console.log('hellloooo')

			this.socket.emit("move",  {
				tiles: this.tiles,
				currentTurn: this.currentTurn,
				whiteReserve: this._whiteReserve,
				blackReserve: this._blackReserve,
				whiteGraveyard: this.whiteGraveyard,
				blackGraveyard: this.blackGraveyard,
				lastMoveCoordinates: this.lastMoveCoordinates
			});

			// console.log('eh');

			if (GameHelper.isCheckmated(this.tiles, this.currentTurn)) window.alert('game over'); // emit game over

			console.log('set timeout')
			setTimeout(() => {
				if (
					this.engageBot 
					&& this.currentTurn !== this.playerColor
				) {
					// console.log('bot turn', this.tiles);
					console.log('bot move');
					this.getBotMove();
				}
			}, 500);
			// this._audio.play();
		}

		this.highlightedTiles = this._unhighlightedTiles;
	}

	public refresh() {
		if(confirm("Are you sure you want to restart the game?")) {
			// console.log("Implement delete functionality here");
			this.socket.emit("refresh", {});
		}
	}

	public undo() {
		if(confirm("Are you sure you want to undo?")) {
			// console.log("Implement delete functionality here");
			this.socket.emit("undo", {});
		}
	}

	private _initializeGameboard() {
		this._initializeReserves();
		this._initializeGraveyards();
		this._unhighlightedTiles = GameHelper.noHighlightedTiles();
		this.highlightedTiles = GameHelper.noHighlightedTiles();
		this.tiles = GameHelper.inititalizedTiles();
		this.lastMoveCoordinates = null;
		// let audio = new Audio();
		// this._audio.src = "../../../assets/audio/move.mp3";
  		// this._audio.load();
  		// audio.play();
	}

	private async _initializeSocket() {
		

		let params = await firstValueFrom(this.route.params) as any;
		if (!params?.id) {
			console.log('no id, returning');
			return;
		}

		
		this.socket.on("moveUpdate", (data: any) => {
			console.log('moveUpdate', data);
			this._receiveMoveUpdate(data);
		});

		this.socket.on("setPlayerStatus", (data: any) => {
			console.log("player status received", data);
			this._receivePlayerStatus(data);
		});

		this.socket.on("refresh", (data: any) => {
			this._initializeGameboard();
			this.currentTurn = Alliance.WHITE;
			this.threatTiles = GameHelper.noHighlightedTiles();
		});

		// this.socket.on('connect', () => console.log('connected'));
		console.log('emitting join game');
		this.socket.connect();
		this.socket.emit("joinGame", {id: params.id, name: this.playerName});
	}

	private _receivePlayerStatus(data: any) {
		this.playerColor = data.color ? Alliance.WHITE : Alliance.BLACK;
		this.isSpectator = data.isSpectator;
		this.spectatorNumber = data.spectatorNumber;
   }

	private _receiveMoveUpdate(data: any) {
		// console.log(data);
		if (!data) return;
		
		this.currentTurn = data.currentTurn ? Alliance.WHITE : Alliance.BLACK;
		this.lastMoveCoordinates = data.lastMoveCoordinates;

		if (data.tiles) {
			for (let i = 0; i < data.tiles.length; i++) {
				for (let j = 0; j < data.tiles[i].length; j++) {
					if (data.tiles[i][j].piece) {
						this.tiles[i][j].piece = GameHelper.objectToPiece(data.tiles[i][j].piece);
					} else {
						this.tiles[i][j].piece = null;
					}
				}
			}
			// console.log(this.tiles);
		}

		// this.threatTiles = this._threateningTiles(this.tiles, this.currentTurn);
		this.threatTiles = GameHelper.threatToKingTiles(this.tiles, this.currentTurn);

	  	this.whiteGraveyard = [];
	  	for (let capturedPiece of data.whiteGraveyard) {
			this.whiteGraveyard.push(GameHelper.objectToPiece(capturedPiece));
	  	}
	  	this.blackGraveyard = [];
	  	for (let capturedPiece of data.blackGraveyard) {
			this.blackGraveyard.push(GameHelper.objectToPiece(capturedPiece));
	  	}

		this._whiteReserve = [];
		for (let reservePiece of data.whiteReserve) {
		  this._whiteReserve.push(GameHelper.objectToPiece(reservePiece));
		}
	  	this._blackReserve = [];
	  	for (let reservePiece of data.blackReserve) {
			this._blackReserve.push(GameHelper.objectToPiece(reservePiece));
	  	}
		// let audio = new Audio();
		// audio.src = "../../../assets/audio/move.mp3";
		// audio.load();
		// audio.play();
		// this._audio.play();
  	}

	private _initializeGraveyards() {
		this.blackGraveyard = [];
		this.whiteGraveyard = [];
	}

	private _initializeReserves() {
		this._whiteReserve = GameHelper.getShuffledReserve(Alliance.WHITE);
		this._blackReserve = GameHelper.getShuffledReserve(Alliance.BLACK);
	}

	private isCheck() {
		return GameHelper.isCheck(this.tiles, this.currentTurn)
	}

	private _canKingsideCastle(alliance: Alliance) {
		if (this.isCheck()) return false;

		if (alliance === Alliance.WHITE) {
			// how to see if spaces are in check????
			if (
				!this._hasWhiteKingMoved 
				&& this.tiles[0][0].piece?.isMysterious
				&& !this.tiles[0][1].piece
				&& !this.tiles[0][2].piece
				&& !GameHelper.isTileThreatened(this.tiles[0][1], Alliance.WHITE, this.tiles)
				&& !GameHelper.isTileThreatened(this.tiles[0][2], Alliance.WHITE, this.tiles) 
			) {
				return true;
			} else {
				return false;
			}
		} else {
			if (
				!this._hasBlackKingMoved 
				&& this.tiles[7][0].piece?.isMysterious
				&& !this.tiles[7][1].piece
				&& !this.tiles[7][2].piece
				&& !GameHelper.isTileThreatened(this.tiles[7][1], Alliance.BLACK, this.tiles)
				&& !GameHelper.isTileThreatened(this.tiles[7][2], Alliance.BLACK, this.tiles) 
			) {
				return true;
			} else {
				return false;
			}
		}
	}

	private _canQueensideCastle(alliance: Alliance) {
		if (this.isCheck()) return false;

		if (alliance === Alliance.WHITE) {
			// how to see if spaces are in check????
			if (
				!this._hasWhiteKingMoved 
				&& this.tiles[0][7].piece?.isMysterious
				&& !this.tiles[0][4].piece
				&& !this.tiles[0][5].piece
				&& !this.tiles[0][6].piece
				&& !GameHelper.isTileThreatened(this.tiles[0][4], Alliance.WHITE, this.tiles)
				&& !GameHelper.isTileThreatened(this.tiles[0][5], Alliance.WHITE, this.tiles) 
				&& !GameHelper.isTileThreatened(this.tiles[0][6], Alliance.WHITE, this.tiles)
			) {
				return true;
			} else {
				return false;
			}
		} else {
			if (
				!this._hasBlackKingMoved 
				&& this.tiles[7][7].piece?.isMysterious
				&& !this.tiles[7][4].piece
				&& !this.tiles[7][5].piece
				&& !this.tiles[7][6].piece
				&& !GameHelper.isTileThreatened(this.tiles[7][4], Alliance.BLACK, this.tiles)
				&& !GameHelper.isTileThreatened(this.tiles[7][5], Alliance.BLACK, this.tiles) 
				&& !GameHelper.isTileThreatened(this.tiles[7][6], Alliance.BLACK, this.tiles) 
			) {
				return true;
			} else {
				return false;
			}
		}
	}

	public getBotMove() {
		let bot = new Bot;
		let bestMove = bot.getBestMove(this.tiles, this.currentTurn, 1, this.whiteGraveyard, this.blackGraveyard);
		let origin = bestMove.origin;
		let target = bestMove.target;
		// console.log('best move', bestMove);
		// console.log('best move', bestMove, this.tiles[origin.x][origin.y], this.tiles[target.x][target.y]);

		let event = {
			item: { //origin
				data: this.tiles[origin.x][origin.y]
			},
			container: { //target
				data: this.tiles[target.x][target.y]
			}
		} as CdkDragDrop<any>

		this.drop(event);
	}

}

/**
 *
 * enhancement:
 * when opening the page, display a question asking if they want to play local or online.
 *
 */

/**
 * Undo Button:
 * have an array of game state objects on the server. pop from the array when undo event is received.
 * 
 * Do this on server:
 * Implement moveHistory, an array of move objects, that have player, tiles, white/black reserve/graveyard properties.
 * push to moveHistory on successful move (whatever the origin state was).
 * Implement undo button that goes back one move.
 *
 *
 * Do this on client:
 * when undo button is pressed, emit an undo socket event.
 *
 */

/**
 * Implement 'Start Over' button.
 * When clicked, it reinitializes tiles.
 * Send moveUpdate to the server
 *
 * Enhancement: Prompt the other player when the button is pressed. If other player says yes, reinitialize. If no,
 * alert the player that clicked the button.
 */



/**
 * Have a component for players to set their name in a text field. When button is clicked to save, update other
 * players. Supply this as an input to the chat component for message data. In the template,
 * have the other player's name field be readonly. Spectators have a field to set their name, which defaults to spectator
 * for the chat.
 */

/**
 * Display a message for pawn promoted. send the message with moveUpdate data
 */

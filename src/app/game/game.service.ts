import { BehaviorSubject } from "rxjs";
import { Alliance } from "./game.types";
import { GameHelper } from "./game.helper";

export class GameService {

    // // game state 
    // public tiles$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    // public highlightedTiles$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    // public currentTurn$: BehaviorSubject<Alliance> = new BehaviorSubject<Alliance>(Alliance.WHITE);
    // public playerColor$: BehaviorSubject<Alliance> = new BehaviorSubject<Alliance>(Alliance.BLACK);
    // public whiteReserve$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    // public blackReserve$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    // public whiteGraveyard$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    // public blackGraveyard$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    // public lastMoveCoordinates$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    // public isSpectator$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // public spectatorNumber$: BehaviorSubject<number> = new BehaviorSubject<any>(-1);

    // public get tiles() { return this.tiles$.value; }
    // public get currentTurn() { return this.currentTurn$.value; }
    // public get whiteReserve() { return this.whiteReserve$.value; }
    // public get blackReserve() { return this.blackReserve$.value; }
    // public get whiteGraveyard() { return this.whiteGraveyard$.value; }
    // public get blackGraveyard() { return this.blackGraveyard$.value; }
    // public get lastMoveCoordinates() { return this.lastMoveCoordinates$.value; }
    // public get isSpectator() { return this.isSpectator$.value; }
    // public get spectatorNumber() { return this.spectatorNumber$.value; }

    // public set tiles(value) { this.tiles$.next(value); }
    // public set currentTurn(value) { this.currentTurn$.next(value); }
    // public set whiteReserve(value) { this.whiteReserve$.next(value); }
    // public set blackReserve(value) { this.blackReserve$.next(value); }
    // public set whiteGraveyard(value) { this.whiteGraveyard$.next(value); }
    // public set blackGraveyard(value) { this.blackGraveyard$.next(value); }
    // public set lastMoveCoordinates(value) { this.lastMoveCoordinates$.next(value); }
    // public set isSpectator(value) { this.isSpectator$.next(value); }
    // public set spectatorNumber(value) { this.spectatorNumber$.next(value); }


    // public get gameState() {
    //     return {
    //         tiles: this.tiles,
    //         currentTurn: this.currentTurn,
    //         whiteReserve: this.whiteReserve,
    //         blackReserve: this.blackReserve,
    //         whiteGraveyard: this.whiteGraveyard,
    //         blackGraveyard: this.blackGraveyard,
    //         lastMoveCoordinates: this.lastMoveCoordinates,
    //         isSpectator: this.isSpectator,
    //         spectatorNumber: this.spectatorNumber,
    //     };
    // }


    // public initialize() {
	// 	this._initializeReserves();
	// 	this._initializeGraveyards();
	// 	this._inititalizeTiles();
	// 	// let audio = new Audio();
	// 	// this._audio.src = "../../../assets/audio/move.mp3";
  	// 	// this._audio.load();
  	// 	// audio.play();
	// }

    // private _initializeReserves() {
	// 	this.whiteReserve = GameHelper.getShuffledReserve(Alliance.WHITE);
	// 	this.blackReserve = GameHelper.getShuffledReserve(Alliance.BLACK);
	// }

    // private _initializeGraveyards() {
	// 	this.blackGraveyard = [];
	// 	this.whiteGraveyard = [];
	// }

    // private _emptyGameboard() {
	// 	let tiles: any = [];
	// 	for (let i = 0; i < 8; i++) {
	// 		tiles[i] = [];
	// 		for (let j = 0; j < 8; j++) {
	// 		  	tiles[i][j] = {
	// 				'color': (i + j) % 2 ? '#5F9EA0' : 'white',
	// 				'highlightedColor': (i + j) % 2 ? '#2F6E70' : 'gray',
	// 				'x': i,
	// 				'y': j
	// 		  	}
	// 		}
	//   	}
	// 	return tiles;
	// }

    // private _inititalizeTiles() {
	// 	this.tiles = this._emptyGameboard();
	// 	// this._unhighlightedTiles = this._noHighlightedTiles(); // will we need this? it was for resetting
	// 	// this.highlightedTiles = this._noHighlightedTiles(); 
    //     this.highlightedTiles$.next(GameHelper.noHighlightedTiles());

	// 	this.tiles[0][0].piece = new Rook(Alliance.WHITE);
	// 	this.tiles[0][1].piece = new Knight(Alliance.WHITE);
	// 	this.tiles[0][2].piece = new Bishop(Alliance.WHITE);
	// 	this.tiles[0][3].piece = new King(Alliance.WHITE);
	// 	this.tiles[0][4].piece = new Queen(Alliance.WHITE);
	// 	this.tiles[0][5].piece = new Bishop(Alliance.WHITE);
	// 	this.tiles[0][6].piece = new Knight(Alliance.WHITE);
	// 	this.tiles[0][7].piece = new Rook(Alliance.WHITE);
	// 	this.tiles[1][0].piece = new Pawn(Alliance.WHITE);
	// 	this.tiles[1][1].piece = new Pawn(Alliance.WHITE);
	// 	this.tiles[1][2].piece = new Pawn(Alliance.WHITE);
	// 	this.tiles[1][3].piece = new Pawn(Alliance.WHITE);
	// 	this.tiles[1][4].piece = new Pawn(Alliance.WHITE);
	// 	this.tiles[1][5].piece = new Pawn(Alliance.WHITE);
	// 	this.tiles[1][6].piece = new Pawn(Alliance.WHITE);
	// 	this.tiles[1][7].piece = new Pawn(Alliance.WHITE);

	// 	this.tiles[7][0].piece = new Rook(Alliance.BLACK);
	// 	this.tiles[7][1].piece = new Knight(Alliance.BLACK);
	// 	this.tiles[7][2].piece = new Bishop(Alliance.BLACK);
	// 	this.tiles[7][3].piece = new King(Alliance.BLACK);
	// 	this.tiles[7][4].piece = new Queen(Alliance.BLACK);
	// 	this.tiles[7][5].piece = new Bishop(Alliance.BLACK);
	// 	this.tiles[7][6].piece = new Knight(Alliance.BLACK);
	// 	this.tiles[7][7].piece = new Rook(Alliance.BLACK);
	// 	this.tiles[6][0].piece = new Pawn(Alliance.BLACK);
	// 	this.tiles[6][1].piece = new Pawn(Alliance.BLACK);
	// 	this.tiles[6][2].piece = new Pawn(Alliance.BLACK);
	// 	this.tiles[6][3].piece = new Pawn(Alliance.BLACK);
	// 	this.tiles[6][4].piece = new Pawn(Alliance.BLACK);
	// 	this.tiles[6][5].piece = new Pawn(Alliance.BLACK);
	// 	this.tiles[6][6].piece = new Pawn(Alliance.BLACK);
	// 	this.tiles[6][7].piece = new Pawn(Alliance.BLACK);


	// 	this.tiles[0][0].piece.makeMysterious();
	// 	this.tiles[0][1].piece.makeMysterious();
	// 	this.tiles[0][2].piece.makeMysterious();
	// 	this.tiles[0][4].piece.makeMysterious();
	// 	this.tiles[0][5].piece.makeMysterious();
	// 	this.tiles[0][6].piece.makeMysterious();
	// 	this.tiles[0][7].piece.makeMysterious();
	// 	this.tiles[1][0].piece.makeMysterious();
	// 	this.tiles[1][1].piece.makeMysterious();
	// 	this.tiles[1][2].piece.makeMysterious();
	// 	this.tiles[1][3].piece.makeMysterious();
	// 	this.tiles[1][4].piece.makeMysterious();
	// 	this.tiles[1][5].piece.makeMysterious();
	// 	this.tiles[1][6].piece.makeMysterious();
	// 	this.tiles[1][7].piece.makeMysterious();
	// 	this.tiles[7][0].piece.makeMysterious();
	// 	this.tiles[7][1].piece.makeMysterious();
	// 	this.tiles[7][2].piece.makeMysterious();
	// 	this.tiles[7][4].piece.makeMysterious();
	// 	this.tiles[7][5].piece.makeMysterious();
	// 	this.tiles[7][6].piece.makeMysterious();
	// 	this.tiles[7][7].piece.makeMysterious();
	// 	this.tiles[6][0].piece.makeMysterious();
	// 	this.tiles[6][1].piece.makeMysterious();
	// 	this.tiles[6][2].piece.makeMysterious();
	// 	this.tiles[6][3].piece.makeMysterious();
	// 	this.tiles[6][4].piece.makeMysterious();
	// 	this.tiles[6][5].piece.makeMysterious();
	// 	this.tiles[6][6].piece.makeMysterious();
	// 	this.tiles[6][7].piece.makeMysterious();
	// }
}
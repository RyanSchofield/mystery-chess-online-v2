import { Alliance } from "../alliance.enum";

export abstract class Piece {

    public abstract typeDisplay: string; // piece type identifier
    public abstract image: string; //image path
    public alliance: Alliance;
    public isMysterious: boolean = false;
    public isRevealed: boolean = false;

    constructor(alliance: Alliance) {
		this.alliance = alliance;
	}

    public abstract getValidMoveTiles(origin: any, tiles: any[]): boolean[][];

    public makeMysterious() {
        this.isMysterious = true;
    }

    public validateMove(origin: any, target: any, tiles: any[][]): boolean {
        return this.getValidMoveTiles(origin, tiles)[target.x][target.y];
    }

    protected _tileHasAlly(tile: any, boardTiles: any[][]) : boolean {
        // console.log('tile has ally?', tile, boardTiles);
        if (boardTiles === undefined) {
            console.log('board tiles undefiend')
        } else if (tile === undefined) {
            console.log('tile undefined')
        } else if (boardTiles[tile.x] === undefined) {
            console.log('x undefined', boardTiles, tile)
        }

        if (boardTiles[tile.x][tile.y].piece?.alliance === this.alliance) {
            return true;
        }

        return false;
    }

    protected _tileHasEnemy(tile: any, boardTiles: any[][]) : boolean {
        if (!boardTiles[tile.x][tile.y].piece) return false;

        if (boardTiles === undefined) {
            console.log('board tiles undefiend')
        } else if (tile === undefined) {
            console.log('tile undefined')
        } else if (boardTiles[tile.x] === undefined) {
            console.log('x undefined', boardTiles, tile)
        }

        if (boardTiles[tile.x][tile.y].piece.alliance !== this.alliance) {
            return true;
        }


        return false;
    }

}
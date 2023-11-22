import { Alliance } from '../../alliance.enum';
import { Piece } from '../piece.model';

export class King extends Piece {
  
  public image: string;
  public typeDisplay = 'king';

	constructor(alliance: Alliance) {
		super(alliance)
    this.image = this.alliance === Alliance.WHITE 
      ? 'assets/white_king.png' 
      : 'assets/black_king.png';
	}

  public getValidMoveTiles(origin: any, tiles: any[]): boolean[][] {
    let validMoves: any[][] = [];

	  for (let i = 0; i < tiles.length; i++) {
	    validMoves[i] = [];
    }
    
    let topRow = origin.y + 1 > 7;
    let bottomRow = origin.y - 1 < 0;
    let leftCol = origin.x - 1 < 0;
    let rightCol = origin.x + 1 > 7; 
    
    if (
      !topRow 
      && tiles[origin.x][ origin.y + 1].piece?.alliance != this.alliance
    ) {
	    validMoves[origin.x][origin.y + 1] = true;
    
    }

    if (
      !bottomRow 
      && tiles[origin.x][origin.y - 1].piece?.alliance != this.alliance
    ) {
	    validMoves[origin.x][origin.y - 1] = true;
    }

    if (
      !leftCol 
      && tiles[origin.x - 1][origin.y].piece?.alliance != this.alliance
    ) {
	    validMoves[origin.x - 1][origin.y] = true;
    }

    if (
      !rightCol 
      && tiles[origin.x + 1][origin.y].piece?.alliance != this.alliance
    ) {
	    validMoves[origin.x + 1][origin.y] = true;
    }

    if (
      !topRow && !leftCol 
      && tiles[origin.x - 1][origin.y + 1].piece?.alliance != this.alliance
    ) {
	    validMoves[origin.x - 1][origin.y + 1] = true;

    }

    if (
      !topRow 
      && !rightCol 
      && tiles[origin.x + 1][origin.y + 1].piece?.alliance != this.alliance
    ) {
	    validMoves[origin.x + 1][origin.y + 1] = true;
    }

    if (
      !bottomRow 
      && !leftCol 
      && tiles[origin.x - 1][origin.y - 1].piece?.alliance != this.alliance
    ) {
    	validMoves[origin.x - 1][origin.y - 1] = true;
    }

    if (
      !bottomRow 
      && !rightCol 
      && tiles[origin.x + 1][origin.y - 1 ].piece?.alliance != this.alliance
    ) {
      validMoves[origin.x + 1][origin.y - 1] = true; 
    }

    return validMoves;
  }

  public override makeMysterious() {
    return;
  }
}

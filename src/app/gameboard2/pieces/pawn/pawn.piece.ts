import { Alliance } from '../../alliance.enum';
import { Piece } from '../piece.model';

export class Pawn extends Piece {
  
  /**
   * @todo does this need to be public? for en passant maybe?
   */
  public firstMove: boolean = true; 

  public typeDisplay = 'pawn';
  public image: string;

	constructor(alliance: Alliance) {
		super(alliance);
    this.image = this.alliance === Alliance.WHITE 
      ? 'assets/white-pawn.png' 
      : 'assets/black-pawn.png';
	}

  public getValidMoveTiles(origin: any, tiles: any[]): any[][] {
    let validMoves: any[][] = [];

	  for (let i = 0; i < tiles.length; i++) {
	    validMoves[i] = [];
    }
    
    if (this.alliance === Alliance.WHITE) {
      if (
        origin.x + 1 < 8 
        && !this._tileHasAlly(tiles[origin.x + 1][origin.y], tiles) 
        && !this._tileHasEnemy(tiles[origin.x + 1][origin.y], tiles)
      ) {
        validMoves[origin.x + 1][origin.y] = true;
        if (
          origin.x + 2 < 8 
          && !this._tileHasAlly(tiles[origin.x + 2][origin.y], tiles)  
          && !this._tileHasEnemy(tiles[origin.x + 2][origin.y], tiles) 
          && this.isMysterious
        ) {
          validMoves[origin.x + 2][origin.y] = true;
        }
      }

      if (
        origin.x + 1 < 8 
        && origin.y - 1 > -1 
        && this._tileHasEnemy(tiles[origin.x + 1][origin.y - 1], tiles)
      ) {
        validMoves[origin.x + 1][origin.y - 1] = true;
      }

      if (
        origin.x + 1 < 8 
        && origin.y + 1 < 8 
        && this._tileHasEnemy(tiles[origin.x + 1][origin.y + 1], tiles)
      ) {
        validMoves[origin.x + 1][origin.y + 1] = true;
      }
    }

    else if (this.alliance === Alliance.BLACK) {
      if (
        origin.x - 1 > -1 
        && !this._tileHasAlly(tiles[origin.x - 1][origin.y], tiles) 
        && !this._tileHasEnemy(tiles[origin.x - 1][origin.y], tiles)
      ) {
        validMoves[origin.x - 1][origin.y] = true;
        if (
          origin.x - 2 > -1 
          && !this._tileHasAlly(tiles[origin.x - 2][origin.y], tiles) 
          && !this._tileHasEnemy(tiles[origin.x - 2][origin.y], tiles) 
          && this.isMysterious
        ) {
          validMoves[origin.x - 2][origin.y] = true;
        }
      }

      if (
        origin.x - 1 > -1 
        && origin.y - 1 > -1 
        && this._tileHasEnemy(tiles[origin.x - 1][origin.y - 1], tiles)
      ) {
        validMoves[origin.x - 1][origin.y - 1] = true;
      }

      if (
        origin.x - 1 > -1 
        && origin.y + 1 < 8 
        && this._tileHasEnemy(tiles[origin.x - 1][origin.y + 1], tiles)
      ) {
        validMoves[origin.x - 1][origin.y + 1] = true;
      }
    }

    return validMoves;
  }
}

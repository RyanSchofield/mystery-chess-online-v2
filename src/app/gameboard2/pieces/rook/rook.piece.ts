import { Alliance } from '../../alliance.enum';
import { Piece } from '../piece.model';

export class Rook extends Piece {
  
  public image: string;
  public typeDisplay = 'rook';

	constructor(alliance: Alliance) {
		super(alliance);
    this.image = this.alliance === Alliance.WHITE ? 'assets/white-rook.png' : 'assets/black-rook.png';
	}

  public getValidMoveTiles(origin: any, tiles: any[]): any[][] {
    let validMoves: any[][] = [];

	  for (let i = 0; i < tiles.length; i++) {
	    validMoves[i] = [];
    }

    let currentX = origin.x;
    let currentY = origin.y;
    
    while (currentX < 7) {
      currentX = currentX + 1;
      if (this._tileHasAlly(tiles[currentX][origin.y], tiles)) {
        break;
      } 

      if (this._tileHasEnemy(tiles[currentX][origin.y], tiles)) {
        validMoves[currentX][origin.y] = true;
        break;
      }

      validMoves[currentX][origin.y] = true;
    }

    currentX = origin.x;

    while (currentX > 0) {
      currentX = currentX - 1;
      if (this._tileHasAlly(tiles[currentX][origin.y], tiles)) {
        break;
      } 

      if (this._tileHasEnemy(tiles[currentX][origin.y], tiles)) {
        validMoves[currentX][origin.y] = true;
        break;
      } 


      validMoves[currentX][origin.y] = true;
    }

    while (currentY < 7) {
      currentY = currentY + 1;
      if (this._tileHasAlly(tiles[origin.x][currentY], tiles)) {
        break;
      } 

      if (this._tileHasEnemy(tiles[origin.x][currentY], tiles)) {
        validMoves[origin.x][currentY] = true;
        break;
      }

      validMoves[origin.x][currentY] = true;
    }

    currentY = origin.y;

    while (currentY > 0) {
      currentY = currentY - 1;
      if (this._tileHasAlly(tiles[origin.x][currentY], tiles)) {
        break;
      } 

      if (this._tileHasEnemy(tiles[origin.x][currentY], tiles)) {
        validMoves[origin.x][currentY] = true;
        break;
      } 

      validMoves[origin.x][currentY] = true;
    }

    return validMoves;
  }

}

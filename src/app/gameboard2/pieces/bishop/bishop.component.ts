import { Alliance } from '../../alliance.enum';
import { Piece } from '../piece.model';

export class Bishop extends Piece {
  
  public image: string;
  public typeDisplay = 'bishop';
 
	constructor(alliance: Alliance) {
		super(alliance);
    this.image = this.alliance === Alliance.WHITE 
      ? 'assets/white-bishop.png' 
      : 'assets/black-bishop.png';
	}

  public getValidMoveTiles(origin: any, tiles: any[]): any[][] {
    let validMoves: any[][] = [];

	  for (let i = 0; i < tiles.length; i++) {
	    validMoves[i] = [];
    }

    let currentX = origin.x;
    let currentY = origin.y;

    while (currentX < 7 && currentY < 7) {
      currentX = currentX + 1;
      currentY = currentY + 1;
      if (this._tileHasAlly(tiles[currentX][currentY], tiles)) {
        break;
      } 

      if (this._tileHasEnemy(tiles[currentX][currentY], tiles)) {
        validMoves[currentX][currentY] = true;
        break;
      }

      validMoves[currentX][currentY] = true;
    }

    currentX = origin.x;
    currentY = origin.y;

    while (currentX > 0 && currentY < 7) {
      currentX = currentX - 1;
      currentY = currentY + 1;
      if (this._tileHasAlly(tiles[currentX][currentY], tiles)) {
        break;
      } 

      if (this._tileHasEnemy(tiles[currentX][currentY], tiles)) {
        validMoves[currentX][currentY] = true;
        break;
      }

      validMoves[currentX][currentY] = true;
    }
    
    currentX = origin.x;
    currentY = origin.y;

    while (currentX > 0 && currentY > 0) {
      currentX = currentX - 1;
      currentY = currentY - 1;
      if (this._tileHasAlly(tiles[currentX][currentY], tiles)) {
        break;
      } 

      if (this._tileHasEnemy(tiles[currentX][currentY], tiles)) {
        validMoves[currentX][currentY] = true;
        break;
      }

      validMoves[currentX][currentY] = true;
    }

    currentX = origin.x;
    currentY = origin.y;

    while (currentX < 7 && currentY > 0) {
      currentX = currentX + 1;
      currentY = currentY - 1;
      if (this._tileHasAlly(tiles[currentX][currentY], tiles)) {
        break;
      } 

      if (this._tileHasEnemy(tiles[currentX][currentY], tiles)) {
        validMoves[currentX][currentY] = true;
        break;
      }

      validMoves[currentX][currentY] = true;
    }
   
    return validMoves;
  }

}

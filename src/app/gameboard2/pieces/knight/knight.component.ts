import { Alliance } from '../../alliance.enum';
import { Piece } from '../piece.model';

export class Knight extends Piece {
  
  public image: string;
  public typeDisplay = 'knight';

	constructor(alliance: Alliance) {
		super(alliance);
    this.image = this.alliance === Alliance.WHITE ? 'assets/white-knight.png' : 'assets/black-knight.png';
	}

  public getValidMoveTiles(origin: any, tiles: any[]): any[][] {
    let validMoves: any[][] = [];

	  for (let i = 0; i < tiles.length; i++) {
	    validMoves[i] = [];
    }

    //up right 2
    if (origin.x + 1 < 8 && origin.y + 2 < 8) {
      if (!this._tileHasAlly(tiles[origin.x + 1][origin.y + 2], tiles)) {
        // console.log('up right, ');
        validMoves[origin.x + 1][origin.y + 2] = true;
      } 
    }

    //up left 3
    if (origin.x - 1 > -1 && origin.y + 2 < 8) {
      if (!this._tileHasAlly(tiles[origin.x - 1][origin.y + 2], tiles)) {
        // console.log('up left ');
        validMoves[origin.x - 1][origin.y + 2] = true;
      } 
    }

    //left up 4
    if (origin.x - 2 > -1 && origin.y + 1 < 8) {
      if (!this._tileHasAlly(tiles[origin.x - 2][origin.y + 1], tiles)) {
        // console.log('left up ');
        validMoves[origin.x - 2][origin.y + 1] = true;
      } 
    }

    //left down 8
    if (origin.x - 2 > -1 && origin.y - 1 > -1) {
      if (!this._tileHasAlly(tiles[origin.x - 2][origin.y - 1], tiles)) {
        // console.log(' left down ');
        validMoves[origin.x - 2][origin.y - 1] = true;
      } 
    }

    //right up 1
    if (origin.x + 2 < 8 && origin.y + 1 < 8) {
      if (!this._tileHasAlly(tiles[origin.x + 2][origin.y + 1], tiles)) {
        // console.log('right up ');
        validMoves[origin.x + 2][origin.y + 1] = true;
      } 
    }

    //right down 5
    if (origin.x + 2 < 8 && origin.y - 1 > - 1) {
      if (!this._tileHasAlly(tiles[origin.x + 2][origin.y - 1], tiles)) {
        // console.log('right down ');
        validMoves[origin.x + 2][origin.y - 1] = true;
      } 
    }

    //down right 6
    if (origin.x + 1 < 8 && origin.y - 2 > -1) {
      if (!this._tileHasAlly(tiles[origin.x + 1][origin.y - 2], tiles)) {
        // console.log('down right ');
        validMoves[origin.x + 1][origin.y - 2] = true;
      } 
    }

    //down left 7 
    if (origin.x - 1 > -1 && origin.y - 2 > -1) {
      if (!this._tileHasAlly(tiles[origin.x - 1][origin.y - 2], tiles)) {
        // console.log('down left');
        validMoves[origin.x - 1][origin.y - 2] = true;
      } 
    }

    return validMoves;
  }
  
}

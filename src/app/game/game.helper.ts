import { Alliance } from "../gameboard2/alliance.enum";
import { Rook } from "../gameboard2/pieces/rook/rook.piece";
import { Pawn } from "../gameboard2/pieces/pawn/pawn.piece";
import { Queen } from "../gameboard2/pieces/queen/queen.piece";
import { King } from "../gameboard2/pieces/king/king.component";
import { Bishop } from "../gameboard2/pieces/bishop/bishop.component";
import { Knight } from "../gameboard2/pieces/knight/knight.component";
import { Bot } from "../bot/bot.service";

export class GameHelper {


    //FIXME, make sure this returns true for when the CURRENT TURN PLAYER is in check
    public static isCheck(tiles: any, currentTurn: Alliance) {
		let threatTiles = this.threatToKingTiles(
            tiles, 
            currentTurn
        );

		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (threatTiles[i][j]) {
					return true;
				}
			}
		}
		return false;
	}

    public static isCheckmated(tiles: any, currentTurn: Alliance) {
        let bot = new Bot;
        let allMoves = bot.getAllMoves(tiles, currentTurn, [], []); // fixme?

        if (!this.isCheck(tiles, currentTurn)) return false;

        for (let move of allMoves) {
            if (!this.isCheck(move.tiles, currentTurn)) return false;
        }

        return true;
    }

	public static threatToKingTiles(tiles: any[][], alliance: Alliance) {
		let kingCoordinates = this._findKing(tiles, alliance);
		let returnTiles = this.noHighlightedTiles();

		if (!kingCoordinates) return returnTiles; // why

		for (let i = 0; i < tiles.length; i++) {
			for (let j = 0; j < tiles[i].length; j++) {
                if (tiles[i][j].piece && tiles[i][j].piece.typeDisplay === 'guess') continue;
                if (tiles[i][j].piece && !tiles[i][j].piece.getValidMoveTiles) console.log('f-ed up piece', tiles[i][j].piece);
				if (
                    tiles[i][j].piece 
					&& tiles[i][j].piece.alliance !== alliance 
					&& tiles[i][j]
                        .piece
                        ?.getValidMoveTiles(
                            {x : i, y: j}, 
                            tiles
                        )[kingCoordinates.x][kingCoordinates.y]
                ) {
					returnTiles[i][j] = true;
					// console.log('threat at', i, j);
				}
			}
		}

		return returnTiles;
	}

    public static getShuffledReserve(alliance: Alliance) {
        let unshuffledReserve = [
			new Rook(alliance),
			new Knight(alliance),
			new Bishop(alliance),
			new Queen(alliance),
			new Bishop(alliance),
			new Knight(alliance),
			new Rook(alliance),
			new Pawn(alliance),
			new Pawn(alliance),
			new Pawn(alliance),
			new Pawn(alliance),
			new Pawn(alliance),
			new Pawn(alliance),
			new Pawn(alliance),
			new Pawn(alliance),
		];

        return this._shuffledArray(unshuffledReserve);
    }

    public static copyTiles(tiles: any) {
        
        let originalTiles = JSON.parse(JSON.stringify(tiles));
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (originalTiles[i][j].piece) {
                    originalTiles[i][j].piece = GameHelper.objectToPiece(originalTiles[i][j].piece);
                }
            }
        }

        return originalTiles;
    }

    public static objectToPiece(object: any) {
		let alliance = object.alliance ? Alliance.WHITE : Alliance.BLACK;
		let piece = object;

		switch(object.typeDisplay) {
			case 'pawn':
				piece = new Pawn(alliance);
				break;
			case 'rook':
				piece = new Rook(alliance);
				break;
			case 'knight':
				piece = new Knight(alliance);
				break;
			case 'bishop':
			piece = new Bishop(alliance);
			break;
			case 'queen':
			piece = new Queen(alliance);
			break;
			case 'king':
				piece = new King(alliance);
				break;
		}

        try {
            if (object.isMysterious && piece) {
                  piece.makeMysterious();
            }
        } catch (e) {
            console.log(object);
            throw e;
        }

	   return piece;
	}

    // public static 

    // rename to no validmoves?
    public static noHighlightedTiles() {
		let tiles: any = [];
		for (let i = 0; i < 8; i++) {
				tiles[i] = [];
 		 		for (let j = 0; j < 8; j++) {
	 				tiles[i][j] = false;
		   	}
		}

		return tiles;
	}

    public static sameCoordinates(origin: any, target: any) {
		return origin.x === target.x && origin.y === target.y;
	}

    public static tileHasEnemy(tile: any, boardTiles: any[][], movedPieceAlliance: boolean) : boolean {
		if (!boardTiles[tile.x][tile.y].piece) return false;
		if (boardTiles[tile.x][tile.y].piece.alliance !== movedPieceAlliance) return true;

		return false;
	}

    public static isTileThreatened(tile: any, alliance: Alliance, tiles: any) {
		// iterate through tiles to find the king position
		// iterate through tiles again to find all pieces attacking the king position.
		// if (!alliance) {console.log('wtf???');return this._noHighlightedTiles();

		for (let i = 0; i < tiles.length; i++) {
			for (let j = 0; j < tiles[i].length; j++) {
				// if (tiles[i][j].piece) console.log('piece at ', i, j);
				if (tiles[i][j].piece 
					&& tiles[i][j].piece.alliance !== alliance 
					&& tiles[i][j].piece.getValidMoveTiles(
						{x : i, y: j}, 
						tiles
					)[tile.x][tile.y]) 
				{
					console.log('threat at', i, j);
					return true;
				}
			}
		}

		return false;
	}

    public static inititalizedTiles() {
		let tiles = this.emptyGameboard();
		

		tiles[0][0].piece = new Rook(Alliance.WHITE);
		tiles[0][1].piece = new Knight(Alliance.WHITE);
		tiles[0][2].piece = new Bishop(Alliance.WHITE);
		tiles[0][3].piece = new King(Alliance.WHITE);
		tiles[0][4].piece = new Queen(Alliance.WHITE);
		tiles[0][5].piece = new Bishop(Alliance.WHITE);
		tiles[0][6].piece = new Knight(Alliance.WHITE);
		tiles[0][7].piece = new Rook(Alliance.WHITE);
		tiles[1][0].piece = new Pawn(Alliance.WHITE);
		tiles[1][1].piece = new Pawn(Alliance.WHITE);
		tiles[1][2].piece = new Pawn(Alliance.WHITE);
		tiles[1][3].piece = new Pawn(Alliance.WHITE);
		tiles[1][4].piece = new Pawn(Alliance.WHITE);
		tiles[1][5].piece = new Pawn(Alliance.WHITE);
		tiles[1][6].piece = new Pawn(Alliance.WHITE);
		tiles[1][7].piece = new Pawn(Alliance.WHITE);

		tiles[7][0].piece = new Rook(Alliance.BLACK);
		tiles[7][1].piece = new Knight(Alliance.BLACK);
		tiles[7][2].piece = new Bishop(Alliance.BLACK);
		tiles[7][3].piece = new King(Alliance.BLACK);
		tiles[7][4].piece = new Queen(Alliance.BLACK);
		tiles[7][5].piece = new Bishop(Alliance.BLACK);
		tiles[7][6].piece = new Knight(Alliance.BLACK);
		tiles[7][7].piece = new Rook(Alliance.BLACK);
		tiles[6][0].piece = new Pawn(Alliance.BLACK);
		tiles[6][1].piece = new Pawn(Alliance.BLACK);
		tiles[6][2].piece = new Pawn(Alliance.BLACK);
		tiles[6][3].piece = new Pawn(Alliance.BLACK);
		tiles[6][4].piece = new Pawn(Alliance.BLACK);
		tiles[6][5].piece = new Pawn(Alliance.BLACK);
		tiles[6][6].piece = new Pawn(Alliance.BLACK);
		tiles[6][7].piece = new Pawn(Alliance.BLACK);


		tiles[0][0].piece.makeMysterious();
		tiles[0][1].piece.makeMysterious();
		tiles[0][2].piece.makeMysterious();
		tiles[0][4].piece.makeMysterious();
		tiles[0][5].piece.makeMysterious();
		tiles[0][6].piece.makeMysterious();
		tiles[0][7].piece.makeMysterious();
		tiles[1][0].piece.makeMysterious();
		tiles[1][1].piece.makeMysterious();
		tiles[1][2].piece.makeMysterious();
		tiles[1][3].piece.makeMysterious();
		tiles[1][4].piece.makeMysterious();
		tiles[1][5].piece.makeMysterious();
		tiles[1][6].piece.makeMysterious();
		tiles[1][7].piece.makeMysterious();
		tiles[7][0].piece.makeMysterious();
		tiles[7][1].piece.makeMysterious();
		tiles[7][2].piece.makeMysterious();
		tiles[7][4].piece.makeMysterious();
		tiles[7][5].piece.makeMysterious();
		tiles[7][6].piece.makeMysterious();
		tiles[7][7].piece.makeMysterious();
		tiles[6][0].piece.makeMysterious();
		tiles[6][1].piece.makeMysterious();
		tiles[6][2].piece.makeMysterious();
		tiles[6][3].piece.makeMysterious();
		tiles[6][4].piece.makeMysterious();
		tiles[6][5].piece.makeMysterious();
		tiles[6][6].piece.makeMysterious();
		tiles[6][7].piece.makeMysterious();

        return tiles;
	}

    public static emptyGameboard(): any[][] {
        let tiles: any = [];
		for (let i = 0; i < 8; i++) {
			tiles[i] = [];
			for (let j = 0; j < 8; j++) {
			  	tiles[i][j] = {
					'color': (i + j) % 2 ? '#5F9EA0' : 'white',
					'highlightedColor': (i + j) % 2 ? '#2F6E70' : 'gray',
					'x': i,
					'y': j
			  	}
			}
	  	}
		return tiles;
    }


	private static _findKing(tiles: any[][], alliance: Alliance) {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (
                    tiles[i][j]?.piece?.typeDisplay === 'king' 
                    && tiles[i][j]?.piece?.alliance === alliance
                ) {
					return {
						x: i,
						y: j
					};
				}
			}
		}
        
		return null;
	}


    
    

    // make public for bot to use?
    public static _shuffledArray(array: any[]) {
		return array
  			.map(value => ({ value, sort: Math.random() }))
  			.sort((a, b) => a.sort - b.sort)
  			.map(({ value }) => value);
	}
}
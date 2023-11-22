import { GameHelper } from "../game/game.helper";
import { Alliance } from "../gameboard2/alliance.enum";
import { Bishop } from "../gameboard2/pieces/bishop/bishop.component";
import { Knight } from "../gameboard2/pieces/knight/knight.component";
import { Pawn } from "../gameboard2/pieces/pawn/pawn.piece";
import { Queen } from "../gameboard2/pieces/queen/queen.piece";
import { Rook } from "../gameboard2/pieces/rook/rook.piece";

export class Bot {
    // minimax algorithm. use a genetic algorithm to improve the evaluation function, with
    // large and small weights applied to different method return values and  their local variables.

    // two issues: needs to go deeper in tree, needs to account for pieces in graveyards

    // best possible score for current turn is alliance

    private numberEvalFunctionsRan = 0;
    private numberAllMovesFunctionsRan = 0;

    // private r_getMoveScore(
    //     tiles: any, 
    //     currentTurn: Alliance, 
    //     myAlliance: Alliance, 
    //     level: number, 
    //     alpha: number = -Infinity, // alpha keeps track of the highest we've seen
    //     beta: number = Infinity // beta keeps track of the lowest we've seen
    // ): number {
    //     if (level == 0) {
    //         return this.evaluateTiles(tiles);
    //     }

    //     // console.log('IS THIS ON?')

    //     let currentTilesEvaluation = this.evaluateTiles(tiles);

    //     // if (myAlliance == Alliance.BLACK && alpha !== -Infinity && currentTilesEvaluation > alpha) { 
    //     //     // dont even pursue this branch, as it is higher than the maximum we have seen elsewhere
    //     //     // console.log('skipping because current position is worse')
    //     //     return currentTilesEvaluation;
    //     // } else if (beta !== Infinity && currentTilesEvaluation < beta) {
    //     //     // console.log('skipping because current position is worse')
    //     //     return currentTilesEvaluation;
    //     // }



    //     // maybe do this differently. get all my moves. get all their moves. iterate through and get the max/min
    //     // no... dont do the above. this will be called in a loop in get best moves

    //     let nextMoves = this.getAllMoves(tiles, currentTurn);

    //     let bestScore = null;
    //     let newAlpha = alpha;
    //     let newBeta = beta;

    //     let nextTurnAlliance = currentTurn == Alliance.WHITE ? Alliance.BLACK : Alliance.WHITE;

    //     //hmmm maybe we should do this differently. let best seen

    //     for (let nextMove of nextMoves) {
    //         // let nextScore =
    //         // let nextScore = this.r_getMoveScore(nextMove, nextTurnAlliance, myAlliance, level - 1);
    //         let nextScore = this.r_getMoveScore(nextMove, nextTurnAlliance, myAlliance, level - 1, newAlpha, newBeta);
    //         // if (myAlliance == Alliance.BLACK) {
    //         if (nextTurnAlliance == Alliance.BLACK) {
    //             if (bestScore === null || nextScore > bestScore) {
    //                 bestScore = nextScore;
    //                 newAlpha = bestScore;
    //                 if (newBeta <= newAlpha) {
    //                     // console.log('pruned alpha');
    //                     return newAlpha;
    //                 }
    //             }
    //         } else {
    //             // console.log('next turn is white?')
    //             if (bestScore == null || nextScore < bestScore) {
    //                 bestScore = nextScore;
    //                 newBeta = bestScore;
    //                 console.log(' new beta', newBeta);
    //                 if (newBeta <= newAlpha) {
    //                     console.log('pruned beta')
    //                     return newBeta;
    //                 }
    //             }
    //         }
    //     }

    //     // console.log('new alpha beta', newAlpha, newBeta)

    //     return bestScore ?? this.evaluateTiles(tiles);
    // }

    private _getMoveScore(
        tiles: any, 
        currentTurn: Alliance, 
        myAlliance: Alliance, 
        level = 2, 
        alpha: number, 
        beta: number, 
        whiteGraveyard: any, 
        blackGraveyard: any
    ): any {
        // return this.r_getMoveScore(tiles, currentTurn, myAlliance, 2);
       // add something to tell if we are descending
       // add alpha beta pruning


       // at the top level, black is minimizing, so next turn is maximizing
       let score = this.r_getMoveScore6(tiles, currentTurn, level, myAlliance === Alliance.BLACK ? 'max' : 'min', alpha, beta, whiteGraveyard, blackGraveyard); 

        return score;// 7 works
    }

    // private r_getMoveScore2(tiles: any, currentTurn: Alliance, level: number,  maxOrMin: 'max' | 'min', previousBest: number | null): any {
    //     let currentMoveScore = this.evaluateTiles(tiles);

    //     if (previousBest === null) {
    //         previousBest = currentMoveScore;
    //     }

    //     if (maxOrMin == 'max' && previousBest !== null && currentMoveScore < previousBest) {
    //         return currentMoveScore;
    //     } else if (maxOrMin == 'min' && previousBest !== null && currentMoveScore > previousBest) {
    //         return currentMoveScore;
    //     } else if (level == 0) {
    //         console.log('level 0');
    //         return currentMoveScore;
    //     }

    //     let nextMoves = this.getAllMoves(tiles, currentTurn);
    //     let opponentTurn = currentTurn === Alliance.WHITE ? Alliance.BLACK : Alliance.WHITE;
    //     let bestScore = null;
    //     let nextMoveScore = null;

    //     for (let nextMove of nextMoves) {
    //         nextMoveScore = this.r_getMoveScore2(nextMove, opponentTurn, level - 1, maxOrMin, bestScore ?? previousBest);
    //         if (maxOrMin == 'max') {
    //             if (bestScore === null || nextMoveScore > bestScore) {
    //                 bestScore = nextMoveScore;
    //             }
    //         } else {
    //             if (bestScore === null || nextMoveScore < bestScore) {
    //                 bestScore = nextMoveScore;
    //             }
    //         }
    //     }

    //     // console.log('return from move score', bestScore ?? currentMoveScore);

    //     return bestScore ?? currentMoveScore;
    // }

    // private r_getMoveScore3(tiles: any, currentTurn: Alliance, level: number,  maxOrMin: 'max' | 'min', _previousBest: number | null): any {
        
    //     if (level == 0) {
    //         // console.log('level 0');
    //         let currentMoveScore = this.evaluateTiles(tiles);
    //         // console.log('level 0', currentMoveScore);
    //         return currentMoveScore;
    //     }
        

    //     let nextMoves = this.getAllMoves(tiles, currentTurn);
    //     // console.log('length of get all moves', nextMoves.length);
    //     let opponentTurn = currentTurn === Alliance.WHITE ? Alliance.BLACK : Alliance.WHITE;
    //     let minScore = Infinity;
    //     let maxScore = -Infinity;
    //     // let nextMoveScore = null;
    //     let bestScore = null;

    //     for (let nextMove of nextMoves) {
    //         let nextMoveScore = this.r_getMoveScore3(nextMove, opponentTurn, level - 1, 
    //             maxOrMin == 'max' ? 'min' : 'max', // eh?
                
    //             bestScore ?? _previousBest
    //         );
    //         // console.log('next move score', nextMoveScore);
    //         if (nextMoveScore > maxScore) {
    //             maxScore = nextMoveScore;
    //         }
    //         if (nextMoveScore < minScore) {
    //             minScore = nextMoveScore;
    //         }
    //     }

        
    //     bestScore = maxOrMin === 'max' ? maxScore : minScore;
    //     // console.log('max, min, best score', maxScore, minScore, bestScore);

    //     // console.log('return from move score', bestScore ?? currentMoveScore);

    //     return bestScore;
    // }

    // private r_getMoveScore4(tiles: any, currentTurn: Alliance, level: number,  maxOrMin: 'max' | 'min', previousBest: number | null): any {
    //     let currentMoveScore = this.evaluateTiles(tiles);

    //     if (previousBest === null) {
    //         previousBest = currentMoveScore;
    //     }

    //     if (maxOrMin == 'max' && currentMoveScore < previousBest) {
    //         return currentMoveScore;
    //     } else if (maxOrMin == 'min' && currentMoveScore > previousBest) {
    //         return currentMoveScore;
    //     } else if (level == 0) {
    //         console.log('level 0');
    //         return currentMoveScore;
    //     }

    //     let nextMoves = this.getAllMoves(tiles, currentTurn);
    //     let opponentTurn = currentTurn === Alliance.WHITE ? Alliance.BLACK : Alliance.WHITE;
    //     let bestScore = null;
    //     let nextMoveScore = null;

    //     for (let nextMove of nextMoves) {
    //         nextMoveScore = this.r_getMoveScore4(nextMove, opponentTurn, level - 1, maxOrMin, currentMoveScore);
    //         if (maxOrMin == 'max') {
    //             if (bestScore === null || nextMoveScore > bestScore) {
    //                 bestScore = nextMoveScore;
    //             }
    //         } else {
    //             if (bestScore === null || nextMoveScore < bestScore) {
    //                 bestScore = nextMoveScore;
    //             }
    //         }
    //     }

    //     // console.log('return from move score', bestScore ?? currentMoveScore);

    //     return bestScore ?? currentMoveScore;
    // }

    // private r_getMoveScore5(tiles: any, currentTurn: Alliance, level: number,  maxOrMin: 'max' | 'min', alpha: number, beta: number): any {
        
    //     if (level == 0) {
    //         // console.log('level 0');
    //         let currentMoveScore = this.evaluateTiles(tiles);
    //         // console.log('level 0', currentMoveScore);
    //         return currentMoveScore;
    //     }
        

    //     let nextMoves = this.getAllMoves(tiles, currentTurn);
    //     // console.log('length of get all moves', nextMoves.length);
    //     let opponentTurn = currentTurn === Alliance.WHITE ? Alliance.BLACK : Alliance.WHITE;
    //     let minScore = Infinity;
    //     let maxScore = -Infinity;
    //     // let nextMoveScore = null;
    //     let bestScore = null;

    //     for (let nextMove of nextMoves) {
    //         let nextMoveScore = this.r_getMoveScore5(nextMove, opponentTurn, level - 1, maxOrMin, alpha, beta);
    //         // console.log('next move score', nextMoveScore);
    //         if (nextMoveScore > maxScore) {
    //             maxScore = nextMoveScore;
    //         }
    //         if (nextMoveScore < minScore) {
    //             minScore = nextMoveScore;
    //         }

    //         if (nextMoveScore < beta) {
    //             beta = nextMoveScore;
    //         }

    //         if (nextMoveScore > alpha) { //drunkkk
    //             alpha = nextMoveScore;
    //         }
    //     }

        
    //     bestScore = maxOrMin === 'max' ? maxScore : minScore;
    //     // console.log('max, min, best score', maxScore, minScore, bestScore);

    //     // console.log('return from move score', bestScore ?? currentMoveScore);

    //     return bestScore;
    // }

    private r_getMoveScore6(
        tiles: any, 
        currentTurn: Alliance, 
        level: number,  
        maxOrMin: 'max' | 'min', 
        alpha: number = -Infinity, 
        beta: number = Infinity,
        whiteGraveyard: any,
        blackGraveyard: any
    ): any {
        
        if (level == 0) {
            // console.log('level 0');
            let currentMoveScore = this.evaluateTiles(tiles, whiteGraveyard, blackGraveyard, currentTurn);
            // console.log('level 0', currentMoveScore);
            return currentMoveScore;
        }
        

        let nextMoves = this.getAllMoves(tiles, currentTurn, whiteGraveyard, blackGraveyard);
        // console.log('length of get all moves', nextMoves.length);
        let opponentTurn = currentTurn === Alliance.WHITE ? Alliance.BLACK : Alliance.WHITE;
        // let minScore = Infinity;
        // let maxScore = -Infinity;
        // // let nextMoveScore = null;
        // let bestScore = null;

        let bestScore;

        if (maxOrMin == 'max') {
            bestScore = -Infinity;
            for (let nextMove of nextMoves) {
                let nextMoveScore = this.r_getMoveScore6(
                    nextMove.tiles, 
                    opponentTurn, 
                    level - 1, 
                    'min', // eh?
                    
                    alpha,
                    beta,
                    nextMove.whiteGraveyard,
                    nextMove.blackGraveyard
                );

                bestScore = Math.max(bestScore, nextMoveScore);

                alpha = Math.max(alpha, bestScore);

                if (beta <= alpha) {
                    // console.log('pruned alpha'); 
                    break;
                }
                
            }
        } else {
            bestScore = Infinity;
            for (let nextMove of nextMoves) {
                let nextMoveScore = this.r_getMoveScore6(
                    nextMove.tiles, 
                    opponentTurn, 
                    level - 1, 
                    'max', // eh?
                    
                    alpha,
                    beta,
                    nextMove.whiteGraveyard,
                    nextMove.blackGraveyard
                );

                bestScore = Math.min(bestScore, nextMoveScore);

                beta = Math.min(beta, bestScore);

                if (beta <= alpha) {
                    // console.log('pruned beta'); 
                    break;
                }
                
            }
        }

        
        // bestScore = maxOrMin === 'max' ? maxScore : minScore;
        // console.log('max, min, best score', maxScore, minScore, bestScore);

        // console.log('return from move score', bestScore ?? currentMoveScore);

        return bestScore;
    }



    public getBestMove(tiles: any, alliance: Alliance, level: number = 2, whiteGraveyard: any, blackGraveyard: any) {
        // console.log(this.getAllMoves(tiles, alliance));
        console.log('current tile evaluation', this.evaluateTiles(tiles, whiteGraveyard, blackGraveyard, alliance));
        // return;

        let myMoves = this.getAllMoves(tiles, alliance, whiteGraveyard, blackGraveyard);
        console.log('my moves');
        if (!myMoves.length) window.alert('you win');

        let opponentAlliance = alliance === Alliance.WHITE ? Alliance.BLACK : Alliance.BLACK;

        let theirMoveScores = [];
        let foundBestMove = null;


        // console.log('getting their best scores')
        // let bestScore = null;
        let minScore = Infinity;
        let minMove = null;
        let minMoveArray: any[] = [];
        let maxScore = -Infinity;
        let maxMove = null;
        let maxMoveArray: any[] = [];
        console.log('I have this many moves:', myMoves.length)

        let alpha = -Infinity;
        let beta = Infinity;
        for (let i = 0; i < myMoves.length; i++) {
            let move = myMoves[i];
            let moveTiles = GameHelper.copyTiles(move.tiles);
            if (GameHelper.isCheckmated(moveTiles, opponentAlliance)) {
                foundBestMove = moveTiles; /**/ console.log('found a checkmate');
                break;
            }

            if (!foundBestMove) {
                // first we evaluate the tiles,
                // and if the move is 10% worse we will continue, unless it is the last index..


                let moveScore = this._getMoveScore(
                    moveTiles, 
                    opponentAlliance, 
                    alliance, 
                    level, 
                    alpha, 
                    beta, 
                    move.whiteGraveyard, 
                    move.blackGraveyard
                );
                if (moveScore === undefined) console.log('eh, undefined moveScore');
    
                if (moveScore == minScore) {
                    minMoveArray.push(moveTiles);
                }

                if (moveScore == maxScore) {
                    maxMoveArray.push(moveTiles);
                }
                
                if (moveScore < minScore) {
                    minScore = moveScore;
                    minMove = moveTiles;
                    minMoveArray = [];
                    minMoveArray.push(minMove);

                    if (alliance == Alliance.BLACK) { // black is trying to minimize here
                        beta = minScore;
                    }
                }
                if (moveScore > maxScore) {
                    maxScore = moveScore;
                    maxMove = moveTiles;
                    maxMoveArray = [];
                    maxMoveArray.push(maxMove);
                    if (alliance == Alliance.WHITE) {
                        alpha = maxScore;
                    }
                }
    
                // theirMoveScores.push({score: bestScore, index: i});
            }
        }

        let myGoal = alliance === Alliance.BLACK ? 'minimize' : 'maximize';

        let bestMove;
        if (myGoal == 'minimize') {
            // we want to pop from min moves
            bestMove = GameHelper._shuffledArray(minMoveArray).pop();

        } else {
            bestMove = GameHelper._shuffledArray(maxMoveArray).pop();

        }
        // let bestMove = alliance === Alliance.BLACK ? minMove : maxMove;
        

        if (foundBestMove) {
            bestMove = foundBestMove;
        }



        let coordinates = this._moveToCoordinates(tiles, bestMove);

        console.log('best move, coordinates', bestMove, coordinates);

        console.log('max: ', maxScore);
        console.log('min: ', minScore);
        if (minScore == Infinity || maxScore == Infinity) console.log('wtffff', bestMove, minMove, maxMove)
        console.log('I chose the ',alliance === Alliance.BLACK ? 'min' : 'max');
        console.log('current evaluation after move: ', this.evaluateTiles(bestMove, whiteGraveyard, blackGraveyard, alliance));

        // console.log('target, origin: ', target, origin);

        console.log('ran eval function this many times', this.numberEvalFunctionsRan);
        console.log('ran get all moves this many times', this.numberAllMovesFunctionsRan);

        
        return coordinates;
    }

    private _moveToCoordinates(tiles: any, bestMove: any) {
        let origin = {x: -1, y: -1};
        let target = {x: -1, y: -1};
        if (!tiles && !bestMove) return {origin, target};
        // console.log('best move', bestMove);
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (
                    bestMove[x][y].piece?.typeDisplay == tiles[x][y].piece?.typeDisplay
                    && bestMove[x][y].piece?.alliance == tiles[x][y].piece?.alliance
                ) continue;

                // console.log('x and y', tiles[x][y]);

                if (bestMove[x][y].piece == null) {
                    origin = {x: x, y: y};
                } else {
                    target = {x: x, y: y}
                }
            }
        }

        

        return {
            target, origin
        }
    }

    

    // how to get around calculating the future of mystery pieces?
    // we could substitute with a guess token, that could have a slightly better value than a mystery piece

    // return an array of all possible 1-step future game states
    // should take in an array of tiles, as well as the reserve and graveyard 
    public getAllMoves(
        inputTiles: any, 
        currentTurn: any,
        whiteGraveyard: any,
        blackGraveyard: any,
    ) {
        // iterate through the tiles, 
        // if the tile has a piece than get the valid moves
        let moves = [];
        // console.log('tiles', tiles);

        let tiles = GameHelper.copyTiles(inputTiles);

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let tile = tiles[x][y];

                if (!tile.piece || tile.piece.alliance !== currentTurn || tile.piece.typeDisplay == 'guess') continue;

                let validMoveTiles = tile.piece.getValidMoveTiles({x: x, y: y}, tiles);

                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {

                        if (validMoveTiles[i][j]) {
                            // we have a move
                            // create a copy of tiles and make that move.
                            // if the piece was mystery, replace it with an object that has pieceDisplay == 'guess'
                            let clonedTiles = GameHelper.copyTiles(tiles);

                            let clonedWhiteGraveyard, clonedBlackGraveyard;
                            if (clonedTiles[i][j].piece) {
                                if (clonedTiles[i][j].piece.isMysterious) {
                                    // clonedTiles[i][j].piece.typeDisplay = 'guess';
                                    clonedTiles[i][j].piece = {
                                        typeDisplay: 'guess',
                                        alliance: currentTurn, 
                                        isMysterious: false,
                                        makeMysterious: function () {
                                            this.isMysterious = true;
                                        }
                                    };
                                }
                                //push to cloned graveyard
                                if (clonedTiles[i][j].piece.alliance == Alliance.BLACK) {
                                    clonedBlackGraveyard = this._copyGraveyard(blackGraveyard);
                                    
                                    clonedBlackGraveyard.push(clonedTiles[i][j].piece); // still need to deal with if the piece is mysterious
                                } else {
                                    clonedWhiteGraveyard = this._copyGraveyard(whiteGraveyard);
                                    clonedWhiteGraveyard.push(clonedTiles[i][j].piece);
                                }
                            }

                            

                            if (tile.piece?.isMysterious) { // my piece is mysterious
                                clonedTiles[i][j].piece = null; // set the target.piece to null, should have been pushed to graveyard already
                                // we can do look at the black or white graveyard, and figure out what pieces are in our reserve.
                                // we will then pop one randomly.
                                let pieceMap = { //pieces potentially in the reserve
                                    pawn: 8,
                                    rook: 2,
                                    knight: 2,
                                    bishop: 2,
                                    queen: 1
                                } as any;


                                if (currentTurn == Alliance.WHITE) {
                                    for (let piece of whiteGraveyard) {
                                        if (piece.isMysterious) continue;

                                        pieceMap[piece.typeDisplay]--;
                                    }
                                } else {
                                    for (let piece of blackGraveyard) {
                                        if (piece.isMysterious) continue;

                                        pieceMap[piece.typeDisplay]--;
                                    }
                                }

                                // console.log('piece map', pieceMap);
                                // console.log('object keys', Object.keys(pieceMap));


                                clonedTiles[x][y].piece = null;

                                if (GameHelper.isCheck(clonedTiles, currentTurn)) continue;
                                // let reserveArray = this.repeatKeys(pieceMap);
                                let reserveArray: any[] = [];
                                for (let key of Object.keys(pieceMap)) {
                                    // console.log('key');
                                    if (pieceMap[key] > 0) {
                                        reserveArray.push(key);
                                    } else if (key == 'queen' && !('guess' in reserveArray)) {
                                        reserveArray.push('guess');
                                    }
                                }

                                // console.log('reserve array', reserveArray);

                                // we will break from this loop all the way to BREAKPOINT
                                for (let piece of reserveArray) {
                                    clonedTiles = GameHelper.copyTiles(clonedTiles);
                                    // console.log('typeDisplay', piece.typeDisplay);
                                    switch (piece.typeDisplay) {
                                        
                                        case 'pawn':
                                            clonedTiles[i][j].piece = new Pawn(currentTurn);
                                            break;
                                        case 'rook':
                                            clonedTiles[i][j].piece = new Rook(currentTurn);
                                            break;
                                        case 'knight':
                                            clonedTiles[i][j].piece = new Knight(currentTurn);
                                            break;
                                        case 'bishop':
                                            clonedTiles[i][j].piece = new Bishop(currentTurn);
                                            break;
                                        case 'queen':
                                            clonedTiles[i][j].piece = new Queen(currentTurn);
                                            break;
                                        default:
                                            // piece = clonedTiles[i][j].piece;
                                            clonedTiles[i][j].piece = {
                                                typeDisplay: 'guess',
                                                alliance: currentTurn, 
                                                isMysterious: false,
                                                makeMysterious: function () {
                                                    this.isMysterious = true;
                                                }
                                            };
                                    }

                                    if (
                                        clonedTiles[i][j].piece.typeDisplay == 'pawn' 
                                        && (
                                            clonedTiles[i][j].piece == Alliance.BLACK && i == 0
                                            || clonedTiles[i][j].piece == Alliance.WHITE && i == 7
                                        )
                                    ) {
                                        clonedTiles[i][j].piece = new Queen(clonedTiles[i][j].piece.alliance);
                                    }

                                    
        
                                    let returnDatum = {
                                        tiles: clonedTiles,
                                        whiteGraveyard: clonedWhiteGraveyard ?? whiteGraveyard,
                                        blackGraveyard: clonedBlackGraveyard ?? blackGraveyard
                                    };
                
                                    moves.push(returnDatum);
                                }

                                continue;
                                // remove this, and actully continue in the loop here.
                                clonedTiles[i][j].piece = {typeDisplay: 'guess', alliance: currentTurn, isMysterious: false};
                            } else {
                                clonedTiles[i][j].piece = tile.piece;
                            }

                            // we can account for pawn promotion here...
                            clonedTiles[x][y].piece = null;

                            
                            if (GameHelper.isCheck(clonedTiles, currentTurn)) continue;
                            if (
                                clonedTiles[i][j].piece.typeDisplay == 'pawn' 
                                && (
                                    clonedTiles[i][j].piece == Alliance.BLACK && i == 0
                                    || clonedTiles[i][j].piece == Alliance.WHITE && i == 7
                                )
                            ) {
                                clonedTiles[i][j].piece = new Queen(clonedTiles[i][j].piece.alliance);
                            }

                            let returnDatum = {
                                tiles: clonedTiles,
                                whiteGraveyard: clonedWhiteGraveyard ?? whiteGraveyard,
                                blackGraveyard: clonedBlackGraveyard ?? blackGraveyard
                            };
        
                            moves.push(returnDatum);
                        }
                    }
                }

                

                // iterate through the tiles.
                // if the tile is set to true, 
                // make that move on a clone of tiles 
                // use full knowledge of what's next in the reserve stack
            }
        }

        this.numberAllMovesFunctionsRan++;

        return moves;
    }

    private repeatKeys(obj: any) {
        const result = [];
        for (const key in obj) {
          if (typeof obj[key] === 'number' && obj[key] > 0) {
            result.push(...Array(obj[key]).fill(key));
          }
          if (typeof obj[key] === 'number' && obj[key] <= 0) {
            result.push(...Array(obj[key]).fill('guess'));
          }
        }
        return result;
      }

    // this will be used for each of the opponents moves in response to moves
    // from getAllMoves. Call this 
    public evaluateTiles(tiles: any, whiteGraveyard: any, blackGraveyard: any, currentTurn: Alliance) {
        // assign the max/min value for a checkmate
        // DONE: assign a point value to each piece type
        // assign a point value to each piece for the number of valid moves that a piece has
        // assign a point value to each piece for protecting a piece that has greater value
        // DONE: assign a point value to each piece for the position, with higher points in the middle
        // assign some points to each piece for if it is putting the king in check, with extra if it is not attacked
        // assign a point value to each piece for whether it is attacking pieces of greater value
        // if a piece is being protected, give points based on value of protecting piece
        // if a piece is under attack, give points based on value of attacking piece
        // DONE: if a pawn is about to promote, give it a higher value. extra if it is going to promote and won't be attacked
        // assign extra points to mystery pieces based on what's next in the reserve
        
        // note: some of these should only apply if king is not in check
        let weights = {
            type: 4,//150,
            position: 1,
            pawnPosition: 1,
            validMoves: 1,
            revealed: 1,
            check: 5,
            graveyard: 1,
        };

        let sum = 0;
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8 ; y++) {
                sum += weights.type * this._getTypeValue(tiles, x, y);
                // sum += weights.pawnPosition * this._getPawnPositionValue(tiles, x, y);
                // sum += weights.position * this._getPositionValue(tiles, x, y);
                sum += weights.validMoves * this._getValidMovesValue(tiles, x, y);
            }
        }
        sum += weights.revealed * this._getNumberRevealedPiecesValue(tiles);
        // sum += this._getCheckmateValue(tiles);
        sum += weights.check * this._getCheckValue(tiles);


        // let graveyardValue = weights.graveyard * this._getGraveyardValue(whiteGraveyard, blackGraveyard, currentTurn);
        // console.log('graveyard value', graveyardValue);
        // sum += graveyardValue;


        // console.log('sum', sum);
        this.numberEvalFunctionsRan++;
        // console.log('ran eval function this many times', this.numberEvalFunctionsRan);
        return sum;
    }

    private _getTypeValue(tiles: any, x: number, y: number) {
        let piece = tiles[x][y].piece;

        if (!piece) return 0;

        let value = 0;
        if (piece.typeDisplay === 'pawn') value = 10;
        else if (piece?.isMysterious) value = 20;
        else if (piece.typeDisplay === 'guess') value = 25;
        else if (piece.typeDisplay === 'bishop') value = 50;
        else if (piece.typeDisplay === 'knight') value = 50;
        else if (piece.typeDisplay === 'rook') value = 120;
        else if (piece.typeDisplay === 'queen') value = 250;
        // else if (piece.typeDisplay === 'king') value = 900;

        return this._allianceToValue(piece.alliance, value);
    }

    private _getGraveyardValue(whiteGraveyard: any, blackGraveyard: any, currentTurn: Alliance) {
        // we will iterate through the white and black graveyards...
        // subtracting for white, and adding for black.

        let value = 0;

        for (let piece of whiteGraveyard) {
            if (piece.isMysterious && currentTurn == Alliance.WHITE) {
                // we will push a guess to the graveyard when piece is captured?
                value -= 20;
                continue;
            } 

            switch (piece.typeDisplay) {
                case 'guess':
                    value -= 20;
                    break;
                case 'pawn':
                    value -= 10;
                    break;
                case 'bishop':
                case 'knight':
                    value -= 30;
                    break;
                case 'rook':
                    value -= 60;
                    break;
                case 'queen':
                    value -= 120;
                    break;
            }
        }

        for (let piece of blackGraveyard) {
            if (piece.isMysterious && currentTurn == Alliance.BLACK) {
                // we will push a guess to the graveyard when piece is captured?
                value += 20;
                continue;
            }

            switch (piece.typeDisplay) {
                case 'guess':
                    value += 20;
                    break;
                case 'pawn':
                    value += 10;
                    break;
                case 'bishop':
                case 'knight':
                    value += 30;
                    break;
                case 'rook':
                    value += 60;
                    break;
                case 'queen':
                    value += 120;
                    break;
            }
        }

        return value;
    }

    private _copyGraveyard(graveyard: any) {
        let newGraveyard = [];

        for (let piece of graveyard) {
            let newPiece = GameHelper.objectToPiece(JSON.parse(JSON.stringify(piece)));

            newGraveyard.push(newPiece);
        }

        return newGraveyard;
    }

    private _getNumberRevealedPiecesValue(tiles: any) {
        let value = 0;
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (!tiles[x][y].piece) continue;
                if (tiles[x][y].piece?.isMysterious) continue;
                if (tiles[x][y].piece.alliance === Alliance.WHITE) {
                    value++;
                    continue;
                }

                value--;
            }
        }

        return value;
    }

    private _getPositionValue(tiles: any, x: number, y: number) {
        let piece = tiles[x][y].piece;

        if (!piece) return 0;

        // minimimum absolute value of x - 4 should reward highest points
        let value = 0;
        switch (Math.min(Math.abs(x - 4), Math.abs(x - 3))) { //FIXME
            case -1:
            case 0:
                value = 3;
                break;
            case 1:
                value = 2;
                break;
            case 2:
                value = 1;
                break;
            case 3:
                value = 0;
                break;
        }

        return this._allianceToValue(piece.alliance, value);
    }

    private _getValidMovesValue(tiles: any, x: number, y: number) {
        if (!tiles[x][y].piece) return 0;
        if (tiles[x][y].piece.typeDisplay == 'guess') return 1;

        let piece = tiles[x][y].piece;
        // if (!piece?.getValidMoveTiles) console.log(piece);
        let validMoves = piece.getValidMoveTiles({x, y}, tiles);

        let value = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (validMoves[i][j]) value++;
            }
        }

        return this._allianceToValue(piece.alliance, value);
    }

    private _getCheckValue(tiles: any) {
        if (GameHelper.isCheck(tiles, Alliance.BLACK)) {
            // console.log('check')
            return 1;
        } else if (GameHelper.isCheck(tiles, Alliance.WHITE)) {
            // console.log('che/ck')
            return - 1;
        }

        return 0;
    }

    private _getCheckmateValue(tiles: any) {
        if (GameHelper.isCheckmated(tiles, Alliance.WHITE)) {
            return -100000000;
        } if (GameHelper.isCheckmated(tiles, Alliance.BLACK)) {
            return 100000000;
        }

        return 0;
    }

    // BONUS: Add points if pawn can promote without being taken?
    // x of 7 is white promoting pawn
    private _getPawnPositionValue(tiles: any, x: number, y: number) {
        if (!tiles[x][y].piece || tiles[x][y].piece.typeDisplay != 'pawn') return 0;

        let piece = tiles[x][y].piece;
        // console.log('pawn at x,y:', x, y);
        // let value = 0;
        if (piece.alliance === Alliance.WHITE) { //FIXME... does this make sense, orientation and direction wise?
            if (x == 7) {
                return 10;
            }
            return x;
        }

        if (x == 0) {
            return -10;
        }
        return -1 * (7 - x);
    }

    private _allianceToValue(alliance: Alliance, value: number) {
        if (alliance === Alliance.WHITE) {
            return value;
        }

        return -1 * value;
    }

    
}
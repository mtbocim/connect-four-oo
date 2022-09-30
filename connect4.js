"use strict";
// change width / height to lowercase
class Game {
  constructor(width = 6, height = 7) {
    this.width = width;
    this.height = height;

    this.start = document.querySelector("#start");
    this.start.addEventListener("click", () => {
      this.board = []; // array of rows, each row is array of cells  (board[y][x])
      this.playerOne = new Player('one', document.querySelector('#playerOne').value);
      this.playerTwo = new Player('two', document.querySelector('#playerTwo').value);
      this.currPlayer = this.playerOne; // active player: 1 or 2
      this.makeBoard();
      this.makeHtmlBoard();
    });

  }


  /** Connect Four
   *
   * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
   * column until a player gets four-in-a-row (horiz, vert, or diag) or until
   * board fills (tie)
   */


  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', () => { this.handleClick(event); });

    // *alternative method* //v
    // let click = this.handleClick.bind(this)
    // top.addEventListener('click', click);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.setAttribute('id', `${this.currPlayer.name}`);
    piece.style.backgroundColor = `${this.currPlayer.color}`;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    setTimeout(() => {
      alert(msg);
    }, 10);
  }


  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.name} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.playerOne ?
      this.playerTwo : this.playerOne;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {

    const _win = (cells) => {
      if (cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      )) {
        cells.forEach(([y, x]) => {
          const winningCell = document.getElementById(`${y}-${x}`);
          winningCell.classList.add('winningPieces');
        });
        return true;
      }


    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {

        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }

}
let newGame = new Game(6, 7);
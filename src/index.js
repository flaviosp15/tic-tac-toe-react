import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  renderBoard() {
    const arr = Array(3).fill(null);
    const boardRows = arr;
    const boardColumns = arr;
    let square = 0;
    return boardRows.map((_, i) => (
      <div key={i} className="board-row">
        {boardColumns.map(() => this.renderSquare(square++))}
      </div>
    ));
  }

  render() {
    return <div>{this.renderBoard()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          move: 0,
          squares: Array(9).fill(null),
          target: Array(2).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const icon = this.state.xIsNext ? 'X' : 'O';
    squares[i] = icon;
    const tableTarget = {
      0: { col: 1, row: 1 },
      1: { col: 2, row: 1 },
      2: { col: 3, row: 1 },
      3: { col: 1, row: 2 },
      4: { col: 2, row: 2 },
      5: { col: 3, row: 2 },
      6: { col: 1, row: 3 },
      7: { col: 2, row: 3 },
      8: { col: 3, row: 3 },
    };
    const { col: column, row } = tableTarget[i];
    this.setState({
      history: history.concat([{ move: this.state.stepNumber + 1, squares: squares, target: [column, row] }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  styleSelectedMove(target, buttons) {
    buttons.forEach(btn => (btn.style.fontWeight = 'initial'));
    target.style.fontWeight = 'bold';
  }

  jumpTo(target, step) {
    const buttons = document.querySelectorAll('li > button');
    let selectedBtn;
    buttons.forEach(btn => {
      if (btn.innerText === target.innerText) {
        selectedBtn = btn;
      }
    });
    this.styleSelectedMove(selectedBtn, buttons);
    this.setState({
      selection: target.innerText,
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  toggleClassName(target) {
    target.classList.toggle('active');
    const value = target.classList.value;
    return this.sortList(value);
  }

  sortList(value) {
    const history = this.state.history;
    if (value) {
      this.setState({
        history: history.sort((a, b) => b.move - a.move),
      });
    } else {
      this.setState({
        history: history.sort((a, b) => a.move - b.move),
      });
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const icon = this.state.xIsNext ? 'X' : 'O';
    const winner = calculateWinner(current.squares);
    const status = winner ? `Winner: ${winner}` : `Next player: ${icon}`;
    const move = history.map(({ move }) => {
      const desc = move ? `Go to move # ${move}` : 'Go to game start';
      return (
        <li key={move}>
          <button
            onClick={({ target }) => {
              this.jumpTo(target, move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });
    const [column, row] = current.target;
    return (
      <div className="game">
        <div className="game-board">
          <div>{current.target[0] && `Col: ${column} | Row: ${row}`}</div>
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={({ target }) => this.toggleClassName(target)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M11 9h9v2h-9zm0 4h7v2h-7zm0-8h11v2H11zm0 12h5v2h-5zm-6 3h2V8h3L6 4 2 8h3z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="m6 20 4-4H7V4H5v12H2zm5-12h9v2h-9zm0 4h7v2h-7zm0-8h11v2H11zm0 12h5v2h-5z"></path>
            </svg>
          </button>
          <ol>{move}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);

const calculateWinner = squares => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

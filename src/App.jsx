import { useState } from "react";

//value diambil dari props Component Board
function Square({ value, onSquareClick }) {
  //event handler untuk menangani event yg akan terjadi
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  //fungsi untuk mengubah isi dari array dengan setSquares
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return; //jika ada isinya(true) keluar dari fungsi
    //slice untuk membuat array baru
    const nextSquares = squares.slice();
    //di array baru, jika ada value di index ke i nya akan berisi 'X'
    nextSquares[i] = xIsNext ? "X" : "O";
    // setSquares(nextSquares);
    // setXIsNext(!xIsNext); //jika false
    onPlay(nextSquares);
  }
  //menampilkan yg menang
  const winner = calculateWinner(squares);
  let status = "";
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next turn: ${xIsNext ? "X" : "O"}`;
  }

  return (
    // component Square menerima value, maka akan dikirim ke paramnya
    // onSquareClick menjalankan function handle click untuk mengubah nilai
    <>
      <div className="status">{status}</div>
      <div className="board">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

//membungkus lift state up lagi untuk dapat menjalankan fitur `time travel`
export default function Game() {
  //membuat giliran, true karena yg pertama adalah X
  const [xIsNext, setXIsNext] = useState(true);
  //menggunakan lift state up
  //membuat 9 array yg dibungkus dengan array(agar jika ada perubahan membuat array baru)
  const [history, setHistory] = useState([Array(9).fill(null)]);

  const [currentMove, setCurrentMove] = useState(0);
  //mengambil array terakhir history(perubahan yg terakhir)
  const currentSquares = history[currentMove];

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    //dupilkat array, dan menambahkan array baru diakhir
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  //updater untuk membikin tombol agar dapat menjalankan handlePlay()
  const moves = history.map((squares, move) => {
    let description = "";
    if (move > 0) {
      description = `Go move to # ${move}`;
    } else {
      description = `Go start the game`;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  // membuat baris kemenangan
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
  // melakukan iterasi
  for (let i = 0; i < lines.length; i++) {
    //perumpamaan salah satu array diatas [a,b,c] berisi lines[i] yaitu nilai yg sama
    const [a, b, c] = lines[i];
    // pengkondisian kemenangan
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //return hasilnya 'X' / 'O'
      return squares[a];
    }
  }
  return false;
}

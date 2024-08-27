import React from "react";
import Die from "./Die";
import './App.css';
import { nanoid } from 'nanoid';
import Confetti from "react-confetti";
import { useWindowSize } from 'react-use';

function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rolls, setRolls] = React.useState(0);
  const [highscore, setHighscore] = React.useState(
    JSON.parse(localStorage.getItem("highscore")) || null
  );

  const { width, height } = useWindowSize();

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      if (highscore === null || rolls < highscore) {
        setHighscore(rolls);
        localStorage.setItem("highscore", JSON.stringify(rolls));
      }
    }
  }, [dice, rolls, highscore]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setRolls(prevRolls => prevRolls + 1);
      setDice(oldDice =>
        oldDice.map(die => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setRolls(0);
      setDice(allNewDice());
      setTenzies(false);
    }
  }

  function holdDice(id) {
    setDice(oldDice =>
      oldDice.map(die => {
        return die.id === id
          ? { ...die, isHeld: !die.isHeld }
          : die;
      })
    );
  }

  const diceElements = dice.map(die => (
    <Die
      value={die.value}
      key={die.id}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <div className="container">
      {tenzies && <Confetti width={width} height={height} />}
      <main>
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at
          its current value between rolls.
        </p>
        <div className="stats">
          <p>Rolls: {rolls}</p>
          {highscore !== null && <p>High Score: {highscore}</p>}
        </div>
        <div className="dice-container">
          {diceElements}
        </div>
        <button className="roll-dice" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
      </main>
    </div>
  );
}

export default App;

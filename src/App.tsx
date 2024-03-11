// import { useState } from 'react';

import { useCallback, useEffect, useState } from "react"
import words from './wordList.json'
import HangmanDrawing from "./HangmanDrawing";
import HangmanWord from "./HangmanWord";
import Keyboard from "./Keyboard";

function App() {
  const [wordtoGuess, setWordtoGuess] = useState(() => words[Math.floor(Math.random() * words.length)]);
  const [guessedLetters , setGuesseddLetters] = useState<string[]>([])
  const inCorrectLetters = guessedLetters.filter(letter => !wordtoGuess.includes(letter));
  

  const isloser = inCorrectLetters.length>=6;
  const isWinner = wordtoGuess.split("").every(letter => guessedLetters.includes(letter))

  const addGuessedLetter = useCallback((letter:string) => {
    if(guessedLetters.includes(letter) || isloser || isWinner) return
    setGuesseddLetters(currentLetters => [...currentLetters , letter])
  },[guessedLetters ,isWinner , isloser])

  
  
  useEffect(()=>{
    const handler = (e: KeyboardEvent) =>{
      const key = e.key

      if(!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }
    document.addEventListener("keypress", handler)
    return () => {
      document.removeEventListener("keypress", handler)
    }
  },[addGuessedLetter, guessedLetters])

  
  return (
    <>
      <div
        style={{
          maxWidth: '800px',
          display: "flex",
          flexDirection: 'column',
          gap: '2rem',
          margin: '0 auto',
          alignItems: "center"
        }}
      >
        <div style={{ fontSize: '2rem', textAlign: 'center' }}>
          {isWinner && "Winner! - Refresh to try again"}
          {isloser && "Nice Try - Refresh to try again"}
        </div>
        <HangmanDrawing  numberOfGuesses={inCorrectLetters.length}/>
        <HangmanWord reveal = {isloser} guessedLetters = {guessedLetters} wordToGuess = {wordtoGuess}/>
        <div style={{ alignSelf: "stretch" }}>
          <Keyboard disabled = {isWinner || isloser} activeLetters ={guessedLetters.filter(letter => wordtoGuess.includes(letter))} inactiveLetters = {inCorrectLetters} addGuessedLetter = {addGuessedLetter}/>
        </div>
      </div>
    </>
  )
}

export default App

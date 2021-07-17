import { TypeWriterProps } from './typeWriterTypes';
import { useState, useEffect } from 'react';

const TypeWriter = ({ lines, typeSpeed, noErase, eraseSpeed, delayAfterWrite, delayAfterErase, shadow }: TypeWriterProps) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blinking, setBlinking] = useState(true);

  const shadowStyle = shadow ? {textShadow: '3px 3px 0px rgba(0, 0, 0, 0.3)'} : {};

  useEffect(() => {
    const currentLine = lines[lineIndex];

    if(!reverse && letterIndex === currentLine.length + 1) {
      if(!noErase) setReverse(true);
      return;
    }

    if (reverse && letterIndex === 0) {
      setLineIndex(idx => (idx + 1 < lines.length) ? idx + 1 : 0);
      setReverse(!reverse);
      return;
    }

    const typeTimeout = setTimeout(() => {
      setLetterIndex(letterIndex + (reverse ? -1 : 1));
    }, letterIndex === currentLine.length || letterIndex === 0 ? (reverse ? (delayAfterErase || 2000) : (delayAfterWrite || 2000)) : (reverse ? (eraseSpeed || 30) : (typeSpeed || 50)));

    return () => {
      clearTimeout(typeTimeout);
    }
  }, [letterIndex, lineIndex, typeSpeed, lines, reverse, delayAfterWrite, delayAfterErase, eraseSpeed, noErase]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBlinking(state => !state);
    }, 500);

    return () => {
      clearTimeout(timeout);
    }
  }, [blinking]);

  return (
    <div>
      <p style={{display: 'inline', ...shadowStyle}}>{lines[lineIndex].substring(0, letterIndex)}</p>
      <div style={{display: 'inline', opacity: blinking ? '1' : '0', ...shadowStyle}}>|</div>
    </div>
  );
}

export default TypeWriter;

/*
navbar.css('position', 'fixed')
var typer = $('#typer')
var cursor = $('#cursor')
let i = 0
function cursorUpdate() {
    if (i % 2 == 0) cursor.show()
    else cursor.hide()
    i++
}

setInterval(cursorUpdate, 700)

function nextAnimationFrame() {
    let removeIndex = 0
    let interval = setInterval(() => {
        if (typer.text().length >= 1) {
            if (typer.text().length == 1) {
                typer.html('&zwnj;')
                clearInterval(interval)
                setTimeout(writeWord, 1000)
            }
            else {
                typer.text(typer.text().substring(0, typer.text().length - 1))
            }
            removeIndex++
        }
    }, 30);
}

function writeWord() {
    phraseIndex = (phraseIndex + 1) % phrases.length
    let newPhrase = phrases[phraseIndex]

    let letterIndex = 0
    let interval = setInterval(() => {
        if (letterIndex < newPhrase.length) {
            typer.text(typer.text() + newPhrase[letterIndex])
        } else {
            clearInterval(interval)
            setTimeout(nextAnimationFrame, 5000)
        }
        letterIndex++
    }, 50)
}

phrases = [
    "Apprendre la programmation",
    "Apprendre les concepts de l'IA",
    "Apprendre en jouant",
]

let phraseIndex = 0

typer.text(phrases[0])

setTimeout(nextAnimationFrame, 5000)

*/
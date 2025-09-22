import { useState, useEffect, useRef } from 'react'
import './App.scss'

import React, { Component } from 'react';
import Icon from '@mdi/react';
import { mdiPlayPause , mdiArrowUpBold, mdiArrowDownBold, mdiReplay} from '@mdi/js';

let breakLength = 5;
let sessionLength = 25; 
let minute = sessionLength;
let minutesValue = true;
let divColor = '';
const STATUS = {
  pause: 0,
  start: 1,
  default: 2
}


function App() {
  const [forBreakLength, setForBreakLength] = useState(breakLength);
  const [forSessionLength, setForSessionLength] = useState(sessionLength);
  const [displayLabel, setDisplayLabel] = useState('Session');
  
  const [minutes, setMinuts] = useState(minute);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState(STATUS.default);
  const intervalRef = useRef(null);
  let audioRef = useRef();
  const Div = ({color, id, content}) => {
    const styleDiv = {
      color: color
    }
    return <div style={styleDiv} id={id}>{content}</div>
  }

  function countDown(){
      if(minutes==1 && seconds==0 ){
        divColor = 'rgb(209, 52, 4)';
      }else if(minutes==0 && seconds==0 || minutes>1){
        divColor = '';
      }
      if(minutes==0 && seconds==1){
        audioRef.current.play();
      }
      if(seconds == 0){
        if(minutes !==0){
          setSeconds(59);
          setMinuts(min => min-1);
        }else{
          if(minutesValue==true || minutesValue==true && sessionLength==1){
            setMinuts(breakLength);
            setSeconds(0);
            setDisplayLabel('Break');
            minutesValue = false;
            console.log('True');
          }else{
            setMinuts(sessionLength);
            setSeconds(0);
            setDisplayLabel('Session');
            minutesValue = true;
            console.log('False');
          }
        }
      }else{
        setSeconds(sec => sec - 1);
      } 
    }
  useEffect(() => {
    if(status==STATUS.start){
      intervalRef.current = setInterval(() => {
        countDown();
      }, 1000);
    }else if(status==STATUS.pause && intervalRef.current){
      clearInterval(intervalRef.current);
    }
    return() => {
      clearInterval(intervalRef.current);
    };
  }, [minutes, seconds, status]);

  //Function manipulating minute section

  //Function manipulating second section
  const handleDecrBreak = () => {
    if(breakLength>1 && status !== STATUS.start){
      breakLength--;
      setForBreakLength(breakLength);
    }
    
  }

  const handleIncrBreak = () => {
    if(breakLength<60 && status !== STATUS.start){
      breakLength++;
      setForBreakLength(breakLength);
    }
    
  }

  const handleDecrSession = () => {
    if(sessionLength>1 && status !== STATUS.start){
      if(minutes<sessionLength){
        sessionLength = minutes;
        setForSessionLength(sessionLength);
        setSeconds(0);
      }else{
        sessionLength--;
        setForSessionLength(sessionLength);
        setMinuts(sessionLength);
        setSeconds(0);
      }
      
    }
  }

  const handleIncrSession = () => {
    if(sessionLength<60 && status !== STATUS.start){
        sessionLength++;
        setForSessionLength(sessionLength);
        setMinuts(sessionLength);
        setSeconds(0);
    }
    
  }

  const timerMinutes = minutes<10 ? `0${minutes}` : minutes;
  const timerSeconds = seconds<10 ? `0${seconds}` : seconds;
  const handleStartPause = () => {
    if(status == STATUS.default || status == STATUS.pause){
      setStatus(STATUS.start);
    }else if(status == STATUS.start){
      setStatus(STATUS.pause);
    }
  };
  
  const handleReset = () => {
    setStatus(STATUS.pause);
    setMinuts(25);
    setSeconds(0);
    setForBreakLength(5);
    setForSessionLength(25);
    sessionLength = 25;
    breakLength = 5;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    divColor = '';
  }

  return (
    <>
      <div id='main-container'>
        <h1>25 + 5 Clock</h1>
        <div id='first-clock-pannel'>

          <div className='pannel'>
            <p id='break-label'>Break length</p>
            <div className='pannel-element'>
              <button id='break-decrement' onClick={handleDecrBreak}><Icon path={mdiArrowDownBold} size={0.8} color="rgb(247, 205, 20)" /></button>
              <div id='break-length'>{forBreakLength}</div>
              <button id='break-increment' onClick={handleIncrBreak}><Icon path={mdiArrowUpBold} size={0.8} color="rgb(247, 205, 20)" /></button>
            </div>
          </div>

          <div className='pannel'>
            <p id='session-label'>Session length</p>
            <div className='pannel-element'>
              <button id='session-decrement' onClick={handleDecrSession}><Icon path={mdiArrowDownBold} size={0.8} color="rgb(247, 205, 20)" /></button>
              <div id='session-length'>{forSessionLength}</div>
              <button id='session-increment' onClick={handleIncrSession}><Icon path={mdiArrowUpBold} size={0.8} color="rgb(247, 205, 20)"/></button>
            </div>
          </div>

        </div>
  
          <div id='clock'>
            <div id='timer-label'>{displayLabel}</div>
            <Div id={'time-left'} content={timerMinutes+':'+timerSeconds} color={divColor}/>
          </div>
          <div id='clock-control'>
            <button id='start_stop' onClick={handleStartPause}><audio id='deep' src="../clock.mp3" ref={audioRef}></audio><Icon path={mdiPlayPause} size={1} color="rgb(247, 205, 20)" /></button>
            <button id='reset' onClick={handleReset}><Icon path={mdiReplay} size={1} color="rgb(247, 205, 20)" /></button>
          </div>
               
      </div>
    </>
  )
}

export default App

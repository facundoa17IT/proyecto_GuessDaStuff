import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

// Function to render time inside the timer
const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Tiempo Finalizado!</div>;
  }

  return (
    <div className="timer">
      {/* <div className="text">Remaining</div> */}
      <div style={{fontWeight:'bold', fontSize:'50px'}} className="value">{remainingTime}</div>
      {/* <div className="text">seconds</div> */}
    </div>
  );
};

const CircleTimer = ({size=150, isLooping = false, loopDelay = 0 , isPlaying, duration = 10, onTimerComplete = () => {}, onTimeUpdate = () => {}}) => {
  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', margin:'5px'}}>
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={duration}
          colors={["#008000", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[duration, duration/2, duration-duration]}
          onUpdate={(remainingTime) => {
            // Calcula el tiempo transcurrido y envíalo al padre
            const elapsedTime = duration - remainingTime;
            onTimeUpdate(elapsedTime);
          }}
          onComplete={() => {
            onTimerComplete();
            return { shouldRepeat: isLooping, delay: loopDelay } // repeat animation in 1.5 seconds
          }}
          size={size}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    </div>
  );
};

export default CircleTimer;
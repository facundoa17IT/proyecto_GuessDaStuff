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

const CircleTimer = ({isLooping = false, loopDelay = 0 , isPlaying, duration = 10, onTimerComplete = () => {}}) => {
  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', margin:'15px'}}>
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={duration}
          colors={["#008000", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[duration, duration/2, duration-duration]}
          onComplete={() => {
            onTimerComplete();
            return { shouldRepeat: isLooping, delay: loopDelay } // repeat animation in 1.5 seconds
          }}
          //onComplete={onTimerComplete} // Use the onComplete prop passed from the parent
          size={150}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    </div>
  );
};

export default CircleTimer;
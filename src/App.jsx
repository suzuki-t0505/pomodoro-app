import './App.css';
import React, {useState, useCallback, useRef} from 'react';


function App() {
  // 1s（1000ms)
  const interval = 1000;
  const [timer, setTimer] = useState(() => {
    const timerMs = 25 * 60 * 1000;
    const minute = Math.trunc(timerMs / 1000 / 60);
    const second = Math.trunc(timerMs / 1000 - minute * 60);
    const inputValue = minute;
    return ({timerMs, minute, second, inputValue});
  });

  const [water, setWater] = useState({
    add: 100 / (25 * 60),
    value: 0.0,
    style: {
      position: 'absolute', bottom: '0', width: '100%', height: '0', backgroundColor: '#472800', transition: 'height 1s ease-in-out'
    }
  });

  const [isStarted, setIsStarted] = useState(false);
  const countInterval = useRef(null);

  const setTimerMs = useCallback((minute) => {
    if (isStarted) return;
    const ms = minute * 60 * 1000;
    setTimer(prevTimer => {
      const timerMs = ms;
      const minute = Math.trunc(timerMs / 60 / 1000);
      const second = Math.trunc(timerMs / 1000 - minute * 60);
      const inputValue = minute;
      return({timerMs, minute, second, inputValue});
    });

    setWater(prevTimer => {
      return({...prevTimer, add: 100 / (minute * 60)});
    });
  }, []);

  const countTimer = useCallback(() => {
    console.log('timerMs', timer.timerMs);
    if (timer.timerMs <= 0)
    {
      alert('終了');
      clearInterval(countInterval.current);
      countInterval.current = null;
      return;
    }
    // 1秒マイナス
    setTimer(({timerMs, minute, second, ...prevTimer}) => {
      timerMs -= 1000;
      minute = Math.trunc(timerMs / 60 / 1000);
      second = Math.trunc(timerMs / 1000 - minute * 60);
      return({...prevTimer, timerMs, minute, second});
    });

    setWater(({add, value, style}) => {
      // add%増やす
      value += add;
      console.log('add', add, ' value', value);
      const height = value + '%';
      style = {...style, height};
      return ({add, value, style});
    });
  }, []);

  const start = useCallback(() => {
    if (isStarted) return;
    setIsStarted(true);
    countInterval.current = setInterval(countTimer, interval)
  }, []);



  return (
    <div>
      <div>
        <p>
          <span>{timer.minute > 9 ? timer.minute : '0' + timer.minute}</span>分
          <span>{timer.second > 9 ? timer.second : '0' + timer.second}</span>秒</p>
        <div style={{display: 'flex', gap: '20px'}}>
          <div>
            <input type="number" onChange={(e) => setTimerMs(e.target.value)} value={timer.inputValue} disabled={isStarted} />分  
          </div>
          <button type="button" onClick={() => start()}>スタート</button>
        </div>
      </div>

      <div style={{height: '300px', width: '500px', border: '2px solid #000', borderRadius: '0 0 50% 50%', overflow: 'hidden', marginTop: '20px', zIndex: '10'}}>
        <div style={{position: 'absolute', width: '500px', height: '300px', backgroundColor: '#fffff1', borderRadius: '0 0 50% 50%', overflow: 'hidden'}}>
          <div style={water.style}></div>
        </div>
      </div>
    </div>
  );
}

export default App;

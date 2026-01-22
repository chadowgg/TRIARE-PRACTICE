import { useState, useEffect, useRef } from 'react';
import { Tamagotchi } from './Tamagotchi.ts';

function App() {
  const tamagotchiRef = useRef(new Tamagotchi('Test'));

  const [stats, setStats] = useState(tamagotchiRef.current.getStats());

  const isInteractionDisabled = stats.status === 'SLEEPING';

  useEffect(() => {
    const timer = setInterval(() => {
      tamagotchiRef.current.tick();
      setStats({ ...tamagotchiRef.current.getStats() });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFeed = () => {
    tamagotchiRef.current.feed();
    setStats({ ...tamagotchiRef.current.getStats() });
  };

  const handlePlay = () => {
    tamagotchiRef.current.play();
    setStats({ ...tamagotchiRef.current.getStats() });
  };

  const handleToggleSleep = () => {
    if (stats.status === 'SLEEPING') {
      tamagotchiRef.current.wakeUp();
    } else {
      tamagotchiRef.current.sleep();
    }
    setStats({ ...tamagotchiRef.current.getStats() });
  };

  const restartGame = () => {
    tamagotchiRef.current = new Tamagotchi('Test');

    setStats(tamagotchiRef.current.getStats());
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Tamagotchi: {stats.name}</h1>

      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <h3>Статус: {stats.status}</h3>
        <p> Голод: {stats.hunger}</p>
        <p> Щастя: {stats.happiness}</p>
        <p> Сон: {stats.energy}</p>

        {stats.hunger < 30 ? <div>Я голодний</div> : ''}
        {stats.happiness < 30 ? <div>Мені сумно</div> : ''}
        {stats.energy < 30 ? <div>Хочу спати</div> : ''}
      </div>

      {stats.status !== 'DEAD' ? (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleFeed}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
            disabled={isInteractionDisabled}
          >
            Погодувати
          </button>
          <button
            onClick={handlePlay}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
            disabled={isInteractionDisabled}
          >
            Погратися
          </button>
          <button
            onClick={handleToggleSleep}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
            disabled={isInteractionDisabled}
          >
            Спати
          </button>
          <button
            onClick={() => tamagotchiRef.current.wakeUp()}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Прокидайся
          </button>
        </div>
      ) : (
        <div>
          <div style={{ color: 'red', fontWeight: 'bold' }}>
            <p>Game over ({stats.massage})</p>
          </div>
          <button
            onClick={restartGame}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Почати заново
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

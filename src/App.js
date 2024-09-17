import './App.css';
import DoubleWheatstoneCipher from './components/Square'
import HillCipher from './components/HillCypher'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DoubleWheatstoneCipher/>
        <HillCipher/>
      </header>
    </div>
  );
}

export default App;

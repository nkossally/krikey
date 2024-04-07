import logo from './logo.svg';
import './App.css';


function App() {
  const onClick = async() =>{
    try{
      const resp = await fetch("http://localhost:9000/testAPI")
      const json = await resp.json()
      console.log("json", json)
    } catch(e){

    }

  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={onClick}>test api</button>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

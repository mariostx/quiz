import React from "react";
import "./App.scss";
import Quiz from "components/quiz";
import Menu from "components/menu";

function App() {
  return (
    <div className="App">
      <Menu />
      <Quiz />
      {/* <header className="App-header">
      <Quiz/>
      </header> */}
    </div>
  );
}

export default App;

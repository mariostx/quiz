import React from "react";
import "./App.scss";
import Quiz from "components/quiz";
import Menu from "components/menu";
import QuestionEdit from "components/question/edit";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });
  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <div className="App">
          <Menu />
          {/* <QuestionEdit /> */}
          <div>
        {/* <ul>
          <Link to="/quiz">Quiz Game</Link>
          <Link to="/question">Question Edit</Link>
        </ul> */}
      </div>
        <Switch>
          <Route exact path="/">
            <Quiz />
          </Route>
          <Route exact path="/quiz">
            <Quiz />
          </Route>
          <Route exact path="/question/new">
            <QuestionEdit />
          </Route>
        </Switch>
        </div>
        </ThemeProvider>
    </Router>
  );
}

export default App;

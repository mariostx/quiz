import React from "react";
import "./App.scss";
import Quiz from "pages/quiz";
import Menu from "components/Menu";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import QuestionAddNew from "pages/questions/new";
import { ToastContainer } from "react-toastify";

function App() {
  const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });
  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <div className='App'>
          <Menu />
          <div></div>
          <Switch>
            <Route exact path='/'>
              <Quiz />
            </Route>
            <Route exact path='/quiz'>
              <Quiz />
            </Route>
            <Route exact path='/question/new'>
              <QuestionAddNew />
            </Route>
          </Switch>
        </div>
      </ThemeProvider>
      <ToastContainer />
    </Router>
  );
}

export default App;

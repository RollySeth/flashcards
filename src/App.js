import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import SignIn from "./SignIn";
import CardsetEdit from "./CardsetEdit";
import CardsetAnswer from "./CardsetAnswer";
import NewCardSet from "./NewCardSet";
import NoMatch from "./NoMatch";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/" component={SignIn} />
            <Route path="/set/yours/:urlString/edit" component={CardsetEdit} />
            <Route path="/set/yours/:urlString/" component={CardsetAnswer} />
            <Route path="/set/:urlString/" component={CardsetAnswer} />
            <Route path="/new" component={NewCardSet} />
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;

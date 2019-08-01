import React, { Component } from 'react';
import './App.css';
import Cmd from "./components/Cmd";
// import Login from './components/Login'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      // url : "http://10.0.1.69:8080"
      url : "http://awman-39723.portmap.io:39723"
    }
  }

  render() {
    return (
      <div className="App">
        <Cmd url = {this.state.url}></Cmd>
        {/* <Login></Login> */}
      </div>
    );
  }
}

export default App;

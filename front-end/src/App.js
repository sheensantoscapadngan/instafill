import React, { useState, useEffect, Component } from 'react';
import './App.css';
import {Button, Navbar} from './components/common';
import {BrowserRouter as Router, Link, Switch, Route} from 'react-router-dom';

//auth
import {signInWithGoogle,signOut} from './services/firebase'

//Pages
import MainPage from './pages/MainPage';
import CreateMaster from './pages/CreateMaster.jsx';
import UserProvider from './contexts/UserProvider.js'
import {userContext} from './contexts/UserProvider.js'

class App extends Component {

  render(){
    return (  
    
      /*
      <UserProvider>
        <div className="App">
            <button className="login-provider-button" onClick={signInWithGoogle}>SIGN IN</button>
            <button className="logout-provider-button" onClick={signOut}>SIGN OUT</button>
        </div>
    
      </UserProvider>
      */

      <UserProvider>
        <Router>
        
          <div className="MainPage">
          <Navbar/>
          <Route exact path='/' component={MainPage}/>
          </div>
          <Switch>
        <div className="masterx">
            <Route exact path='/createMaster' component={CreateMaster}/>
            </div>
          </Switch>
      
        </Router>
      </UserProvider>
    
    );
  }

}

export default App;

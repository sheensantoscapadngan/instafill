import React, { useState, useEffect, Component,useContext } from 'react';
import './App.css';
import {Navbar} from './components/common';
import {BrowserRouter as Router, Link, Switch, Route, useLocation} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
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
    
          <AnimatePresence exitBeforeEnter>
          <Switch>
          <Route exact path='/' component={MainPage} className="MainPage"/>
          <Route exact path='/createMaster' component={CreateMaster}/>
          </Switch>
          </AnimatePresence>

        </Router>
    </UserProvider>
  

    );
  }

}

export default App;

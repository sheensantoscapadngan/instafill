import React, { useState, useEffect, Component,useContext } from 'react';
import './App.css';
import {Navbar} from './components/common';
import {BrowserRouter as Router, Link, Switch, Route, useLocation} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
//auth
import {signInWithGoogle,signOut} from './services/firebase'

//Pages
import MainPage from './pages/MainPage';
import CreateMaster from './pages/CreateMaster.js';
import UserProvider from './contexts/UserProvider.js'
import EditPDF from './pages/EditPDF';
import {userContext} from './contexts/UserProvider.js'

import Paypal from './services/Paypal.js'

function App(){
  const [checkOut,setCheckOut] = useState(0);
    return (  

      /*
      <UserProvider>
        <div className="App">
          {checkOut ? (
            <Paypal></Paypal>
          ) : (
          <button onClick={()=>{
            setCheckOut(true)
          }}>
            Checkout 
          </button>
          )}
        </div>  
      </UserProvider>
      */

      <UserProvider>
        <Router>
    
          <AnimatePresence exitBeforeEnter>
          <Switch>
          <Route exact path='/' component={MainPage} />
          <Route exact path='/createMaster' component={CreateMaster}/>
          <Route exact path='/editPDF' component={EditPDF}/>
          </Switch>
          </AnimatePresence>

        </Router>
    </UserProvider>

    );
  
};

export default App;

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
import EditPDF from './pages/EditPDF';
import {UserContext} from './contexts/UserProvider.js'
import Paypal from './services/Paypal.js'
import {attachFillerListener} from "./services/firebase"

function App(){
  const [checkOut,setCheckOut] = useState(0);

  let user = useContext(UserContext)
  const [fillerCount,setFillerCount] = useState(0)
  const [pdfFile,setPdfFile] = useState(10)

  console.log("PDF FILE IN APP.JS",pdfFile)

  if(user != null){
    attachFillerListener(user.email,setFillerCount)
  }
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
      <Router>
          <AnimatePresence exitBeforeEnter>
          <Switch>
          <Route exact path='/'>
            <MainPage fillerCount={fillerCount} setPdfFile={setPdfFile}/>
          </Route>
          <Route exact path='/createMaster' >
            <CreateMaster fillerCount={fillerCount}/>
          </Route>
          <Route exact path='/editPDF'>
            <EditPDF fillerCount={fillerCount} pdfFile={pdfFile}/>  
          </Route>
          </Switch>
          </AnimatePresence>
      </Router>
    );
  
};

export default App;

import React, { Component,useContext,useState} from 'react';
import './Counter.css';
import {UserContext} from '../../../contexts/UserProvider.js';
import { addTopupFillers } from '../../../services/firebase';

function Counter(props){
    //increase value of filler
    let user = useContext(UserContext)
    let fillerCount = props.fillerCount

    if(user != null){
        return(
            <div className="counter">
                <h3>Filler: {fillerCount}</h3>
            </div>
        );
    }else{
        return(
            <div className="counter"></div>
        )
    }
    
}

export default Counter;
import React, { Component } from 'react';
import './Counter.css';
class Counter extends Component{
    constructor(props){
        super(props);
        this.state = {
            count: 5
        }
    }

    //increase value of filler
    increment = () => {
        this.setState({count: this.state.count + 1 })
    }
    //decrease value of filler
    decrement = () => {
        this.setState({count: this.state.count - 1 })
    }

    render(){
        return(
            <div className="counter">
                <h3>Filler: {this.state.count}</h3>

            </div>
        );
    }
}

export default Counter;
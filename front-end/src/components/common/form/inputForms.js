import React, { Component } from 'react'
import './inputForms.css'

class InputForm extends Component {

    handleTextChange = (event) => {
        var smallLabels = ""
        if (this.props.smallLabel != undefined){
            smallLabels = this.props.smallLabel
        }
        this.props.parentCallback(this.props.label+smallLabels+"&#!::!#&"+event.target.value);
    }
    
    render(){

        var val = undefined;

        if (this.props.defaults == undefined){
            val = this.props.defaults;
        }

        return(
            <div>
                <p className={this.props.work}>{this.props.label}</p>
                <input type="text" className={this.props.size} onChange={this.handleTextChange} value={this.props.defaults}></input>
            </div>
        
        );

    }
}

export default InputForm
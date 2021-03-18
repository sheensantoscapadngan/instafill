import React, {Component, useState} from 'react'
import './CreateMaster.css'
import {Navbar} from '../components/common';
import InputForm from '../components/common/form/inputForms';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {AnimatePresence, motion} from 'framer-motion';
import { library } from '@fortawesome/fontawesome-svg-core';
import {faTrash, faPlus} from '@fortawesome/free-solid-svg-icons';

library.add(faTrash, faPlus)


class CreateMaster extends Component{



    constructor(props) {
        super(props);
        this.state = {   
            data : {},
            newLabel : "",
            newRows : [],
        }
    }

    //function to add the data to this state
    handleText = (childData) => {
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                [childData.split("&#!::!#&")[0]] : [childData.split("&#!::!#&")[1]][0]
            }       
        }));
    }

    //download file
    downloadDocument = () => {
        var dataKeys = Object.keys(this.state.data);
        var dataValues = Object.values(this.state.data);
        var stringData = "";
        dataKeys.map(function(key, index){
            if (dataValues[index] != ""){
                stringData+=(key+":"+dataValues[index])+";";
            } 
        })
        if (stringData != "") {
            const element = document.createElement("a");
            const file = new Blob([stringData], {type: 'text/plain;charset=utf-8'});
            element.href = URL.createObjectURL(file);
            element.download = "MasterDocument.txt";
            document.body.appendChild(element);
            element.click();
        }
        else {
            alert("No Information")
        }
    }

    //function to add new label to state
    handleNewLabel = (event) => {
        this.setState({
            newLabel : event.target.value,
        })
    }

    //function to add new rows 
    handleAddMoreRow = () => {
        if (this.state.newLabel != ""){
            this.state.newRows.push(this.state.newLabel);
            this.setState({
                newLabel : "",
            })
        }       
    }

    handleDeleteRow = (index) => {
        //deletes the key of the new row if present
        const copyData = {...this.state.data};
        delete copyData[this.state.newRows[index]];
        this.setState({
            data : copyData,
        })

        //deletes the row in the array
        const copyNewRows = [...this.state.newRows];
        copyNewRows.splice(index, 1);
        this.setState({
            newRows : copyNewRows,
        })

    }

    //when user press enter the row submits
    handleKeyDown = (e) => {
        if (e.key == 'Enter'){
            this.handleAddMoreRow();
        }
    }

    //fix of bug
    handleDefault = (index) => {
        if (this.state.newRows[index] in this.state.data){
            return this.state.data[this.state.newRows[index]];           
        }
        else{           
            return ("");
        }
    }

    render(){
        return(   
            <div>
                <Navbar /> 
            <motion.div
            initial={{opacity: 1, x: "-100vw"}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 1, x: "-100vw"}}
            transition={{type: "spring"}}>
                    
                <div className="createMaster">                 
                    <p className="title">This will be your personal information</p>
                    <div className="flex">
                        <InputForm label="Last Name" size="thirds" parentCallback={this.handleText}/>
                        <InputForm label="Given Name" size="thirds" parentCallback={this.handleText}/>
                        <InputForm label="Middle Name" size="thirds" parentCallback={this.handleText}/>
                    </div>
                    <InputForm label="Street Address" size="whole" parentCallback={this.handleText}/>
                    <InputForm label="Street Address 2" size="whole" parentCallback={this.handleText}/>
                    <div className="flex">
                        <InputForm label="City" size="half" parentCallback={this.handleText}/>
                        <InputForm label="State / Province" size="half" parentCallback={this.handleText}/>
                    </div>
                    <InputForm label="Postal / Zip Code" size="whole" parentCallback={this.handleText}/>
                    <div className="flex">
                        <InputForm label="Work Email" size="half" parentCallback={this.handleText}/>
                        <InputForm label="Personal #" size="half" parentCallback={this.handleText}/>
                    </div>
                    <div className="flex">
                        <InputForm label="Phone #" size="half" parentCallback={this.handleText}/>
                        <InputForm label="Work #" size="half" parentCallback={this.handleText}/>
                    </div>
                    <div className="flex">
                        <InputForm label="Personal Email" size="half" parentCallback={this.handleText}/>
                        <InputForm label="Company" size="half" parentCallback={this.handleText}/>
                    </div>
                    <div className="flex">
                        <div>
                            <p>Birthdate</p>
                            <div className="flex">
                                <InputForm label="" size="small" parentCallback={this.handleText} smallLabel="Month"/>
                                <div className="divisor">
                                    <p>/</p>
                                </div>
                                <InputForm label="" size="small" parentCallback={this.handleText} smallLabel="Day"/>
                                <div className="divisor">
                                    <p>/</p>
                                </div>
                                <InputForm label="" size="smallBigger" parentCallback={this.handleText} smallLabel="Year"/>
                            </div>
                        </div>
                        <div>
                            <p>Sex</p>
                            <InputForm label="" size="small" parentCallback={this.handleText} smallLabel="Sex"/>
                        </div>
                    </div>
                    <div className="flex dynamic">
                        <p className="subscript">Month</p>
                        <p className="subscript">Day</p>
                        <p className="subscript margin">Year</p>
                        <p className="subscript">M / F</p>
                    </div>    
                    {
                        this.state.newRows.map((newLabel, index) => (
                            <div key={index} className="flex">
                                <InputForm label={newLabel} size="whole" parentCallback={this.handleText} defaults={this.handleDefault(index)}/>
                                <button className="btns delete" onClick={() => this.handleDeleteRow(index)}>
                                    <FontAwesomeIcon icon="trash" color="grey" size="2x"/>
                                </button>
                            </div>
                        ))
                    }           
                    <div className="flex add">
                        <button className="btns addRow" onClick={this.handleAddMoreRow}>
                            <FontAwesomeIcon icon="plus" color="#4863A0" className="plusSign"/><p>Add more Rows</p>
                        </button>
                        <input placeholder="Enter Label Here" value={this.state.newLabel} onChange={this.handleNewLabel} onKeyDown={this.handleKeyDown}></input>
                    </div>
                    <button className="btns download" onClick={this.downloadDocument}><p>Download Document</p></button>
                </div>         
            </motion.div>
            </div>
        );
    }
}

export default CreateMaster
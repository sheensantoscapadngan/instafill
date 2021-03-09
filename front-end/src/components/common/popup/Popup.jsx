import React from 'react'
import './Popup.css';
function Popup(props){
    return (props.trigger) ? (
        <div className="popup">
            <div className="inner-popup">
                <button className="btn-close" onClick={() => props.setTrigger(false)}>close</button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup
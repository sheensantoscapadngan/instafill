import React from 'react'
import './Popup.css';
import Button from '../button/Button'
function Popup(props){
    return (props.trigger) ? (
        <div className="popup">
            <div className="inner-popup">
                <Button  type="button" buttonSize="btn--medium" buttonStyle="btn--danger--solid" onClick={() => props.setTrigger(false)}>close</Button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup;
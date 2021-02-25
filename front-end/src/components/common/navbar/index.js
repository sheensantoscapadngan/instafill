import React from 'react';
import { Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink } from "./Navbar";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faTwitter,
    faInstagram,
    faFacebook
} from '@fortawesome/free-brands-svg-icons';
const Navbar = () =>{
    return(
    <>
        <Nav>
        <NavLink to="/home">
            <h1> InstaFill </h1>
        </NavLink>
        <Bars/>
        
            <NavLink to="/home" activeStyle>
                Form Magic!
            </NavLink>

        
        {/*<NavBtn>
            <NavBtnLink to="/signin">Sign in</NavBtnLink>
        </NavBtn>*/}
        <NavMenu>
           <NavLink to="/twitter" activeStyle>
                <FontAwesomeIcon icon={faTwitter} size='2x'/>
            </NavLink>
            <NavLink to="/instagram" activeStyle>
                <FontAwesomeIcon icon={faInstagram} size='2x'/>
            </NavLink>
            <NavLink to="/facebook" activeStyle>
                <FontAwesomeIcon icon={faFacebook} size='2x'/>
            </NavLink>
        </NavMenu>
        </Nav>
    </>

    );

};

export default Navbar;
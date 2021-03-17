import React from 'react';
import { Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink } from "./Navbar.jsx";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faTwitter,
    faInstagram,
    faFacebook
} from '@fortawesome/free-brands-svg-icons';
import Boop from '../boop';
import UserIcon from '../user profile/userIcon';
import UserProvider from '../../../contexts/UserProvider.js'

const Navbar = () =>{
    return(
    <>
        <Nav>
        <UserProvider>
            <NavLink to="/">
                <h1> InstaFill </h1>
            </NavLink>
            <Bars />
            <NavLink to="/" >
                Form Magic!
            </NavLink>
            <NavMenu>
                
            <a href="https://twitter.com" target="_blank">
                
                    <Boop className="style" rotation={30} timing={200}><FontAwesomeIcon icon={faTwitter} size='2x' color="white"/></Boop>
                    
                </a>
                
                <a href="https://instagram.com" target="_blank">
                
                    <Boop rotation={30} timing={200}><FontAwesomeIcon icon={faInstagram} size='2x' color="white"/></Boop>
                    
                </a>
                <a href="https://facebook.com" target="_blank">
                
                    <Boop rotation={30} timing={200}><FontAwesomeIcon icon={faFacebook} size='2x' color="white"/></Boop>
                    
                </a>
            
                <UserIcon/>
            </NavMenu>
        </UserProvider>
        </Nav>
    </>

    );

};



export default Navbar;

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
            <NavLink to="/" activeStyle>
                Form Magic!
            </NavLink>
            <NavMenu>
                <NavLink to="/" activeStyle>
                    <Boop className="style" rotation={30} timing={200}><FontAwesomeIcon icon={faTwitter} size='2x'/></Boop>
                </NavLink>
                <NavLink to="/" activeStyle>
                    <Boop rotation={30} timing={200}><FontAwesomeIcon icon={faInstagram} size='2x'/></Boop>
                </NavLink>
                <NavLink to="/" activeStyle>
                    <Boop rotation={30} timing={200}><FontAwesomeIcon icon={faFacebook} size='2x'/></Boop>
                </NavLink>
                <UserIcon/>
            </NavMenu>
        </UserProvider>
        </Nav>
    </>

    );

};



export default Navbar;

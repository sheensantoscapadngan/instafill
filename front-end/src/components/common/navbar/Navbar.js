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

const Navbar = () =>{
    return(
    <>
        <Nav>
            <NavLink to="/">
                <h1> InstaFill </h1>
            </NavLink>
            <Bars />
            <NavLink to="/" activeStyle>
                Form Magic!
            </NavLink>
            <NavMenu>
                <NavLink to="/twitter" activeStyle>
                    <Boop className="style" rotation={30} timing={200}><FontAwesomeIcon icon={faTwitter} size='2x'/></Boop>
                </NavLink>
                <NavLink to="/instagram" activeStyle>
                    <Boop rotation={30} timing={200}><FontAwesomeIcon icon={faInstagram} size='2x'/></Boop>
                </NavLink>
                <NavLink to="/facebook" activeStyle>
                    <Boop rotation={30} timing={200}><FontAwesomeIcon icon={faFacebook} size='2x'/></Boop>
                </NavLink>
                <UserIcon/>
            </NavMenu>
        </Nav>
    </>

    );

};



export default Navbar;

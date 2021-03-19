import React, { useState,useEffect,useContext} from 'react';
import './userIcon.css';
import { ReactComponent as Profile } from '../../../icons/user.svg';
import { ReactComponent as Log_out } from '../../../icons/logout.svg';
import { ReactComponent as Sign_in } from '../../../icons/login.svg';
import {signInWithGoogle,signOut,checkIfUserExists} from '../../../services/firebase';
import {UserContext} from '../../../contexts/UserProvider.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faSignInAlt, faSignOutAlt)


function UserIcon() {
  return (
    <NavItem icon={<Profile/>}>
        <Menu />
    </NavItem>
  );
}

function NavItem(props) {
  const [open, setOpen] = useState(false);
  return(
    <span className='icon-circle' onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <li className='nav-item'>
        <a href="#" className='icon-button'>
          { props.icon }
        </a>
        {open && props.children}
      </li>
    </span>
    );
};

function Menu() {
  const [userName, setUserName] = useState('Guest');
  const [description, setDescription] = useState('Welcome guest!');
  const [icon, setIcon] = useState(<FontAwesomeIcon icon='sign-in-alt' rotate-90 size='2x' color='black'/>);
  const [sign, setSign] = useState(true);
  const [iconText, setIconText] = useState('Sign in');
  let user = useContext(UserContext)

  useEffect(()=>{
    if(user != null){
      setUserName(user.displayName)
      setDescription(user.email)
      setIcon(<FontAwesomeIcon icon='sign-out-alt' rotate-90 size='2x' color='black'/>)
      setIconText('Log out')
      setSign(false)
    }
  })

  return(
    <div className='menu-dropdown'>
      <a href="#" className='profile-menu'>
        <div className='icon-space'>
          <span className='icon-circle-small'><span className='icon-button-small'>{ <Profile />}</span></span>
        </div>
        <div className='name-space'>
          <div className='name'>{userName}</div>
          <div className='description'>{description}</div>
        </div>
      </a>
      <div className='logout-menu' onClick={sign ? signInWithGoogle: signOut}>
        <span className='logout-icon'>{icon}</span>
        <span className='logout-text'>{iconText}</span>
      </div>
    </div>
  );
};
export default UserIcon;

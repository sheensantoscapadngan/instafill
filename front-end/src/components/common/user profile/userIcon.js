import React, { useState } from 'react';
import './userIcon.css';
import { ReactComponent as Profile } from '../../../icons/user.svg';
import { ReactComponent as Log_out } from '../../../icons/logout.svg';

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
    <span className='icon-circle' onClick={() => setOpen(!open)}>
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
  const [userName, setUserName] = useState(' Guest');
  const [description, setDescription] = useState('Lorem Ipsum')
  return(
    <div className='menu-dropdown'>
      <a href="#" className='profile-menu'>
        <div className='icon-space'>
          <span className='icon-circle-small'><span className='icon-button-small'>{ <Profile/>}</span></span>
        </div>
        <div className='name-space'>
          <div className='name'>{userName}</div>
          <div className='description'>{description}</div>
        </div>
      </a>
      <div className='logout-menu'>
        <span className='logout-icon'>{<Log_out/>}</span>
        <span className='logout-text'>Log out</span>
      </div>
    </div>
  );
};
export default UserIcon;
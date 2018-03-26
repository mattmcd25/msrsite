import React from 'react';
import { Link } from 'react-router-dom';

export default function Navigation(props) {
    return (
      <div className="navigation">
          <NavButton to="/">Home</NavButton>
          <NavButton to="/new">New Member</NavButton>
          <NavButton to="/query">Advanced Search</NavButton>
      </div>
    );
}

function NavButton(props) {
    return (
        <Link to={props.to}>
            <button className="navbutton">
                {props.children}
            </button>
        </Link>
    );
}
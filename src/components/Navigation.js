import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, Subheader, Divider, FontIcon } from 'react-md';
import { logout } from "./AuthMan";
import {isAdmin} from "../index";

const GENERAL = {
    head:"General",
    children: [
        {name:"View Members", to:"/", icon:"home", desc:"View basic information"},
        {name:"Add Member", to:"/new", icon:"add", desc:"Add a new member"},
        {name:"Batch Add Training", to:"/training", icon:"assignment", desc:"Record a group training"},
        {name:"Advanced Search", to:"/query", icon:"search", desc:"Search by skills or work"}
    ]
};

const ADMIN = {
    head:"Administrative",
    children: [
        {name:"Admin Settings", to:"/manage", icon:"settings", desc:"Edit skills or languages"}
    ]
};

// const MISC = {
//     head:"Miscellaneous",
//     children: [
//         {name:"Help", to:"/help", icon:"help", desc:"Get help with this app"}
//     ]
// };

const ACCOUNT = {
    head:"Account",
    children: [
        {name:"Sign Out", icon:'lock_outline', desc:'Sign out of the app', action:logout}
    ]
};

const NAV_ITEMS = () => {
    if(isAdmin())
        return [GENERAL, ADMIN, /*MISC,*/ ACCOUNT];
    else {
        let limGeneral = {
            ...GENERAL,
            children: [
                GENERAL.children[0], GENERAL.children[3]
            ]
        };
        return [limGeneral, /*MISC,*/ ACCOUNT];
    }
};

export default function Navigation(props) {
    return (
      <List className="navigation">
          {NAV_ITEMS().map(section => (
              <div key={section.head}>
                  <Subheader primaryText={section.head}/>
                  {section.children.map(it => <NavItem key={it.name} {...it}/>)}
                  <Divider />
              </div>
          ))}
      </List>
    );
}

function NavItem(props) {
    let li = (
        <ListItem className="navItem"
                  leftIcon={<FontIcon>{props.icon}</FontIcon>}
                  primaryText={props.name}
                  secondaryText={props.desc}
                  onClick={props.action}
        />
    );

    return props.to ? <Link className="navItem" to={props.to}>{li}</Link> : li;
}
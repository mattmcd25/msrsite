import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, Subheader, Divider, FontIcon } from 'react-md';

const gen_items = [
    {name:"View Members", to:"/", icon:"home", desc:"View basic information"},
    {name:"Add Member", to:"/new", icon:"add", desc:"Add a new member"},
    {name:"Advanced Search", to:"/query", icon:"search", desc:"Search by skills or work"}
];

const admin_items = [
    {name:"Manage Stuff", to:"/manage", icon:"settings", desc:"Idk admin settings"}
];

export default function Navigation(props) {
    return (
      <List className="navigation">
          <Subheader primaryText="General"/>
          {makeNav(gen_items)}
          <Divider/>
          <Subheader primaryText="Administrative"/>
          {makeNav(admin_items)}
          <Divider/>
      </List>
    );
}

function makeNav(list) {
    return list.map(it => <NavItem {...it}/>);
}

function NavItem(props) {
    return (
        <Link className="navItem" to={props.to}>
            <ListItem className="navItem"
                leftIcon={<FontIcon>{props.icon}</FontIcon>}
                primaryText={props.name}
                secondaryText={props.desc}
            />
        </Link>
    );
}
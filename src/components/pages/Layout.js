import React from 'react'
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import Navigation from "../Navigation";

export default function Layout(props) {
    return (
        <NavigationDrawer
            className="container"
            drawerTitle="MSR Database"
            toolbarTitle={props.title}
            navItems={[<Navigation key="nav"/>]}
        >
            <div className="body">
                {props.children}
            </div>
        </NavigationDrawer>
    );
}
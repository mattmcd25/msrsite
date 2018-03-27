import React from 'react'
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import Navigation from "../Navigation";

export default function Layout(props) {
    return (
        <NavigationDrawer
            className="container"
            drawerTitle="MSR Database"
            toolbarTitle="Welcome to MSR"
            navItems={[<Navigation/>]}
            footer={<p>Login stuff"</p>}
        >
            <div className="body">
                {props.children}
            </div>
        </NavigationDrawer>
    );
}
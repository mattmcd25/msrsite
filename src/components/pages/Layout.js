import React from 'react'
import { NavigationDrawer, Snackbar } from 'react-md';
import Navigation from "../Navigation";

export default function Layout(props) {
    return (
        <NavigationDrawer
            className="container"
            drawerTitle="MSR Database"
            toolbarTitle={props.title}
            toolbarActions={props.actions}
            navItems={[<Navigation key="nav"/>]}
        >
            <div className="body">
                {props.children}
                <Snackbar id="layout" autohide toasts={props.toasts} onDismiss={props.dismissToast}/>
            </div>
        </NavigationDrawer>
    );
}
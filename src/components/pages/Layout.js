import React from 'react'
import { NavigationDrawer, Snackbar, DialogContainer } from 'react-md';
import Navigation from "../Navigation";

export default function Layout(props) {
    let getFromPopup = (field, def=undefined) => props.popups[0] ? props.popups[0][field] : def;

    return (
        <NavigationDrawer
            className="container"
            drawerTitle="MSR Database"
            toolbarTitle={props.title}
            toolbarActions={props.actions}
            navItems={[<Navigation key="nav"/>]}
        >
            <div className="body">
                <DialogContainer id="layout-dialog" visible={props.popups.length > 0} onHide={props.dismissPopup}
                                 title={getFromPopup('title', 'app-dialogs')} actions={getFromPopup('actions')}>
                    {getFromPopup('body', <button onClick={props.dismissPopup}>empty popup</button>)}
                </DialogContainer>

                {props.children}

                <Snackbar id="layout-snackbar" autohide toasts={props.toasts} onDismiss={props.dismissToast}/>
            </div>
        </NavigationDrawer>
    );
}
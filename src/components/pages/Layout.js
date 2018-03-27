import React from 'react'
import NavigationDrawer from 'react-md/lib/NavigationDrawers';

export default function Layout(props) {
    return (
        <NavigationDrawer
            drawerTitle="MSR Database"
            toolbarTitle="Welcome to MSR"
        >
            <div className="body">
                {props.children}
            </div>
        </NavigationDrawer>
    );
}
/*<div className="container">
    <div className="header">
        <div className="header-title">MSR Database</div>
        <Navigation />
    </div>

    <div className="body">
        {props.children}
    </div>

    <div className="footer">

    </div>
</div>*/
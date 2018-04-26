import React from 'react';
import { Grid } from 'react-md';
import ExpandingCard from '../displays/ExpandingCard';
import ConstantTableElement from '../displays/ConstantTableElement';
import AccountManagerElement from '../displays/AccountManagerElement';

const settingCards = (props) => [
    {
        title:'Modify Available Skills',
        subtitle:'Add to or remove from the pre-set list of skills.',
        icon:'format_paint',
        children: (
            <ConstantTableElement {...props} table="Skill" pk="NAME"/>
        )
    },
    {
        title:'Modify Available Languages',
        subtitle:'Add to or remove from the pre-set list of languages.',
        icon:'language',
        children: (
            <ConstantTableElement {...props} table="Language" pk="LANGUAGE"/>
        )
    },
    {
        title:'Modify Recruitment Sites',
        subtitle:'Add to or remove from the pre-set list of recruitment sites.',
        icon:'map',
        children: (
            <ConstantTableElement {...props} table="Site" pk="ABBR"/>
        )
    },
    {
        title:'Modify Certificate Types',
        subtitle:'Add to or remove from the pre-set list of certificate types.',
        icon:'school',
        children: (
            <ConstantTableElement {...props} table="Certificate" pk="TYPE"/>
        )
    },
    {
        title:'Account Management',
        subtitle:'Change the access levels of users of this app.',
        icon:'person',
        children: (
            <AccountManagerElement {...props}/>
        )
    }
];

export default class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setTitle("Admin Settings");
    }

    render() {
        return (
            <div className="admin">
                <Grid>
                    {settingCards(this.props).map(sc => <ExpandingCard key={sc.title} {...sc}/>)}
                </Grid>
            </div>
        );
    }
}
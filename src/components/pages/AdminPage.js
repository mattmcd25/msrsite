import React from 'react';
import { Grid } from 'react-md';
import ExpandingCard from '../displays/ExpandingCard';
import ConstantTableElement from '../displays/ConstantTableElement';
import CheckTableElement from "../displays/CheckTableElement";
import {getUserPermissions} from "../../data/databaseManager";
import {CircularProgress} from 'react-md';

const settingCards = (props, state) => [
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
        subtitle:'Add to or remove from the pre-set list of certificate types.',
        icon:'school',
        children: (
            <CheckTableElement edit title="Account Management" data={state.users} onChange={console.log('save')}/>
        )
    }
];

export default class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setTitle("Admin Settings");
    }

    componentWillMount(){
        this.setState({loaded: false});
        getUserPermissions().then(r => {
            this.setState({
                users: r,
                loaded: true
            });
        });
    }

    render() {
        return (

            <div className="admin">
                <Grid>
                    {
                        this.state.loaded ?
                            settingCards(this.props, this.state).map(sc => <ExpandingCard key={sc.title} {...sc}/>) :
                            <CircularProgress/>
                    }
                </Grid>
            </div>
        );
    }
}
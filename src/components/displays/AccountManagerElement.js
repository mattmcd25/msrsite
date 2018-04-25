import React from "react";
import IssueButton from '../IssueButton';
import { FontIcon, CircularProgress } from 'react-md';
import { getUserPermissions, saveUserPermissions } from "../../data/databaseManager";
import CheckTableElement from './CheckTableElement';
import {getUserID} from "../AuthMan";

const levelFrom = perms => {
    if(perms.admin) return 'admin';
    else if(perms.basic) return 'user';
    else return 'newUser';
};

const updateRadios = key => {
    let allFalse = {'none':false, 'basic':false, 'admin':false};
    return {
        ...allFalse,
        [key]:true
    };
};

export default class AccountManager extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { loading: true };
    }

    componentDidMount() {
        getUserPermissions().then(r => {
            this.setState({
                users: r,
                pastUsers: r,
                loading: false
            });
        });
    }

    onChange = (email, key, value) => {
        let newChecks = updateRadios(key);
        this.setState(prevState => ({
            users: {
                ...prevState.users,
                [email]: {
                    ...prevState.users[email],
                    ...newChecks
                }
            }
        }));
    };

    save = () => {
        this.setState({ loading: true });
        this.props.toast({text:`Saving Users...`});
        let promises = [];

        Object.keys(this.state.users).forEach(email => {
            let newUser = this.state.users[email];
            let oldUser = this.state.pastUsers[email];

            if(JSON.stringify(newUser) !== JSON.stringify(oldUser)) {
                let {user_id, ...perms} = newUser;
                let newLevel = levelFrom(perms);
                promises.push(saveUserPermissions({user_id, newLevel}));
            }
        });

        Promise.all(promises)
            .then(r => {
                let newUsers = {...this.state.users, ...r[0]};
                this.setState({ users:newUsers, pastUsers:newUsers, loading:false });
            })
            .then(() => this.props.toast({text:'Saved!'}));
    };

    render() {
        let issues = [];
        // !this.state.loading && Object.values(this.state.users).forEach(user => {
        //     if (user.admin && !user.basic)
        //         issues.push({custom: true, message: `${user.email} must also have basic permissions to be an admin!`});
        // });
        return (
            this.state.loading ? <CircularProgress id='accountManager'/> :
                <div>
                    <label style={{'paddingRight': '80%'}}/>
                    <IssueButton flat primary onClick={this.save} issues={issues} position="left"
                                 iconChildren={<FontIcon>save</FontIcon>}>
                        Save
                    </IssueButton>
                    <CheckTableElement edit exclusive title="Account Management" data={this.state.users} onChange={this.onChange}
                                       shouldDisable={ID => ID===getUserID()}/>
                </div>
        );
    }
}
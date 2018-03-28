import React from 'react';
import { Link } from 'react-router-dom';
import { insert } from '../../data/databaseManager';

export default class NewMemberPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setTitle("Add MemberTableRow");
        this.state = {
            FIRSTNAME: "",
            SURNAME: "",
            MEMBERSHIP: "",
            MOBILE: "",
            ADDRESS: "",
            MARITAL: ""
        };
    };

    handleSubmit = (e) => {
        console.log("handleSubmit " + this.state.FIRSTNAME);
        insert("Member", this.state).then(res => console.log(res));
    };

    handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    render() {
        return (
            <div className="newMemberPage">
                <label>New Member</label><br/>
                <label>
                    First Name
                    <input maxLength="100" value={this.state.name} onChange={this.handleInputChange} type="text" name="FIRSTNAME"/>
                </label><br/>
                <label>
                    Surname
                    <input maxLength="100" value={this.state.surname} onChange={this.handleInputChange} type="text" name="SURNAME"/>
                </label><br/>
                <label>
                    Membership
                    <input maxLength="20" value={this.state.membership} onChange={this.handleInputChange} type="text" name="MEMBERSHIP"/>
                </label><br/>
                <label>
                    Phone
                    <input maxLength="10" value={this.state.phone} onChange={this.handleInputChange} type="number" name="MOBILE"/>
                </label><br/>
                <label>
                    Address
                    <input maxLength="100" value={this.state.address} onChange={this.handleInputChange} type="text" name="ADDRESS"/>
                </label><br/>
                <label>
                    Marital
                    <input maxLength="10" value={this.state.marital} onChange={this.handleInputChange} type="text" name="MARITAL"/>
                </label><br/>
                <button name="insert" onClick={this.handleSubmit}>
                    Add Member
                </button><br/>
                <Link to="/">Home</Link>
            </div>
        );
    }
}
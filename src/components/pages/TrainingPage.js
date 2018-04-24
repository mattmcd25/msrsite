import React from 'react';
import { CircularProgress, Grid, Cell } from 'react-md';
import IssueButton from '../IssueButton';
import {getAll, insert} from '../../data/databaseManager';
import { CONSTANTS, HEADERS } from "../../index";
import { dataLengthIssues } from "../displays/DisplayUtils";
import {dictFromList, intersection, makeDict} from "../../Utils";
import { PropsAndChipsCard } from "../displays/Cards";
import ChipListElement from "../displays/ChipListElement";

export default class TrainingPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setTitle("Batch Add Training");
        this.state = {
            training: makeDict(Object.keys(HEADERS['Training']).splice(2, 2)),
            skills: [],
            successMembers: [],
            failMembers: [],
            loading: true
        };
    };

    componentDidMount = () => {
        let name = member => ({[`${member.FIRSTNAME} ${member.SURNAME} (M# ${member.MEMBERSHIP})`]:member.ID});
        getAll('Member').then(ms => this.setState({ people: Object.assign({}, ...ms.map(name)), loading: false }));
    };

    handleSubmit = () => {
        this.setState({ loading: true });
        this.props.toast({text:'Adding training...'});

        let promises = [];

        this.saveTraining(this.state.successMembers, true, promises);
        this.saveTraining(this.state.failMembers, false, promises);

        Promise.all(promises)
            .then(() => this.props.toast({ text:'Added!' }))
            .then(() => this.props.history.push('/'));
    };

    saveTraining = (set, SUCCEEDED, promises) => {
        set.forEach(mem => {
            let ID = this.state.people[mem];
            promises.push(insert("Training", {ID, ...this.state.training, SUCCEEDED})
                .then(res => {
                    let TRAININGID = res.recordset[0]['TRAININGID'];
                    this.state.skills.forEach(NAME => promises.push(insert('Training_Skill', {TRAININGID, NAME})));
                }));
        });
    };

    handleInputChange = (e) => {
        let target = e.target;
        let value = target.value;
        let name = target.name;

        console.log(name, value);
        this.setState(prevState => ({
            training: {
                ...prevState.training,
                [name]: value
            }
        }));
    };

    render() {
        let issues = dataLengthIssues([this.state.training], 'Training');
        let intersect = intersection(this.state.successMembers, this.state.failMembers);
        if(intersect.length > 0) issues.push({custom:true,message:`${intersect[0]} cannot both pass and fail the training!`});
        let skDict = dictFromList(CONSTANTS['Skill'], 'NAME');
        let chips = CONSTANTS['Skill'].map(s => s.NAME);
        let people = this.state.people && Object.keys(this.state.people);
        return (
                <Grid className="trainingPage">
                    {this.state.loading ?
                        <Cell size={12}><CircularProgress id="trainingPage"/></Cell> :
                        <PropsAndChipsCard edit title='Training' data={this.state.training} table='Training'
                                           onChange={this.handleInputChange} tips={skDict} list={this.state.skills}
                                           acData={{chips}}
                                           listHeader="Skills Learned" updateList={li => this.setState({ skills: li})}
                                           footer={[
                                               <br/>,<b>People that Completed Training:</b>,<br/>,
                                               <ChipListElement edit title="People that Completed Training"
                                                                acData={people} list={this.state.successMembers}
                                                                updateList={li => this.setState({ successMembers: li })}/>,
                                               <br/>,<b>People that Failed Training:</b>,<br/>,
                                               <ChipListElement edit title="People that Failed Training"
                                                                acData={people} list={this.state.failMembers}
                                                                updateList={li => this.setState({ failMembers: li })}/>,
                                               <label className="vertSpacer"/>,
                                               <IssueButton raised primary issues={issues} onClick={this.handleSubmit}
                                                            position="right">
                                                   Batch Add Training
                                               </IssueButton>
                                           ]}/>
                    }
                </Grid>
        );
    }
}
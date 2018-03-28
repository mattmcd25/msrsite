import React from 'react';
import { HEADERS as headers } from "../index";
import ChipList from './displays/ChipList';
import PropsWithList from './displays/PropsWithList';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardText, CardActions, Button, Grid, Cell } from 'react-md';

export default class MemberDisplay extends React.PureComponent {
    render() {
        return (
            <Grid className="member-display">
                <Cell size={4}>
                    <Card className="member-card">
                        <CardTitle className="card-action-title" title={this.props.mem.FIRSTNAME + " " + this.props.mem.SURNAME}>
                            <CardActions>
                                <Link to={`/member/${this.props.mem.ID}/edit`}>
                                    <Button secondary raised>Edit</Button>
                                </Link>
                            </CardActions>
                        </CardTitle>
                        <CardText>
                            {headers['Member'].map((f, i, a) => {
                                return (f !== "ID") && (
                                    <div key={i}>
                                        <label>{f + ": " + this.props.mem[f]}</label>
                                        <br/>
                                    </div>
                                );
                            })}
                        </CardText>
                    </Card>
                </Cell>
                <Cell size={4}>
                    <ChipList name="Skills" children={this.props.skills}/>
                </Cell>
                {Object.keys(this.props.work).map(work => {
                    let val = this.props.work[work];
                    return (
                        <Cell size={4}>
                            <PropsWithList key={work} name={work} subtitle="Work Experience"
                                           list={val.SKILLS} data={{...val}}/>
                        </Cell>
                    );
                })}
            </Grid>
        );
    }
}
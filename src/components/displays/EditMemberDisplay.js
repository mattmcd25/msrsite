import React from 'react';
import { BlankCard, ChipListCard, PropsAndChipsCard, PropListCard, CheckTableCard } from "./Cards";
import { Grid, Button } from 'react-md';
import { CONSTANTS } from "../../index";
import { dictFromList } from "../../Utils";

export default function EditMemberDisplay(props) {
    let skills = CONSTANTS['Skill'].map(s => s.NAME);
    let skDict = dictFromList(CONSTANTS['Skill'], 'NAME');
    let langDict = dictFromList(CONSTANTS['Language'], 'LANGUAGE');
    let langs = CONSTANTS['Language'].map(s => s.LANGUAGE);
    return (
        <Grid className="member-display">
            {(() => {
                let {ID, ...rest} = props.mem;
                return (<PropListCard edit title={rest.FIRSTNAME + " " + rest.SURNAME} data={rest}
                                      onChange={props.onMemChange}/>)
            })()}

            {Object.keys(props.work).map(workID => {
                let {WORKID, SKILLS, ...rest} = props.work[workID];
                return (
                    <PropsAndChipsCard edit key={workID} title={rest.EMPLOYER} subtitle="Work Experience"
                                       list={SKILLS} data={rest} listHeader="Skills Learned"
                                       updateList={(list) => props.setWorkSkills(workID, list)} acData={skills}
                                       onChange={(evt) => props.onWorkChange(workID, evt)} tips={skDict}
                                       actions={<Button raised className="redButton"
                                                        onClick={() => props.removeWork(workID)}>
                                                    Delete
                                                </Button>}/>
                );
            })}

            <ChipListCard edit title="Other Skills" acData={skills} tips={skDict}
                          list={props.skills} updateList={props.setSkills}/>

            {Object.keys(props.certs).map(type => {
                let {ID, ...rest} = props.certs[type];
                return <PropListCard edit title={rest.TYPE} subtitle="Certificate" data={rest}
                                     onChange={evt => props.onCertChange(type, evt)} key={type}
                                     actions={<Button raised className="redButton"
                                                      onClick={() => props.removeCert(type)}>
                                                    Delete
                                              </Button>}/>
            })}

            <CheckTableCard edit title="Language Proficiencies" data={props.langs} onChange={props.setLangs}
                            acData={langs} add={props.addLang} remove={props.removeLang} tips={langDict}/>

            <BlankCard title="Other Actions">
                <Button raised primary onClick={props.addWork}>
                    Add Work Experience
                </Button>
                <label className="vertSpacer"/>
                <Button raised primary onClick={props.addCert}>
                    Add New Certificate
                </Button>
                <label className="vertSpacer"/>
                <Button raised className="redButton" onClick={props.removeMember}>
                    Delete This Member
                </Button>
            </BlankCard>
        </Grid>
    );
}
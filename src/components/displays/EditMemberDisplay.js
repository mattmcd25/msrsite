import React from 'react';
import { BlankCard, ChipListCard, PropsAndChipsCard, PropListCard, CheckTableCard } from "./Cards";
import { Grid, Button, FontIcon } from 'react-md';
import { CONSTANTS, WORKSTATUS, WORKTYPE, STATUS } from "../../index";
import { dictFromList } from "../../Utils";

let chips, skDict, langs, langDict;

export default function EditMemberDisplay(props) {
    chips = CONSTANTS['Skill'].map(s => s.NAME);
    skDict = dictFromList(CONSTANTS['Skill'], 'NAME');
    langDict = dictFromList(CONSTANTS['Language'], 'LANGUAGE');
    langs = CONSTANTS['Language'].map(s => s.LANGUAGE);
    return (
        <Grid className="member-display">
            {(() => {
                let {ID, ...rest} = props.mem;
                return (<PropListCard edit title={rest.FIRSTNAME + " " + rest.SURNAME} data={rest}
                                      onChange={props.onMemChange} table='Member'
                                      acData={{SITE:CONSTANTS['Site'].map(s=>s.ABBR),STATUS}}/>)
            })()}

            {jobCards(props, 'work', 'WORKID', "Past Work Experience")}

            {jobCards(props, 'placement', 'PLACEMENTID', "Placement through MSR")}

            {jobCards(props, 'training', 'TRAININGID', "MSR Training Session", 'FIELD')}

            {Object.keys(props.certs).map(type => {
                let {ID, ...rest} = props.certs[type];
                return <PropListCard edit title={rest.TYPE} subtitle="Certificate" data={rest} table='Has_Cert'
                                     onChange={evt => props.onCertChange(type, evt)} key={type}
                                     acData={{TYPE:CONSTANTS['Certificate'].map(c=>c.TYPE)}}
                                     actions={<Button flat iconChildren={<FontIcon>delete</FontIcon>} iconBefore={false}
                                                      className="redButton" onClick={() => props.removeCert(type)}>
                                         Delete</Button>}/>
            })}

            <CheckTableCard edit title="Language Proficiencies" data={props.langs} onChange={props.setLangs}
                            acData={langs} add={props.addLang} remove={props.removeLang} tips={langDict}/>

            <ChipListCard edit title="Other Skills" acData={chips} tips={skDict}
                          list={props.skills} updateList={props.setSkills}/>

            <BlankCard title="Other Actions">
                <Button raised primary onClick={() => props.addItem('work')}
                        className="addButton" iconChildren={<FontIcon>add</FontIcon>}>
                    Add Work Experience
                </Button><label className="vertSpacer"/>
                <Button raised primary onClick={() => props.addItem('placement')}
                        className="addButton" iconChildren={<FontIcon>add</FontIcon>}>
                    Add Placement
                </Button><label className="vertSpacer"/>
                <Button raised primary onClick={() => props.addItem('training')}
                        className="addButton" iconChildren={<FontIcon>add</FontIcon>}>
                    Add Training
                </Button><label className="vertSpacer"/>
                <Button raised primary onClick={props.addCert}
                        className="addButton" iconChildren={<FontIcon>add</FontIcon>}>
                    Add New Certificate
                </Button><label className="vertSpacer"/>
                <Button raised className="raisedRedButton" iconChildren={<FontIcon>delete</FontIcon>} onClick={props.removeMember}>
                    delete
                </Button>
            </BlankCard>
        </Grid>
    );
}

function jobCards(props, set, pk, subtitle, title='EMPLOYER') {
    let table = set[0].toUpperCase() + set.slice(1);
    return Object.keys(props[set]).map(key => {
        let {[pk]:id, SKILLS, ...rest} = props[set][key];
        return (
            <PropsAndChipsCard edit key={key} title={rest[title]} subtitle={subtitle}
                               list={SKILLS} data={rest} listHeader="Skills Learned" table={table}
                               updateList={list => props.setItemSkills(set, key, list)}
                               acData={{chips, WORKTYPE, WORKSTATUS}}
                               onChange={evt => props.updateItem(set, key, evt)} tips={skDict}
                               actions={<Button flat iconChildren={<FontIcon>delete</FontIcon>} iconBefore={false} className="redButton"
                                                onClick={() => props.removeItem(set, key)}>
                                   Delete
                               </Button>}/>
        )
    });
}
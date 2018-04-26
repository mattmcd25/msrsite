import React from "react";
import Tooltip from '../Tooltip';
import { CONSTANTS, HEADERS } from "../../index";
import {capitalize, dictFromList, filterObj} from "../../Utils";
import { FontIcon } from 'react-md';

const formats = {
    'FIRSTNAME': ['First Name'],
    'SURNAME': ['Surname'],
    'MEMBERSHIP': ['MSR Member #'],
    'MOBILE': ['Mobile Phone',prettyPhone],
    'ADDRESS': ['Address'],
    'MARITAL': ['Marital Status'],
    'LENGTH': ['Job Length',prettyYears],
    'EMPLOYER': ['Employer Name'],
    'NAME': ['Skill Name'],
    'LANGUAGE': ['Language'],
    'DESC': ['Description'],
    'NATID': ['National ID'],
    'SITE': ['Recruitment Site',prettySite],
    'ABBR': ['Site Code'],
    'TYPE': ['Certificate Type'],
    'YEAR': ['Completion Year'],
    'INSTITUTION': ['School/Institution'],
    'DEPENDENTS': ['Dependents'],
    'DATE': ['Recruit Date',prettyDate],
    'WORKTYPE': ['Employment Type'],
    'WORKSTATUS': ['Employment Status'],
    'STARTDATE': ['Start Date',prettyDate],
    'COMPLETEDATE': ['Complete Date',prettyDate],
    'SUCCEEDED': ['Succeeded',prettyBool],
    'FIELD': ['Training Field'],
    'skills': ['',prettyList('Skills')],
    'workSkills': ['',prettyList('Skills from Work')],
    'placementSkills': ['',prettyList('Skills from Placements')],
    'trainingSkills': ['',prettyList('Skills from Training')],
    'mem': ['',prettyDict('')],
    'work': ['',prettyDict('Past Work with')],
    'placement': ['',prettyDict('Placement with')],
    'training': ['',prettyDict('Training with')],
    'cert': ['',prettyDict('Certificate with')],
    'langs': ['',prettyDict('Knowledge of')],
    'email': ['Email Address'],
    'none': ['No Access'],
    'basic': ['Limited Access'],
    'admin': ['Full Access'],
    'STATUS': ['Member Status']
};

export function PrettyKey(key) {
    let f = formats[key];
    if(key.slice(0,3) === 'MIN') return `Minimum ${formats[key.slice(3)][0]}`;
    else if(key.slice(0,3) === 'MAX') return `Maximum ${formats[key.slice(3)][0]}`;
    return f && f[0] ? f[0] : (key && capitalize(key));
}

export function PrettyValue(key, val) {
    if(CONSTANTS['Language'].map(l=>l.LANGUAGE).includes(key)) return prettyDict('')(filterObj(val));
    if(key.slice(0,3) === 'MIN') return formats[key.slice(3)][1](val);
    else if(key.slice(0,3) === 'MAX') return formats[key.slice(3)][1](val);
    let f = formats[key];
    return f && f[1] ? f[1](val) : val;
}

export function PrettyPair(key, val) {
    return <div><b>{PrettyKey(key)}:</b> {PrettyValue(key, val)}</div>;
}

export function textValidation(table, field) {
    let info = HEADERS[table][field];
    let result = {};
    switch(info.DATA_TYPE) {
        case 'int':
        case 'float': result.type = 'number'; break;
        case 'bit':
        case 'varchar':
        default: result.type = 'text'; break;
    }
    result.maxLength = info.CHARACTER_MAXIMUM_LENGTH || 100;
    return result;
}

export function dataLengthIssues(data, table) {
    return data ? Object.keys(data).reduce((acc, key) => {
        let cur = data[key];
        return acc.concat(
            cur ? Object.keys(cur).reduce((acc, field) =>
                (typeof(cur[field]) === 'string' &&
                HEADERS[table][field].DATA_TYPE === 'varchar' &&
                cur[field].length > HEADERS[table][field].CHARACTER_MAXIMUM_LENGTH) ?
                    acc.concat({key,field,value:cur[field]}) : acc, []) : []
        )}, []) : [];
}

export function issueTip(issue) {
    if(!issue) return '';
    else if(issue.custom) return issue.message;
    else if(issue.duplicate) return `There are cannot be two ${PrettyKey(issue.field)} named ${issue.value}!`;
    else if(issue.value === "") return `The ${PrettyKey(issue.field)} field cannot be empty!`;
    else return `The ${PrettyKey(issue.field)} field is overfilled!`;
}

export function doubleDate(dict) {
    return Object.assign(...Object.entries(dict).map(d => {
        if(d[0].includes('DATE'))
            return {[`MIN${d[0]}`]:d[1], [`MAX${d[0]}`]:d[1]};
        else
            return {[d[0]]:d[1]};
    }));
}

export function displayTitle(state) {
    let entries = Object.entries(state).filter(e => e[0] !== 'title' && e[0] !== 'result' && e[0] !== 'mode');
    let allConds = filterObj(Object.assign(...entries.map(d => ({[d[0]]:filterObj(d[1])}))));
    return 'Members with ' + Object.entries(allConds).reduce((acc, cur) => `${acc}; ${PrettyValue(cur[0],cur[1])}`, '').slice(2);
    // return Object.entries(allConds).map(a =>PrettyPair(a[0],a[1]));
}

function prettyPhone(old) {
    let phone = old.padStart(10, '0');
    let area = phone.slice(0,3);
    let next = phone.slice(3,6);
    let last = phone.slice(6);
    return `(${area}) ${next}-${last}`;
}

function prettySite (old) {
    return (
      <Tooltip tooltipLabel={`Site Code '${old}'`} tooltipPosition="top">
          {dictFromList(CONSTANTS['Site'],'ABBR')[old].DESC}
      </Tooltip>
    );
}

function prettyYears(years) {
    if(years > 1)
        return `${years} years`;
    else if(years === 1)
        return `${years} year`;
    else {
        let months = `${years*12}`;
        return `${months.slice(0,months.indexOf('.'))} months`;
    }
}

function prettyDate(date) {
    return new Date(date).toDateString()
}

function prettyBool(bool) {
    return bool ?
        <div style={{'display':'inline'}}><FontIcon primary>check</FontIcon>Yes</div> :
        <div style={{'display':'inline'}}><FontIcon error>close</FontIcon>No</div> ;
}

function prettyList(name) {
    return list => {
        return `${Object.values(list).reduce((acc, cur, i, a) => i === a.length-1 ? `${acc} & ${cur}` : `${acc}, ${cur}`)} ${name}`;
    }
}

function prettyDict(name) {
    let x = name ? `${name} ` : '';
    return dict => {
        return Object.entries(dict).reduce((acc, cur) => {
            let key = name==='Knowledge of' ? '' : PrettyKey(cur[0]);
            let value = key!=='Succeeded' ? PrettyValue(cur[0],cur[1]) : cur[1];
            return `${acc}, ${x}${key} ${value}`;
        }, '').slice(2);
    }
}
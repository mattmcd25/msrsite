import React from "react";

const formats = {
    'FIRSTNAME': ['First Name'],
    'SURNAME': ['Surname'],
    'MEMBERSHIP': ['MSR Member #'],
    'MOBILE': ['Mobile Phone',prettyPhone],
    'ADDRESS': ['Address'],
    'MARITAL': ['Marital Status'],
    'LENGTH': ['Worked here for',prettyYears]
};

export function PrettyKey(key) {
    let f = formats[key];
    return f && f[0] ? f[0] : key;
}

export function PrettyValue(key, val) {
    let f = formats[key];
    return f && f[1] ? f[1](val) : val;
}

export function PrettyPair(key, val) {
    return <div><b>{PrettyKey(key)}:</b> {PrettyValue(key, val)}</div>;
}

export function PrettyWork(work) {
    let x = work.reduce((acc, cur) => {
        if(acc!==undefined && acc.hasOwnProperty(cur.EMPLOYER)) {
            acc[cur.EMPLOYER].SKILLS.push(cur.NAME);
            return acc;
        }
        else {
            return {
                [cur.EMPLOYER]: {
                    LENGTH: cur.LENGTH,
                    SKILLS: [cur.NAME]
                },
                ...acc
            }
        }
    }, {});
    return x;
}

// id = x => x;

function prettyPhone(old) {
    let phone = old.padStart(10, '0');
    let area = phone.slice(0,3);
    let next = phone.slice(3,6);
    let last = phone.slice(6);
    return `(${area}) ${next}-${last}`;
}

function prettyYears(years) {
    return (years > 1) ?
        `${years} years` :
        (years === 1) ?
            `${years} year` :
            `${years*12} months`;
}
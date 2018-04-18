import React from 'react';
import Tooltip from './Tooltip';
import { Button } from 'react-md';
import { issueTip } from "./displays/DisplayUtils";

export default function IssueButton(props) {
    let { children, ...rest } = props;
    return (
        <Tooltip tooltipLabel={issueTip(props.issues[0])} tooltipPosition={props.position}>
            {props.issues.length > 0 ?
                <label className='md-btn md-btn--flat md-btn--text md-btn--raised-disabled md-text--disabled md-inline-block'
                       style={props.style} children={props.children}/> :
                <Button {...rest} children={props.children}/>
            }
        </Tooltip>
    );
}
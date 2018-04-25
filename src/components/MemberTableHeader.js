import React from "react";
import { TableCardHeader, TextField, Button, FontIcon } from 'react-md';

export default function MemberTableHeader(props) {
    return (
        <TableCardHeader visible={false} title="Members">
            {props.title && <div style={{'maxWidth':'500px'}}><h4>{props.title.substring(8)}</h4></div>}
            <label style={{'padding':'20px'}}/>
            <TextField
                id="search"
                label="Quick Search"
                leftIcon={<FontIcon>search</FontIcon>}
                inlineIndicator={
                    <Button icon className="inline-btn" onClick={props.onClearClick}>clear</Button>
                }
                size={25}
                fullWidth={false}
                value={props.value}
                onChange={props.onChange}
                type={"text"}
            />
            {props.onRefreshClick===undefined ?
                <label className="spacer"/> :
                <Button flat primary onClick={props.onRefreshClick} iconChildren={<FontIcon>refresh</FontIcon>}>
                    Refresh
                </Button>
            }
        </TableCardHeader>
    );
};
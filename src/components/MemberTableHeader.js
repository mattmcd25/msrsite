import React from "react";
import { TableCardHeader, TextField, Button, FontIcon } from 'react-md';
import { CSVLink } from 'react-csv';

export default function MemberTableHeader(props) {
    return (
        <TableCardHeader visible={false} title={props.title || "Members"}>
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
            <label className="bigSpacer"/>
            <CSVLink data={props.onDownloadClick} filename={(props.title || "Members") + ".csv"}>
                <Button flat primary iconChildren={<FontIcon>file_download</FontIcon>}>Download</Button>
            </CSVLink>
            {props.onRefreshClick===undefined ?
                <label className="bigSpacer"/> :
                <Button flat primary onClick={props.onRefreshClick} iconChildren={<FontIcon>refresh</FontIcon>}>
                    Refresh
                </Button>
            }
        </TableCardHeader>
    );
};
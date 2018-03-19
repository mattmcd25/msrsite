import React from "react";
import Member from "./Member";
import test_data from "../data/data";

export default function MemberTable(props) {
    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th key={"name"}>Name</th>
                    <th key={"surname"}>Surname</th>
                    <th key={"phone"}>Phone</th>
                </tr>
                </thead>
                <tbody>
                    {test_data.map((mem) => {
                        return <Member name={mem.name} surname={mem.surname} phone={mem.phone}/>;
                    })}
                </tbody>
            </table>
        </div>
    );
}
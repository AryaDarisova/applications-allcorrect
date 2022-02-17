import {Table} from "react-bootstrap";
import React from "react";
import TableRow from "./TableRow";

export default function TableInfo(props) {
    return (
        <Table responsive bordered>
            <thead>
            <tr>
                <th key="№" className="center">№</th>
                {
                    props.columns.map(column => {
                        return(
                            <th key={column.name} className="center">{column.name}</th>
                        )
                    })
                }
                <th className="center">Action</th>
            </tr>
            </thead>
            <tbody>
            {
                props.rows.map((row, rowIndex) => {
                    return(
                        <TableRow key={rowIndex} row={row} rowIndex={rowIndex} columns={props.columns}
                                  addRow={props.addRow} deleteRow={props.deleteRow} moveUpRow={props.moveUpRow}
                                  moveDownRow={props.moveDownRow}/>
                    )
                })
            }
            </tbody>
        </Table>
    )
}
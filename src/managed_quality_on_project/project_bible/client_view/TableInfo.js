import {Table} from "react-bootstrap";
import React from "react";
import TableRow from "../client_view/TableRow";

const styles = {
    noEditableCell: {
        backgroundColor: '#f3f3f3',
    },

    tableFixHeadTable: {
        borderCollapse: 'collapse',
        width: '100%',
    },

    tableFixHeadTh: {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        background: 'rgb(223, 226, 230)'
    },

    tableBodyTopBorder: {
        borderTop: '0px'
    }
}

export default function TableInfo(props) {
    console.log("props.columns, props.rows", props.columns, props.rows)

    return (
        <Table responsive bordered style={styles.tableFixHeadTable}>
            <thead>
            <tr>
                <th key="№" className="center" style={styles.tableFixHeadTh}>№</th>
                {
                    props.columns.map(column => {
                        return (
                            <th key={column.name} className="center" style={styles.tableFixHeadTh}>{column.name}</th>
                        )
                    })
                }
            </tr>
            </thead>
            <tbody style={styles.tableBodyTopBorder}>
            {
                props.rows.map((row, rowIndex) => {
                    return (
                        <TableRow key={rowIndex} row={row} rowIndex={rowIndex} columns={props.columns} />
                    )
                })
            }
            </tbody>
        </Table>
    )
}
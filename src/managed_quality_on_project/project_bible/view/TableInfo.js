import {Table} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import TableRow from "../view/TableRow";
import ColumnResizer from "react-column-resizer"

const styles = {
    noEditableCell: {
        backgroundColor: '#f3f3f3',
    },

    /*
    Это для закрепления верхней строки
    _______________________________________________________________
    */
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
    /*
    _______________________________________________________________
    */
}

export default function TableInfo(props) {
    console.log("props.columns, props.rows", props.columns, props.rows)
    let rowNum = 0

    return (
        <Table className="resizableTable" responsive bordered style={styles.tableFixHeadTable} >
            <thead>
            <tr>
                <th key="№" className="center" style={styles.tableFixHeadTh}>№</th>
                {
                    props.columns.map(column => {
                        if (column.filter.show) {
                            return (
                                <>
                                    <ColumnResizer key={column.code} className="columnResizer"/>
                                    <th key={column.name} className="center" style={styles.tableFixHeadTh}>{column.name}</th>
                                </>
                            )
                        }
                    })
                }
                {
                    props.actionColumn &&
                    <ColumnResizer key="ActionColumnResizer" className="columnResizer"/>
                }
                {
                    props.actionColumn &&
                    <th key="Action" className="center" style={styles.tableFixHeadTh}>Action</th>
                }
            </tr>
            </thead>
            <tbody style={styles.tableBodyTopBorder}>
            {
                /*props.rows.map(info => {
                    /!*let rowNum = 1*!/

                    info.data.map((row, rowIndex)  => {
                        if (row.show) {
                            return (
                                <TableRow key={rowIndex} row={row} rowIndex={rowIndex} columns={props.columns}
                                          moveUpRow={props.moveUpRow} moveDownRow={props.moveDownRow}
                                          actionColumn={props.actionColumn} /!*rowNum={rowNum}*!/ />
                            )

                            /!*rowNum++*!/
                        }

                        return row
                    })

                    return info
                })*/

                props.rows.map((row, rowIndex) => {
                    if (row.show) {
                        rowNum++

                        return (
                            <TableRow key={rowIndex} row={row} rowIndex={rowIndex} columns={props.columns}
                                      moveUpRow={props.moveUpRow} moveDownRow={props.moveDownRow}
                                      actionColumn={props.actionColumn} rowNum={rowNum} />
                        )
                    }
                })
            }
            </tbody>
        </Table>
    )
}
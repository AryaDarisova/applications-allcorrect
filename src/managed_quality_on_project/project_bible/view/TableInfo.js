import {FormCheck, Table} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import TableRow from "../view/TableRow";

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
    /*const [tableHeight, setTableHeight] = useState("auto");
    const [activeIndex, setActiveIndex] = useState(null);
    const [columnsCount, setColumnsCount] = useState(0);
    const tableElement = useRef(null);

    const tableStyle = (columnsCount) => ({
        borderCollapse: 'collapse',
        width: '100%',
        overflow: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(' + columnsCount + ', minmax(100px, 1fr))'
    });

    useEffect(() => {
        setTableHeight(tableElement.current.offsetHeight);

        props.columns.map(column => {
            if (column.filter.show) {
                setColumnsCount(columnsCount + 1)
            }
        })
    }, []);

    const mouseDown = (index) => {
        setActiveIndex(index);
    };*/

    console.log("props.columns, props.rows", props.columns, props.rows)

    return (
        <Table responsive bordered style={styles.tableFixHeadTable}>
            <thead>
            <tr>
                <th key="№" className="center" style={styles.tableFixHeadTh}>№</th>
                {
                    props.columns.map(column => {
                        if (column.filter.show) {
                            return (
                                <th key={column.name} className="center" style={styles.tableFixHeadTh}>{column.name}</th>
                            )
                        }
                    })
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

                props.rows.map((row, rowIndex, rowNum = 1) => {

                    if (row.show) {
                        return (
                            <TableRow key={rowIndex} row={row} rowIndex={rowIndex} columns={props.columns}
                                      moveUpRow={props.moveUpRow} moveDownRow={props.moveDownRow}
                                      actionColumn={props.actionColumn} rowNum={rowNum} />
                        )

                        rowNum++
                    }
                })
            }
            </tbody>
        </Table>
    )
}
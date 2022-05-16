import React from "react";
import TableCell from "../view/TableCell";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import ColumnResizer from "react-column-resizer";

const styles = {
    noEditableCell: {
        backgroundColor: '#f3f3f3',
    },

    nowrapCell: {
        whiteSpace: 'nowrap'
    },
}

export default function TableRow(props) {
    return(
        <tr>
            <td className="center">{/*{props.rowNum}*/ props.rowIndex + 1}</td>
            {
                props.columns.map((column, columnIndex) => {
                    if (column.filter.show) {
                        return(
                            <>
                                <ColumnResizer key={props.row.code + "-" + column.code} className="columnResizer"/>
                                <TableCell key={props.row.code + "_" + column.code} editable={column.editable}
                                           template={column.template} type={column.type} column={column}
                                           rowCode={props.row.code} value={props.row.data[column.code]}
                                           columnIndex={columnIndex} row={props.row} rowNum={props.rowNum}  />
                            </>
                        )
                    }
                })
            }
            {
                props.actionColumn &&
                <ColumnResizer className="columnResizer"/>
            }
            {
                props.actionColumn &&
                <td className="center align-middle" style={styles.nowrapCell}>
                    <Button size="sm" variant="primary" onClick={(e) =>
                        props.moveUpRow(props.row.code, props.rowIndex + 1)}><FontAwesomeIcon
                        icon={faChevronUp}/></Button>
                    &nbsp;
                    <Button size="sm" variant="primary" onClick={(e) =>
                        props.moveDownRow(props.row.code, props.rowIndex + 1)}><FontAwesomeIcon
                        icon={faChevronDown}/></Button>
                </td>
            }
        </tr>
    )
}
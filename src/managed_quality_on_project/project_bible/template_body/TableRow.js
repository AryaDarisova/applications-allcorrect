import React from "react";
import TableCell from "./TableCell";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";

const styles = {
    nowrapCell: {
        whiteSpace: 'nowrap'
    },
}

export default function TableRow(props) {
    return(
        <tr>
            <td className="center">{props.rowIndex + 1}</td>
            {
                props.columns.map((column, columnIndex) => {
                    return(
                        <TableCell key={props.row.code + "_" + column.code}
                                   type={column.type} column={column} rowCode={props.row.code}
                                   value={props.row.data[column.code]} columnIndex={columnIndex}/>
                    )
                })
            }
            <td className="center align-middle" style={styles.nowrapCell}>
                <Button size="sm" variant="primary" onClick={(e) =>
                    props.moveUpRow(props.row.code, props.rowIndex + 1)}><FontAwesomeIcon icon={faChevronUp} /></Button>
                &nbsp;
                <Button size="sm" variant="primary" onClick={(e) =>
                    props.moveDownRow(props.row.code, props.rowIndex + 1)}><FontAwesomeIcon icon={faChevronDown} /></Button>
                &nbsp;
                <Button size="sm" variant="success" onClick={(e) =>
                    props.addRow(props.rowIndex + 1)}><FontAwesomeIcon icon={faPlus} /></Button>
                &nbsp;
                <Button size="sm" variant="danger" onClick={(e) =>
                    props.deleteRow(props.row.code, props.rowIndex + 1)}><FontAwesomeIcon icon={faTimes} /></Button>
            </td>
        </tr>
    )
}
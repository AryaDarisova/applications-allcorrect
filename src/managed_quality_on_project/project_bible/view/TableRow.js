import React from "react";
import TableCell from "../view/TableCell";

const styles = {
    noEditableCell: {
        backgroundColor: '#f3f3f3',
    },
}

export default function TableRow(props) {
    return(
        <tr>
            <td className="center">{props.rowIndex + 1}</td>
            {
                props.columns.map((column, columnIndex) => {
                    return(
                        <TableCell key={props.row.code + "_" + column.code} editable={column.editable}
                                   type={column.type} column={column} rowCode={props.row.code}
                                   value={props.row.data[column.code]} columnIndex={columnIndex}/>
                    )
                })
            }
        </tr>
    )
}
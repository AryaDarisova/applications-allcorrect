import React, {useState} from "react";
import TableCell from "../client_view/TableCell";

export default function TableRow(props) {
    const [filledRowColor, setFilledRowColor] = useState(false)

    return(
        <tr>
            <td className="center">{props.rowIndex + 1}</td>
            {
                props.columns.map((column, columnIndex) => {
                    return(
                        <TableCell key={props.row.code + "_" + column.code} column={column} rowCode={props.row.code}
                                   value={props.row.data[column.code]} columnIndex={columnIndex} submit={props.submit}
                                   filledRowColor={filledRowColor} setFilledRowColor={setFilledRowColor} />
                    )
                })
            }
        </tr>
    )
}
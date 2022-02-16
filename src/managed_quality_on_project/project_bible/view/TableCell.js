import {FormCheck, Table} from "react-bootstrap";
import React from "react";
import queryString from "query-string";

const styles = {
    noEditableCell: {
        backgroundColor: '#f3f3f3',
    },
}

export default function TableCell(props) {
    const queryStringParams = queryString.parse(window.location.search)
    const clientName = queryStringParams.client_name
    const projectName = queryStringParams.project_name
    const projectCode = queryStringParams.project_code

    async function oninputCell(column, row, type, e) {
        let queryLinkExist = '/proxy/project_bible_template/'
        let queryUpdateCell = '/proxy/project_bible_template/'
        let queryInsertCell = '/proxy/project_bible_template/'
        let value

        if (type === "input") {
            queryLinkExist += 'projectBibleFilledCellTextByName'
            queryUpdateCell += 'projectBibleOninputUpdateTextCell'
            queryInsertCell += 'projectBibleOninputInsertTextCell'
            value = e.target.innerText
        } else if (type === "checkbox") {
            queryLinkExist += 'projectBibleFilledCellBoolByName'
            queryUpdateCell += 'projectBibleOninputUpdateBoolCell'
            queryInsertCell += 'projectBibleOninputInsertBoolCell'
            value = e.target.checked
        }

        await fetch(queryLinkExist, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "clientName": clientName,
                "projectName": projectName,
                "projectCode": projectCode,
                "colCode": column,
                "rowCode": row
            })
        })
            .then(res => res.json())
            .then(
                async (resultEditable) => {
                    console.log("resultEditable", resultEditable)

                    if (resultEditable.length) {
                        await fetch(queryUpdateCell, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "clientName": clientName,
                                "projectName": projectName,
                                "projectCode": projectCode,
                                "colCode": column,
                                "rowCode": row,
                                "value": value
                            })
                        })
                            .then(res => res.json())
                            .then(
                                async (resultUpdate) => {

                                },
                                (error) => {
                                    alert("Ошибка при сохранении значения ячейки. Если это была ячейка для ввода " +
                                        "текста, то попробуйте поставить указатель обратно в эту ячейку, а затем убрать " +
                                        "- повторится процедура сохранения. Если это чекбокс - снимите/поставьте " +
                                        "галочку и после этого повторите последнее действие еще раз, чтобы сохранилось " +
                                        "верное значение")
                                }
                            )
                    } else {
                        await fetch(queryInsertCell, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "clientName": clientName,
                                "projectName": projectName,
                                "projectCode": projectCode,
                                "colCode": column,
                                "rowCode": row,
                                "value": value
                            })
                        })
                            .then(res => res.json())
                            .then(
                                async (resultInsert) => {

                                },
                                (error) => {
                                    alert("Ошибка при сохранении значения ячейки. Если это была ячейка для ввода " +
                                        "текста, то попробуйте поставить указатель обратно в эту ячейку, а затем убрать " +
                                        "- повторится процедура сохранения. Если это чекбокс - снимите/поставьте " +
                                        "галочку и после этого повторите последнее действие еще раз, чтобы сохранилось " +
                                        "верное значение")
                                }
                            )
                    }
                },
                (error) => {
                    alert("Ошибка при сохранении значения ячейки. Если это была ячейка для ввода " +
                        "текста, то попробуйте поставить указатель обратно в эту ячейку, а затем убрать " +
                        "- повторится процедура сохранения. Если это чекбокс - снимите/поставьте " +
                        "галочку и после этого повторите последнее действие еще раз, чтобы сохранилось " +
                        "верное значение")
                }
            )
    }

    // console.log("TableCell", props.column.code, props.columnIndex, props.value, props.value[props.columnIndex])

    if (props.type === "input") {
        if (props.editable) {
            return (
                <td contentEditable={true} suppressContentEditableWarning={true}
                    onBlur={(e) =>
                        oninputCell(props.column.code, props.rowCode, "input", e)}>{props.value}</td>
            )
        } else {
            return (
                <td contentEditable={false} style={styles.noEditableCell}>{props.value}</td>
            )
        }
    } else if (props.type === "checkbox") {
        if (props.editable) {
            return (
                <td contentEditable={false} className="center align-middle">
                    <FormCheck defaultChecked={props.value}
                               onInput={(e) =>
                                   oninputCell(props.column.code, props.rowCode, "checkbox", e)}/>
                </td>
            )
        } else {
            return (
                <td contentEditable={false} style={styles.noEditableCell} className="center align-middle">
                    <FormCheck checked={props.value} readOnly/>
                </td>
            )
        }
    }
}
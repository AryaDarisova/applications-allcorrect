import {FormCheck} from "react-bootstrap";
import React from "react";
import queryString from "query-string";
import parse from "html-react-parser"

const styles = {
    noEditableCell: {
        backgroundColor: '#f3f3f3',
        whiteSpace: 'pre-line',
    },

    editableCell: {
        whiteSpace: 'pre-line',
    },

    filledRow: {
        backgroundColor: '#dffdde',
        whiteSpace: 'pre-line',
    }
}

export default function TableCell(props) {
    const queryStringParams = queryString.parse(window.location.search)
    const code = queryStringParams.code

    async function oninputCell(column, row, type, e) {
        let queryLinkExist = '/proxy/project_bible_template/'
        let queryUpdateCell = '/proxy/project_bible_template/'
        let queryInsertCell = '/proxy/project_bible_template/'
        let value

        if (type === "input") {
            queryLinkExist += 'projectBibleClientViewFilledCellTextByName'
            queryUpdateCell += 'projectBibleClientViewOninputUpdateTextCell'
            queryInsertCell += 'projectBibleClientViewOninputInsertTextCell'
            value = e.target.innerText
        } else if (type === "checkbox") {
            queryLinkExist += 'projectBibleClientViewFilledCellBoolByName'
            queryUpdateCell += 'projectBibleClientViewOninputUpdateBoolCell'
            queryInsertCell += 'projectBibleClientViewOninputInsertBoolCell'
            value = e.target.checked
        }

        await fetch(queryLinkExist, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "code": code,
                "colCode": column,
                "rowCode": row
            })
        })
            .then(res => res.json())
            .then(
                async (resultEditable) => {
                    if (resultEditable.length) {
                        await fetch(queryUpdateCell, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "code": code,
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
                                "code": code,
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

    if (props.column.type === "input") {
        if (props.column.clientColumn) {
            if (props.submit) {
                if (props.value) {
                    props.setFilledRowColor(true)

                    return (
                        <td contentEditable={false} style={styles.filledRow}>{parse(props.value)}</td>
                    )
                } else {
                    return (
                        <td contentEditable={false} style={styles.noEditableCell}>{parse(props.value)}</td>
                    )
                }

                /*return (
                    <td contentEditable={false} style={styles.noEditableCell}>{parse(props.value)}</td>
                )*/
            } else {
                return (
                    <td contentEditable={true} suppressContentEditableWarning={true} style={styles.editableCell}
                        onBlur={(e) =>
                            oninputCell(props.column.code, props.rowCode, "input", e)}>{parse(props.value)}</td>
                )
            }
        } else {
            if (props.filledRowColor) {
                return (
                    <td contentEditable={false} style={styles.filledRow}>{parse(props.value)}</td>
                )
            } else {
                return (
                    <td contentEditable={false} style={styles.noEditableCell}>{parse(props.value)}</td>
                )
            }

            /*return (
                <td contentEditable={false} style={styles.noEditableCell}>{parse(props.value)}</td>
            )*/
        }
    } else if (props.column.type === "checkbox") {
        if (props.column.clientColumn) {
            if (props.submit) {
                if (props.value) {
                    props.setFilledRowColor(true)

                    return (
                        <td contentEditable={false} style={styles.filledRow} className="center align-middle">
                            <FormCheck checked={props.value} readOnly/>
                        </td>
                    )
                } else {
                    return (
                        <td contentEditable={false} style={styles.noEditableCell} className="center align-middle">
                            <FormCheck checked={props.value} readOnly/>
                        </td>
                    )
                }

                /*return (
                    <td contentEditable={false} style={styles.noEditableCell} className="center align-middle">
                        <FormCheck checked={props.value} readOnly/>
                    </td>
                )*/
            } else {
                return (
                    <td contentEditable={false} className="center align-middle">
                        <FormCheck defaultChecked={props.value}
                                   onInput={(e) =>
                                       oninputCell(props.column.code, props.rowCode, "checkbox", e)}/>
                    </td>
                )
            }
        } else {
            if (props.filledRowColor) {
                return (
                    <td contentEditable={false} style={styles.filledRow} className="center align-middle">
                        <FormCheck checked={props.value} readOnly/>
                    </td>
                )
            } else {
                return (
                    <td contentEditable={false} style={styles.noEditableCell} className="center align-middle">
                        <FormCheck checked={props.value} readOnly/>
                    </td>
                )
            }

            /*return (
                <td contentEditable={false} style={styles.noEditableCell} className="center align-middle">
                    <FormCheck checked={props.value} readOnly/>
                </td>
            )*/
        }
    }
}
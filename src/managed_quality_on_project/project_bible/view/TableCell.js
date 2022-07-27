import {FormCheck} from "react-bootstrap";
import React, {useState} from "react";
import queryString from "query-string";
import parse from "html-react-parser"

const styles = {
    defaultCell: {
        backgroundColor: '#fff',
    },

    noEditableCell: {
        backgroundColor: '#f3f3f3',
        whiteSpace: 'pre-line',
    },

    emptyCell: {
        backgroundColor: '#f8e7e7',
        whiteSpace: 'pre-line',
    },

    filledCell: {
        backgroundColor: '#dffdde',
        whiteSpace: 'pre-line',
    },

    changedCheckbox: {
        backgroundColor: '#f6f0d8',
    }
}

export default function TableCell(props) {
    const queryStringParams = queryString.parse(window.location.search)
    const clientName = queryStringParams.client_name
    const projectName = queryStringParams.project_name
    const projectCode = queryStringParams.project_code
    const [cellInputColor, setCellInputColor] = useState(props.value ? "green" : "red")
    const [cellCheckboxColor, setCellCheckboxColor] = useState(
        props.type === "checkbox" && props.template && props.editable && props.value !== props.row.template[props.column.code] ? "yellow" : "white"
    )

    async function oninputCell(column, row, type, e, oldValue) {
        let regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;
        let matchValue = e.target.innerHTML.match(regex) || []

        if (type === "input" && e.target.innerText && matchValue.length) {
            props.setInputRegexModalValue(true, column, row, e.target.innerHTML, oldValue)
        } else {
            saveCellValue(column, row, type, e, oldValue)
        }
    }

    async function saveCellValue(column, row, type, e, oldValue) {
        let queryLinkExist = '/proxy/project_bible_template/'
        let queryUpdateCell = '/proxy/project_bible_template/'
        let queryInsertCell = '/proxy/project_bible_template/'
        let value

        if (type === "input") {
            queryLinkExist += 'projectBibleFilledCellTextByName'
            queryUpdateCell += 'projectBibleOninputUpdateTextCell'
            queryInsertCell += 'projectBibleOninputInsertTextCell'
            value = e.target.innerText

            if (value) {
                setCellInputColor("green")
            } else {
                setCellInputColor("red")
            }
        } else if (type === "checkbox") {
            queryLinkExist += 'projectBibleFilledCellBoolByName'
            queryUpdateCell += 'projectBibleOninputUpdateBoolCell'
            queryInsertCell += 'projectBibleOninputInsertBoolCell'
            value = e.target.checked

            if (props.template && props.editable) {
                if (value === props.row.template[props.column.code]) {
                    setCellCheckboxColor("white")
                } else {
                    setCellCheckboxColor("yellow")
                }
            }
        }

        if (value !== oldValue) {
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
                        // console.log("resultEditable", resultEditable)

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
    }

    function pressKey(colCode, rowNum) {
        let pressed = new Set()

        document.addEventListener('keydown', function(event) {
            pressed.add(event.code)
            // console.log("pressed.add", pressed)

            if (pressed.has("ShiftLeft") && pressed.has("ArrowUp")) {
                let newId = rowNum === 1 ? rowNum : rowNum - 1

                // console.log("ShiftLeft + ArrowUp", pressed, colCode + "_" + newId)
                document.getElementById(colCode + "_" + newId).focus()

                // return
            } else if (pressed.has("ShiftLeft") && pressed.has("ArrowDown")) {
                let newId = rowNum + 1

                if(document.getElementById(colCode + "_" + newId)) {
                    // console.log("ShiftLeft + ArrowDown", pressed, colCode + "_" + newId)
                    document.getElementById(colCode + "_" + newId).focus()
                }

                // return
            } else {
                return
            }

            pressed.clear()
        });

        document.addEventListener('keyup', function(event) {
            // console.log("keyup", pressed)
            pressed.delete(event.code)
            // console.log("keyup delete", pressed)
        });
    }

    // console.log("TableCell", props.column.code, props.columnIndex, props.value, props.value[props.columnIndex])

    if (props.type === "input") {
        if (props.editable) {
            if (cellInputColor === "green") {
                return (
                    <td contentEditable={true} suppressContentEditableWarning={true} style={styles.filledCell}
                        id={props.column.code + '_' + props.rowNum}
                        onBlur={(e) =>
                            oninputCell(props.column.code, props.rowCode, "input", e, props.value)}
                        onKeyDown={(e) => pressKey(props.column.code, props.rowNum)}
                        dangerouslySetInnerHTML={{__html: props.value}}></td>
                )
            } else if (cellInputColor === "red") {
                return (
                    <td contentEditable={true} suppressContentEditableWarning={true} style={styles.emptyCell}
                        id={props.column.code + '_' + props.rowNum}
                        onBlur={(e) =>
                            oninputCell(props.column.code, props.rowCode, "input", e, props.value)}
                        onKeyDown={(e) => pressKey(props.column.code, props.rowNum)}
                        dangerouslySetInnerHTML={{__html: props.value}}></td>
                )
            }

            /*return (
                <td contentEditable={true} suppressContentEditableWarning={true} style={props.value === "" ? styles.emptyCell : styles.filledCell}
                    onBlur={(e) =>
                        oninputCell(props.column.code, props.rowCode, "input", e)}>{props.value}</td>
            )*/
        } else {
            return (
                <td contentEditable={false} style={styles.noEditableCell}>{props.value}</td>
            )
        }
    } else if (props.type === "checkbox") {
        if (props.editable) {
            // console.log(props.type, props.template, props.editable, props.value, props.row.template[props.column.code])

            if (cellCheckboxColor === "white") {
                return (
                    <td contentEditable={false} className="center align-middle" style={styles.defaultCell}>
                        <FormCheck defaultChecked={props.value}
                                   onInput={(e) =>
                                       oninputCell(props.column.code, props.rowCode, "checkbox", e, props.value)}/>
                    </td>
                )
            } else if (cellCheckboxColor === "yellow") {
                return (
                    <td contentEditable={false} className="center align-middle" style={styles.changedCheckbox}>
                        <FormCheck defaultChecked={props.value}
                                   onInput={(e) =>
                                       oninputCell(props.column.code, props.rowCode, "checkbox", e, props.value)}/>
                    </td>
                )
            }
        } else {
            return (
                <td contentEditable={false} style={styles.noEditableCell} className="center align-middle">
                    <FormCheck checked={props.value} readOnly/>
                </td>
            )
        }
    } else if (props.type === "tags_list") {
        let textValueTags = []

        if (props.value.length) {
            props.value.map(group => {
                group.data.map(tag => {
                    textValueTags.push(tag.title)
                })

                return group
            })
        }

        return(
            <td contentEditable={false} style={styles.noEditableCell}
                onDoubleClick={() => props.setTagValue(true, props.rowCode, props.column.code)} >
                {
                    textValueTags.map(tag => {
                        return(
                            <div key={tag}>
                                {tag}
                            </div>
                        )
                    })
                }
            </td>
        )
    }
}
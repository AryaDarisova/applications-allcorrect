import {FormCheck} from "react-bootstrap";
import React from "react";
import queryString from "query-string";
import parse from 'html-react-parser'

const styles = {
    cell: {
        whiteSpace: 'pre-line',
    }
}

export default function TableCell(props) {
    async function oninputCell(column, row, type, e) {
        console.log("oninputCell")
        let queryLinkExist = '/proxy/project_bible_template/'
        let queryUpdateCell = '/proxy/project_bible_template/'
        let queryInsertCell = '/proxy/project_bible_template/'
        let value

        if (type === "input") {
            queryLinkExist += 'projectBibleTemplateTextByNameIfExist'
            queryUpdateCell += 'projectBibleTemplateOninputUpdateTextCell'
            queryInsertCell += 'projectBibleTemplateOninputInsertTextCell'
            value = e.target.innerText
        } else if (type === "checkbox") {
            queryLinkExist += 'projectBibleTemplateBoolByNameIfExist'
            queryUpdateCell += 'projectBibleTemplateOninputUpdateBoolCell'
            queryInsertCell += 'projectBibleTemplateOninputInsertBoolCell'
            value = e.target.checked
        }

        await fetch(queryLinkExist, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "colCode": column,
                "rowCode": row
            })
        })
            .then(res => res.json())
            .then(
                async (resultExist) => {
                    if (resultExist.length) {
                        console.log("resultExist.length")
                        await fetch(queryUpdateCell, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
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

    if (props.type === "input") {
        return(
            <td contentEditable={true} suppressContentEditableWarning={true} style={styles.cell}
                onBlur={(e) =>
                    oninputCell(props.column.code, props.rowCode, "input", e)}>{parse(props.value)}</td>
        )
    } else if (props.type === "checkbox") {
        return(
            <td contentEditable={false} className="center align-middle">
                <FormCheck defaultChecked={props.value}
                           onInput={(e) =>
                               oninputCell(props.column.code, props.rowCode, "checkbox", e)}/>
            </td>
        )
    } else if (props.type === "tags_list") {
        //todo тут надо будет разобраться с тем, как значение будет заполняться
        let textValueTags = []

        if (props.value.length) {
            props.value.map(group => {
                group.data.map(tag => {
                    // textValueTags += "<div>" + tag.title + "</div>"
                    textValueTags.push(tag.title)
                })

                return group
            })
        }

        return(
            <td contentEditable={false} onDoubleClick={() => props.setTagValue(true, props.rowCode, props.column.code)} >
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
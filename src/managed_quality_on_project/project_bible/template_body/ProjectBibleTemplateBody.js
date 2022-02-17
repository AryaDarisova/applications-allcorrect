import React, {useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import TableInfo from "../template_body/TableInfo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export default function ProjectBibleTemplateHeader(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [columns, setColumns] = useState([{
        data: []
    }])
    const [rows, setRows] = useState([{
        data: []
    }])
    let cellAllCount = 0
    let cellOnCount = 0

    async function addRowToTheEnd() {
        await fetch("/proxy/project_bible_template/projectBibleTemplateGenerateIndividualCode", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                async (resultGenerate) => {
                    if (!resultGenerate.exist.length) {
                        await fetch("/proxy/project_bible_template/projectBibleTemplateAddRowToTheEnd", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "num": rows[0].data.length + 1,
                                "code": resultGenerate.individualCode,
                                "active": true
                            })
                        })
                            .then(res => res.json())
                            .then(
                                (resultAdd) => {
                                    let value = {
                                        "code": resultGenerate.individualCode,
                                        "data": []
                                    }

                                    columns.map(columnsData => {
                                        columnsData.data.map(column => {
                                            if (column.type === "input") {
                                                value.data[column.code] = ""
                                            } else if (column.type === "checkbox") {
                                                value.data[column.code] = false
                                            }
                                        })
                                    })

                                    setRows(
                                        rows.map(info => {
                                            info.data.push(value);

                                            return info
                                        })
                                    )
                                },
                                (error) => {
                                    //todo придумать какой-то текст ошибки
                                }
                            )
                    } else {
                        addRowToTheEnd()
                    }
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    async function addRow(num) {
        await fetch("/proxy/project_bible_template/projectBibleTemplateGenerateIndividualCode", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                async (resultGenerate) => {
                    if (!resultGenerate.exist.length) {
                        await fetch("/proxy/project_bible_template/projectBibleTemplateIncNumPredAddRow", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "initNum": num
                            })
                        })
                            .then(res => res.json())
                            .then(
                                async (resultPredAdd) => {
                                    await fetch("/proxy/project_bible_template/projectBibleTemplateAddRow", {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            "num": num + 1,
                                            "code": resultGenerate.individualCode,
                                            "active": true
                                        })
                                    })
                                        .then(res => res.json())
                                        .then(
                                            (resultAdd) => {
                                                let value = {
                                                    "code": resultGenerate.individualCode,
                                                    "data": []
                                                }

                                                columns.map(columnsData => {
                                                    columnsData.data.map(column => {
                                                        if (column.type === "input") {
                                                            value.data[column.code] = ""
                                                        } else if (column.type === "checkbox") {
                                                            value.data[column.code] = false
                                                        }
                                                    })
                                                })

                                                setRows(
                                                    rows.map(info => {
                                                        info.data.splice(num, 0, value)

                                                        return info
                                                    })
                                                )
                                            },
                                            (error) => {
                                                //todo придумать какой-то текст ошибки
                                            }
                                        )
                                },
                                (error) => {
                                    //todo придумать какой-то текст ошибки
                                }
                            )
                    } else {
                        addRow(num)
                    }
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    async function deleteRow(code, num) {
        await fetch("/proxy/project_bible_template/projectBibleTemplateDecNumPredDeleteRow", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "initNum": num
            })
        })
            .then(res => res.json())
            .then(
                async (resultPredDelete) => {
                    await fetch("/proxy/project_bible_template/projectBibleTemplateDeleteRow", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "code": code
                        })
                    })
                        .then(res => res.json())
                        .then(
                            (resultDelete) => {
                                setRows(
                                    rows.map(info => {
                                        info.data.splice(num - 1, 1)

                                        return info
                                    })
                                )
                            },
                            (error) => {
                                //todo придумать какой-то текст ошибки
                            }
                        )
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    async function moveUpRow(code, num) {
        if (num !== 1) {
            await fetch("/proxy/project_bible_template/projectBibleTemplateMoveUpRow", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "code": code,
                    "num": num
                })
            })
                .then(res => res.json())
                .then(
                    (resultMoveUp) => {
                        let value = rows[0].data[num - 1]

                        setRows(
                            rows.map(info => {
                                info.data.splice(num - 1, 1)
                                info.data.splice(num - 2, 0, value)

                                return info
                            })
                        )
                    },
                    (error) => {
                        //todo придумать какой-то текст ошибки
                    }
                )
        }
    }

    async function moveDownRow(code, num) {
        let rowsLength = rows[0].data.length

        if (num !== rowsLength) {
            await fetch("/proxy/project_bible_template/projectBibleTemplateMoveDownRow", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "code": code,
                    "num": num
                })
            })
                .then(res => res.json())
                .then(
                    (resultMoveDown) => {
                        let value = rows[0].data[num - 1]

                        setRows(
                            rows.map(info => {
                                info.data.splice(num - 1, 1)
                                info.data.splice(num, 0, value)

                                return info
                            })
                        )
                    },
                    (error) => {
                        //todo придумать какой-то текст ошибки
                    }
                )
        }
    }

    useEffect(async () => {
        await fetch("/proxy/project_bible_template/projectBibleTemplateActiveRowsAndColumnsWithTemplate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(
                async (resultTemplate) => {
                    cellAllCount = resultTemplate.columns.length * resultTemplate.rows.length

                    resultTemplate.columns.map(value => {
                        setColumns(
                            columns.map(info => {
                                info.data.push({
                                    "code": value.code,
                                    "name": value.name,
                                    "type": value.type
                                });

                                return info
                            })
                        )

                        return value
                    })

                    resultTemplate.rows.map(value => {
                        setRows(
                            rows.map(info => {
                                info.data.push({
                                    "code": value.code,
                                    "data": []
                                });

                                return info
                            })
                        )

                        return value
                    })

                    fillDataForHeaders()

                },
                (error) => {
                    setIsLoaded(true);
                    setError({
                        message: "Не удалось загрузить данные. Пожалуйста перезагрузите страницу."
                    });
                }
            )
    }, [])

    function fillDataForHeaders() {
        setRows(rows.map(rowsData => {
            rowsData.data.map(async row => {
                columns.map(columnsData => {
                    columnsData.data.map(async column => {
                        let queryLinkTemplate = '/proxy/project_bible_template/'

                        if (column.type === "input") {
                            queryLinkTemplate += 'projectBibleTemplateTextByNameIfExist'
                        } else if (column.type === "checkbox") {
                            queryLinkTemplate += 'projectBibleTemplateBoolByNameIfExist'
                        }

                        await fetch(queryLinkTemplate, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "rowCode": row.code,
                                "colCode": column.code,
                            })
                        })
                            .then(res => res.json())
                            .then(
                                async (result) => {
                                    if (result.length > 0) {
                                        row.data[column.code] = result[0].value
                                    } else {
                                        if (column.type === "input") {
                                            row.data[column.code] = ""
                                        } else if (column.type === "checkbox") {
                                            row.data[column.code] = false
                                        }
                                    }

                                    cellOnCount++

                                    if (cellOnCount === cellAllCount && !error) {
                                        setIsLoaded(true);
                                    }
                                },
                                (error) => {
                                    setIsLoaded(true);
                                    setError(error);
                                }
                            )
                    })

                    return columnsData
                })
            })

            return rowsData
        }))
    }

    if (error) {
        return (
            <div className="row">
                <div className="col-sm-12 center">
                    <br />
                    <h3>Ошибка: {error.message}</h3>
                </div>
            </div>
        )
    } else if (!isLoaded) {
        return (
            <div className="row">
                <div className="col-sm-12 center">
                    <br />
                    <h3>Загрузка...</h3>
                </div>
            </div>
        )
    } else {
        console.log("columns[0].data", columns[0].data)
        console.log("rows[0].data", rows[0].data)

        return(
            <div>
                <br />
                <div className="managedQualityOnProjectBlockView">
                    <div className="row">
                        <div className="col-sm-12">
                            <TableInfo columns={columns[0].data} rows={rows[0].data}
                                       addRow={addRow} deleteRow={deleteRow} moveUpRow={moveUpRow}
                                       moveDownRow={moveDownRow} />
                            <div className="center">
                                <Button variant="primary" onClick={(e) =>
                                    addRowToTheEnd()}>Добавить&nbsp;&nbsp;<FontAwesomeIcon icon={faPlus} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
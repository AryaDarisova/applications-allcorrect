import React, {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import TableInfo from "../view/TableInfo";
import queryString from 'query-string';

export default function ProjectBibleTemplateHeader(props) {
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)

    const queryStringParams = queryString.parse(window.location.search)
    const clientName = queryStringParams.client_name
    const projectName = queryStringParams.project_name
    const projectCode = queryStringParams.project_code

    const [columns, setColumns] = useState([{
        data: []
    }])

    const [rows, setRows] = useState([{
        data: []
    }])

    let cellAllCount = 0
    let cellOnCount = 0

    useEffect(async () => {
        //проверяем создавали ли ранее этот отчет
        await fetch("/proxy/project_bible_template/projectBibleInfo", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "clientName": clientName,
                "projectName": projectName,
                "projectCode": projectCode
            }),
        })
            .then(res => res.json())
            .then(
                async (result) => {
                    //этот отчет уже создавали
                    if (result.length) {
                        console.log("we get data", result)

                        cellAllCount = result[0].columns.length * result[0].rows.length

                        result[0].columns.map(value => {
                            setColumns(
                                columns.map(info => {
                                    info.data.push({
                                        "code": value.code,
                                        "name": value.name,
                                        "type": value.type,
                                        "editable": value.editable,
                                        "template": value.template
                                    });

                                    return info
                                })
                            )

                            return value
                        })

                        result[0].rows.map(value => {
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

                        // console.log("columns, rows", columns, rows)

                        fillDataForHeaders()
                    //это новый отчет
                    } else {
                        console.log("empty data", result)
                        //todo
                        await fetch("/proxy/project_bible_template/projectBibleTemplateRowsColumns", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(res => res.json())
                            .then(
                                async (resultTemplate) => {
                                    // console.log("projectBibleTemplateRowsColumns result", resultTemplate.columns, resultTemplate.rows)

                                    await fetch("/proxy/project_bible_template/projectBibleInfoInsert", {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            "clientName": clientName,
                                            "projectName": projectName,
                                            "projectCode": projectCode,
                                            "columns": resultTemplate.columns,
                                            "rows": resultTemplate.rows
                                        }),
                                    })
                                        .then(res => res.json())
                                        .then(
                                            async (resultInsert) => {
                                                console.log("projectBibleInfoInsert result")

                                                cellAllCount = resultTemplate.columns.length * resultTemplate.rows.length

                                                resultTemplate.columns.map(value => {
                                                    setColumns(
                                                        columns.map(info => {
                                                            info.data.push({
                                                                "code": value.code,
                                                                "name": value.name,
                                                                "type": value.type,
                                                                "editable": value.editable,
                                                                "template": value.template
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
                                                setError(error);
                                            }
                                        )
                                },
                                (error) => {
                                    setIsLoaded(true);
                                    setError({
                                        message: "Не удалось сохранить информацию о новом отчете. Пожалуйста перезагрузите страницу, чтобы запустить процесс снова"
                                    });
                                }
                            )
                    }
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    function fillDataForHeaders() {
        setRows(rows.map(rowsData => {
            rowsData.data.map(async row => {
                columns.map(columnsData => {
                    columnsData.data.map(async column => {
                        let queryLinkTemplate = '/proxy/project_bible_template/'
                        let queryLinkEditable = '/proxy/project_bible_template/'

                        if (column.type === "input") {
                            // queryLinkTemplate += 'projectBibleTemplateTextByName'
                            queryLinkTemplate += 'projectBibleTemplateTextByNameIfExist'
                            queryLinkEditable += 'projectBibleFilledCellTextByName'
                        } else if (column.type === "checkbox") {
                            // queryLinkTemplate += 'projectBibleTemplateBoolByName'
                            queryLinkTemplate += 'projectBibleTemplateBoolByNameIfExist'
                            queryLinkEditable += 'projectBibleFilledCellBoolByName'
                        }

                        if (column.template & column.editable) {
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
                                    async (resultTemplate) => {
                                        await fetch(queryLinkEditable, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                "clientName": clientName,
                                                "projectName": projectName,
                                                "projectCode": projectCode,
                                                "rowCode": row.code,
                                                "colCode": column.code,
                                            })
                                        })
                                            .then(res => res.json())
                                            .then(
                                                async (resultEditable) => {
                                                    // console.log("columns[i].template columns[i].editable", resultTemplate, resultEditable)

                                                    if (resultEditable.length) {
                                                        // row.data.push(resultEditable[0].value)
                                                        row.data[column.code] = resultEditable[0].value
                                                    } else {
                                                        // row.data.push(resultTemplate)
                                                        // row.data[column.code] = resultTemplate

                                                        if (resultTemplate.length) {
                                                            row.data[column.code] = resultTemplate[0].value
                                                        } else if (column.type === "input") {
                                                            row.data[column.code] = ""
                                                        } else if (column.type === "checkbox") {
                                                            row.data[column.code] = false
                                                        }
                                                    }

                                                    cellOnCount++
                                                    console.log("cellOnCount, cellAllCount", cellOnCount, cellAllCount)

                                                    if (cellOnCount === cellAllCount && !error) {
                                                        setIsLoaded(true);
                                                    }
                                                },
                                                (error) => {
                                                    setIsLoaded(true);
                                                    setError(error);
                                                }
                                            )
                                    },
                                    (error) => {
                                        setIsLoaded(true);
                                        setError(error);
                                    }
                                )
                        } else if (column.template) {
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
                                        // console.log("columns[i].template", result)

                                        // row.data.push(result)
                                        // row.data[column.code] = result

                                        if (result.length) {
                                            row.data[column.code] = result[0].value
                                        } else if (column.type === "input") {
                                            row.data[column.code] = ""
                                        } else if (column.type === "checkbox") {
                                            row.data[column.code] = false
                                        }

                                        cellOnCount++
                                        console.log("cellOnCount, cellAllCount", cellOnCount, cellAllCount)

                                        if (cellOnCount === cellAllCount && !error) {
                                            setIsLoaded(true);
                                        }
                                    },
                                    (error) => {
                                        setIsLoaded(true);
                                        setError(error);
                                    }
                                )
                        } else if (column.editable) {
                            await fetch(queryLinkEditable, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "clientName": clientName,
                                    "projectName": projectName,
                                    "projectCode": projectCode,
                                    "rowCode": row.code,
                                    "colCode": column.code,
                                })
                            })
                                .then(res => res.json())
                                .then(
                                    async (result) => {
                                        // console.log("columns[i].editable", result)

                                        if (result.length) {
                                            // row.data.push(result[0].value)
                                            row.data[column.code] = result[0].value
                                        } else {
                                            if (column.type === "input") {
                                                // row.data.push("")
                                                row.data[column.code] = ""
                                            } else if (column.type === "checkbox") {
                                                // row.data.push(false)
                                                row.data[column.code] = false
                                            }
                                        }

                                        cellOnCount++
                                        console.log("cellOnCount, cellAllCount", cellOnCount, cellAllCount)

                                        if (cellOnCount === cellAllCount && !error) {
                                            setIsLoaded(true);
                                        }
                                    },
                                    (error) => {
                                        setIsLoaded(true);
                                        setError(error);
                                    }
                                )
                        }
                    })

                    return columnsData
                })
            })

            return rowsData
        }))

        /*if (!error) {
            setIsLoaded(true);
        }*/
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
        return(
            <div className="managedQualityOnProjectBlockView">
                <div className="row">
                    <div className="col-sm-4">
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicClientName">
                                <Form.Label>Имя клиента</Form.Label>
                                <Form.Control type="clientName" disabled
                                              placeholder={queryStringParams.client_name} />
                            </Form.Group>
                        </Form>
                    </div>
                    <div className="col-sm-4">
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicProjectName">
                                <Form.Label>Имя проекта</Form.Label>
                                <Form.Control type="projectName" disabled
                                              placeholder={queryStringParams.project_name} />
                            </Form.Group>
                        </Form>
                    </div>
                    <div className="col-sm-4">
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicProjectCode">
                                <Form.Label>Код проекта</Form.Label>
                                <Form.Control type="projectCode" disabled
                                              placeholder={queryStringParams.project_code} />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-sm-12">
                        {<TableInfo columns={columns[0].data} rows={rows[0].data} />}
                    </div>
                </div>
            </div>
        )
    }
}
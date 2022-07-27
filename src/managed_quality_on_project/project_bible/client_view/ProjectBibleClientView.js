import React, {useEffect, useState} from "react";
import queryString from 'query-string';
import {Button, Form, ProgressBar} from "react-bootstrap";
import TableInfo from "../client_view/TableInfo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilePdf} from "@fortawesome/free-solid-svg-icons";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const styles = {
    progressBar: {
        margin: '10rem 10rem'
    },
}

export default function ProjectBibleClientView(props) {
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [progressPercent, setProgressPercent] = useState(0)

    const queryStringParams = queryString.parse(window.location.search)
    const clientName = queryStringParams.client_name
    const projectName = queryStringParams.project_name
    const projectCode = queryStringParams.project_code
    const code = queryStringParams.code

    const [columns, setColumns] = useState([{
        data: []
    }])

    const [rows, setRows] = useState([{
        data: []
    }])

    const [rowsPdf, setRowsPdf] = useState([{
        data: []
    }])

    const [submit, setSubmit] = useState(false)

    let cellAllCount = 0
    let cellOnCount = 0

    const [clientColumnCount, setClientColumnCount] = useState(0)

    useEffect(async () => {
        await fetch("/proxy/project_bible_template/projectBibleClientViewByCode", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "clientName": clientName,
                "projectName": projectName,
                "projectCode": projectCode,
                "code": code
            }),
        })
            .then(res => res.json())
            .then(
                async (result) => {
                    if (result.length) {
                        await fetch("/proxy/project_bible_template/projectBibleColumnsForClientTemplate", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(res => res.json())
                            .then(
                                (resultColumnsForClient) => {
                                    if (resultColumnsForClient.columns.length) {
                                        cellAllCount = (result[0].columns.length +
                                            resultColumnsForClient.columns.length) * result[0].rows.length
                                        setClientColumnCount(resultColumnsForClient.columns.length)

                                        if (result[0].submit) {
                                            setSubmit(true)
                                        }

                                        result[0].columns.map(value => {
                                            setColumns(
                                                columns.map(info => {
                                                    info.data.push({
                                                        "code": value.code,
                                                        "name": value.name,
                                                        "type": value.type,
                                                        "editable": value.editable,
                                                        "template": value.template,
                                                        "clientColumn": false
                                                    });

                                                    return info
                                                })
                                            )

                                            return value
                                        })

                                        resultColumnsForClient.columns.map(value => {
                                            setColumns(
                                                columns.map(info => {
                                                    info.data.push({
                                                        "code": value.code,
                                                        "name": value.name,
                                                        "type": value.type,
                                                        "clientColumn": true
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

                                        fillDataForHeaders()
                                    }
                                },
                                (error) => {
                                    //todo придумать какой-то текст ошибки
                                }
                            )
                    } else {
                        setIsLoaded(true);
                        setError({
                            message: "This page doesn't exist"
                        });
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
                        if (column.clientColumn) {
                            let queryLinkClient = '/proxy/project_bible_template/'

                            if (column.type === "input") {
                                queryLinkClient += 'projectBibleClientViewFilledCellTextByName'
                            } else if (column.type === "checkbox") {
                                queryLinkClient += 'projectBibleClientViewFilledCellBoolByName'
                            }

                            await fetch(queryLinkClient, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "code": code,
                                    "rowCode": row.code,
                                    "colCode": column.code,
                                })
                            })
                                .then(res => res.json())
                                .then(
                                    async (result) => {
                                        if (result.length) {
                                            row.data[column.code] = result[0].value
                                        } else {
                                            if (column.type === "input") {
                                                row.data[column.code] = ""
                                            } else if (column.type === "checkbox") {
                                                row.data[column.code] = false
                                            }
                                        }

                                        cellOnCount++
                                        console.log("cellOnCount, cellAllCount", cellOnCount, cellAllCount)
                                        setProgressPercent(Math.round(cellOnCount / cellAllCount * 100))

                                        if (cellOnCount === cellAllCount && !error) {
                                            setIsLoaded(true);
                                        }
                                    },
                                    (error) => {
                                        setIsLoaded(true);
                                        setError(error);
                                    }
                                )
                        } else {
                            let queryLinkTemplate = '/proxy/project_bible_template/'
                            let queryLinkEditable = '/proxy/project_bible_template/'

                            if (column.type === "input") {
                                queryLinkTemplate += 'projectBibleTemplateTextByNameIfExist'
                                queryLinkEditable += 'projectBibleFilledCellTextByName'
                            } else if (column.type === "checkbox") {
                                queryLinkTemplate += 'projectBibleTemplateBoolByNameIfExist'
                                queryLinkEditable += 'projectBibleFilledCellBoolByName'
                            } else if (column.type === "tags_list") {
                                queryLinkTemplate += 'projectBibleTemplateTagJsonByNameIfExist'
                                queryLinkEditable += 'projectBibleFilledCellBoolByName'
                            }

                            if (column.template && column.editable) {
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
                                                        if (resultEditable.length) {
                                                            row.data[column.code] = resultEditable[0].value
                                                        } else {
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
                                                        setProgressPercent(Math.round(cellOnCount / cellAllCount * 100))

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
                                            if (result.length) {
                                                row.data[column.code] = result[0].value
                                            } else if (column.type === "input") {
                                                row.data[column.code] = ""
                                            } else if (column.type === "checkbox") {
                                                row.data[column.code] = false
                                            } else if (column.type === "tags_list") {
                                                row.data[column.code] = []
                                            }

                                            cellOnCount++
                                            console.log("cellOnCount, cellAllCount", cellOnCount, cellAllCount)
                                            setProgressPercent(Math.round(cellOnCount / cellAllCount * 100))

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
                                            if (result.length) {
                                                row.data[column.code] = result[0].value
                                            } else {
                                                if (column.type === "input") {
                                                    row.data[column.code] = ""
                                                } else if (column.type === "checkbox") {
                                                    row.data[column.code] = false
                                                } else if (column.type === "tags_list") {
                                                    row.data[column.code] = []
                                                }
                                            }

                                            cellOnCount++
                                            console.log("cellOnCount, cellAllCount", cellOnCount, cellAllCount)
                                            setProgressPercent(Math.round(cellOnCount / cellAllCount * 100))

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
                        }
                    })

                    return columnsData
                })
            })

            return rowsData
        }))
    }

    function createPdf(code, countClientColumns) {
        let rowsPdf = rows[0].data
        let clientCellOncount = 0

        rowsPdf.map(row => {
            columns.map(columnsData => {
                columnsData.data.map(async column => {
                    if (column.clientColumn) {
                        let queryLinkClient = '/proxy/project_bible_template/'

                        if (column.type === "input") {
                            queryLinkClient += 'projectBibleClientViewFilledCellTextByName'
                        } else if (column.type === "checkbox") {
                            queryLinkClient += 'projectBibleClientViewFilledCellBoolByName'
                        }

                        await fetch(queryLinkClient, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "code": code,
                                "rowCode": row.code,
                                "colCode": column.code,
                            })
                        })
                            .then(res => res.json())
                            .then(
                                async (result) => {
                                    if (result.length) {
                                        row.data[column.code] = result[0].value.replace(/<br>/g, " ")
                                    } else {
                                        if (column.type === "input") {
                                            row.data[column.code] = ""
                                        } else if (column.type === "checkbox") {
                                            row.data[column.code] = false
                                        }
                                    }

                                    clientCellOncount++

                                    if (clientCellOncount === countClientColumns * rowsPdf.length) {
                                        pdfMake.vfs = pdfFonts.pdfMake.vfs;

                                        let docDefinition = {
                                            pageOrientation: 'landscape',
                                            content: [
                                                {text: 'Project Bible\n\n\n', style: 'header', alignment: 'center', fontSize: 16},
                                                {
                                                    style: 'tableExample',
                                                    fontSize: 10,
                                                    table: {
                                                        headerRows: 1,
                                                        dontBreakRows: true,
                                                        body: rowsForDownloadPdf(columns[0].data, rowsPdf)
                                                    }
                                                },
                                            ]
                                        }

                                        pdfMake.createPdf(docDefinition).download();
                                    }
                                },
                                (error) => {

                                }
                            )
                    }

                    return column
                })

                return columnsData
            })

            return row
        })
    }

    function rowsForDownloadPdf(columns, rows) {
        let data = []
        let headers = []

        headers.push({
            text: '№',
            style: 'tableHeader',
            fontSize: 10,
            bold: true
        })

        columns.map(column => {
            headers.push({
                text: column.name,
                style: 'tableHeader',
                fontSize: 10,
                bold: true
            });

            return column
        })

        data.push(headers)

        rows.map((row, index) => {
            let value = []

            value.push({
                text: String(index + 1),
                style: 'tableHeader',
                fontSize: 10
            });

            columns.map(column => {
                if (column.type === "input") {
                    value.push({
                        text: String(row.data[column.code].replace(/<br>/g, " ")),
                        style: 'tableHeader',
                        fontSize: 10
                    });
                } else if (column.type === "checkbox") {
                    value.push({
                        text: String(row.data[column.code] ? "YES" : ""),
                        style: 'tableHeader',
                        fontSize: 10
                    });
                }
            })

            data.push(value)
        })

        return data
    }

    async function submitClientView() {
        await fetch("/proxy/project_bible_template/projectBibleClientViewSubmit", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "code": code,
                "value": true
            }),
        })
            .then(res => res.json())
            .then(
                async (result) => {
                    setSubmit(true)
                },
                (error) => {

                }
            )
    }

    if (error) {
        return (
            <div className="row">
                <div className="col-sm-12 center">
                    <br />
                    <h3>Error: {error.message}</h3>
                </div>
            </div>
        )
    } else if (!isLoaded) {
        return (
            <div className="row" style={styles.progressBar}>
                <div className="col-sm-4">

                </div>
                <div className="col-sm-4 center">
                    <h4>Loading...</h4>
                    <ProgressBar now={progressPercent} label={`${progressPercent}%`} />
                </div>
                <div className="col-sm-4">

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
                                <Form.Label>Client</Form.Label>
                                <Form.Control type="clientName" disabled
                                              placeholder={queryStringParams.client_name} />
                            </Form.Group>
                        </Form>
                    </div>
                    <div className="col-sm-4">
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicProjectName">
                                <Form.Label>Project name</Form.Label>
                                <Form.Control type="projectName" disabled
                                              placeholder={queryStringParams.project_name} />
                            </Form.Group>
                        </Form>
                    </div>
                    <div className="col-sm-4 center">
                        <br />
                        <Button variant="primary" onClick={(e) => createPdf(code, clientColumnCount)}>
                            Download pdf&nbsp;&nbsp;<FontAwesomeIcon icon={faFilePdf}/>
                        </Button>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-sm-12 tableFixHead">
                        {<TableInfo columns={columns[0].data} rows={rows[0].data} submit={submit} />}
                    </div>
                </div>
                <br />
                {
                    !submit &&
                    <div className="row">
                        <div className="col-sm-12 center">
                            <Button variant="primary" onClick={(e) => submitClientView()}>
                                Submit
                            </Button>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
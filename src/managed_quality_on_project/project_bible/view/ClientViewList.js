import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilePdf, faTimes, faLink, faCopy} from "@fortawesome/free-solid-svg-icons";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const styles = {
    blockView: {
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '5px',
        margin: '0px'
    },
}

export default function ClientViewList(props) {
    function openLink(code) {
        let link = window.location.href.split("/")

        window.open('http://' + link[2] + '/managed_quality_on_project/project_bible/client_view?client_name=' +
            props.clientName + '&project_name=' + props.projectName + '&project_code=' + props.projectCode +
            '&code=' + code + '#', '_blank')
    }

    async function createPdf(code) {
        await fetch("/proxy/project_bible_template/projectBibleClientViewByCode", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "clientName": props.clientName,
                "projectName": props.projectName,
                "projectCode": props.projectCode,
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
                                        let columns = []
                                        let rows = []
                                        let cellAllCount = (result[0].columns.length +
                                            resultColumnsForClient.columns.length) * result[0].rows.length
                                        let cellOnCount = 0

                                        result[0].columns.map(value => {
                                            columns.push({
                                                "code": value.code,
                                                "name": value.name,
                                                "type": value.type,
                                                "editable": value.editable,
                                                "template": value.template,
                                                "clientColumn": false
                                            })

                                            return value
                                        })

                                        resultColumnsForClient.columns.map(value => {
                                            columns.push({
                                                "code": value.code,
                                                "name": value.name,
                                                "type": value.type,
                                                "clientColumn": true
                                            })

                                            return value
                                        })

                                        result[0].rows.map(value => {
                                            rows.push({
                                                "code": value.code,
                                                "data": []
                                            })

                                            return value
                                        })

                                        pdfFillRows(columns, rows, code, cellAllCount, cellOnCount)
                                    }
                                },
                                (error) => {

                                }
                            )
                    } else {

                    }
                },
                (error) => {

                }
            )
    }

    function pdfFillRows(columns, rows, code, cellAllCount, cellOnCount) {
        rows.map(row => {
            columns.map(async column => {
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
                                    // row.data[column.code] = result[0].value

                                    if (column.type === "input") {
                                        row.data[column.code] = result[0].value.replace(/<br>/g, " ")
                                    } else if (column.type === "checkbox") {
                                        row.data[column.code] = result[0].value ? "YES" : ""
                                    }
                                } else {
                                    row.data[column.code] = ""
                                }

                                cellOnCount++

                                if (cellOnCount === cellAllCount) {
                                    downloadPdf(columns, rows)
                                }
                            },
                            (error) => {

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
                                            "clientName": props.clientName,
                                            "projectName": props.projectName,
                                            "projectCode": props.projectCode,
                                            "rowCode": row.code,
                                            "colCode": column.code,
                                        })
                                    })
                                        .then(res => res.json())
                                        .then(
                                            async (resultEditable) => {
                                                if (resultEditable.length) {
                                                    // row.data[column.code] = resultEditable[0].value

                                                    if (column.type === "input") {
                                                        row.data[column.code] = resultEditable[0].value.replace(/<br>/g, " ")
                                                    } else if (column.type === "checkbox") {
                                                        row.data[column.code] = resultEditable[0].value ? "YES" : ""
                                                    }
                                                } else {
                                                    if (resultTemplate.length) {
                                                        // row.data[column.code] = resultTemplate[0].value

                                                        if (column.type === "input") {
                                                            row.data[column.code] = resultTemplate[0].value.replace(/<br>/g, " ")
                                                        } else if (column.type === "checkbox") {
                                                            row.data[column.code] = resultTemplate[0].value ? "YES" : ""
                                                        }
                                                    } else {
                                                        row.data[column.code] = ""
                                                    }
                                                }

                                                cellOnCount++

                                                if (cellOnCount === cellAllCount) {
                                                    downloadPdf(columns, rows)
                                                }
                                            },
                                            (error) => {

                                            }
                                        )
                                },
                                (error) => {

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
                                        // row.data[column.code] = result[0].value

                                        if (column.type === "input") {
                                            row.data[column.code] = result[0].value.replace(/<br>/g, " ")
                                        } else if (column.type === "checkbox") {
                                            row.data[column.code] = result[0].value ? "YES" : ""
                                        }
                                    } else {
                                        row.data[column.code] = ""
                                    }

                                    cellOnCount++

                                    if (cellOnCount === cellAllCount) {
                                        downloadPdf(columns, rows)
                                    }
                                },
                                (error) => {

                                }
                            )
                    } else if (column.editable) {
                        await fetch(queryLinkEditable, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "clientName": props.clientName,
                                "projectName": props.projectName,
                                "projectCode": props.projectCode,
                                "rowCode": row.code,
                                "colCode": column.code,
                            })
                        })
                            .then(res => res.json())
                            .then(
                                async (result) => {
                                    if (result.length) {
                                        // row.data[column.code] = result[0].value

                                        if (column.type === "input") {
                                            row.data[column.code] = result[0].value.replace(/<br>/g, " ")
                                        } else if (column.type === "checkbox") {
                                            row.data[column.code] = result[0].value ? "YES" : ""
                                        }
                                    } else {
                                        row.data[column.code] = ""
                                    }

                                    cellOnCount++

                                    if (cellOnCount === cellAllCount) {
                                        downloadPdf(columns, rows)
                                    }
                                },
                                (error) => {

                                }
                            )
                    }
                }
            })
        })
    }

    function downloadPdf(columns, rows) {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        let docDefinition = {
            pageOrientation: 'landscape',
            content: [
                {text: 'Project Bible\n\n\n', style: 'header', alignment: 'center', fontSize: 16},
                // {text: '', style: 'subheader', fontSize: 18},
                {
                    style: 'tableExample',
                    fontSize: 10,
                    table: {
                        headerRows: 1,
                        dontBreakRows: true,
                        body: rowsForDownloadPdf(columns, rows) /*[
                            [
                            headersForDownloadPdf(columns)
                                /!*{text: 'Header 1', style: 'tableHeader', fontSize: 10},
                                {text: 'Header 2', style: 'tableHeader', fontSize: 10},
                                {text: 'Header 3', style: 'tableHeader', fontSize: 10}*!/
                            ],
                            /!*[
                                {text: 'Project Bible', fontSize: 10},
                                {text: 'Project Bible', fontSize: 10},
                                {text: 'Project Bible', fontSize: 10},
                            ]*!/
                            rowsForDownloadPdf(columns, rows)
                        ]*/
                    }
                },
            ]
        }

        pdfMake.createPdf(docDefinition).download();
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
                value.push({
                    text: String(row.data[column.code]),
                    style: 'tableHeader',
                    fontSize: 10
                });
            })

            data.push(value)
            // data.push(Object.assign({}, value))
        })

        console.log("rowsForDownloadPdf", data)
        return data
    }

    function copyLink(code) {
        let area = document.createElement('textarea');
        document.body.appendChild(area);
        let link = window.location.href.split("/")
        area.value = 'http://' + link[2] + '/managed_quality_on_project/project_bible/client_view?client_name=' +
            props.clientName + '&project_name=' + props.projectName + '&project_code=' + props.projectCode +
            '&code=' + code + '#';
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
    }

    return(
        <div style={styles.blockView}>
            <h4>Ссылки с отчетом для заполнения клиенту:</h4>
            <br />
            {
                props.clientViewList.map((value, index) => {
                    return(
                        <div key={value.code}>
                            <div className="row">
                                <div className="col-sm-12">
                                    Дата создания: {value.date}
                                    &nbsp;&nbsp;
                                    { value.submit ? <b>(Завершена)</b> : <b>(В процессе)</b> }
                                    &nbsp;&nbsp;
                                    <Button variant="light" onClick={(e) => openLink(value.code)}>
                                        Открыть ссылку&nbsp;&nbsp;<FontAwesomeIcon icon={faLink}/>
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button variant="secondary" onClick={(e) => copyLink(value.code)}>
                                        Копировать ссылку&nbsp;&nbsp;<FontAwesomeIcon icon={faCopy}/>
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button variant="primary" onClick={(e) => createPdf(value.code)}>
                                        Выгрузить pdf&nbsp;&nbsp;<FontAwesomeIcon icon={faFilePdf}/>
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button variant="danger" onClick={(e) => props.deleteClientView(value.code, index)}>
                                        Удалить ссылку&nbsp;&nbsp;<FontAwesomeIcon icon={faTimes}/>
                                    </Button>
                                </div>
                            </div>
                            <br />
                        </div>
                    )
                })
            }
        </div>
    )
}
import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilePdf, faTimes, faLink, faCopy} from "@fortawesome/free-solid-svg-icons";
import { jsPDF } from "jspdf";

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
        await fetch("/proxy/project_bible_template/projectBibleClientView", {
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
                                        row.data[column.code] = result[0].value
                                    } else if (column.type === "checkbox") {
                                        row.data[column.code] = result[0].value ? "✓" : ""
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
                                                        row.data[column.code] = resultEditable[0].value
                                                    } else if (column.type === "checkbox") {
                                                        row.data[column.code] = resultEditable[0].value ? "✓" : ""
                                                    }
                                                } else {
                                                    if (resultTemplate.length) {
                                                        // row.data[column.code] = resultTemplate[0].value

                                                        if (column.type === "input") {
                                                            row.data[column.code] = resultTemplate[0].value
                                                        } else if (column.type === "checkbox") {
                                                            row.data[column.code] = resultTemplate[0].value ? "✓" : ""
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
                                            row.data[column.code] = result[0].value
                                        } else if (column.type === "checkbox") {
                                            row.data[column.code] = result[0].value ? "✓" : ""
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
                                            row.data[column.code] = result[0].value
                                        } else if (column.type === "checkbox") {
                                            row.data[column.code] = result[0].value ? "✓" : ""
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
        console.log("downloadPdf", columns, rows)

        const doc = new jsPDF(
            { putOnlyUsedFonts: true, orientation: "portrait" }
        );

        // doc.addFont("/src/managed_quality_on_project/fonts/PT_Sans-Web-Regular.ttf", "PTSans", "regular");
        // doc.setFont("PTSans");

        doc.text("Project Bible", 105, 20, null, null, "center");
        doc.table(20, 40, rowsForDownloadPdf(columns, rows), headersForDownloadPdf(columns),
            { printHeaders: true, autoSize: true, fontSize: 10, headerBackgroundColor: '#fafafa' });

        doc.save("project_bible.pdf");
    }

    function headersForDownloadPdf(columns) {
        let headers = [];

        headers.push({
            id: "Num",
            name: "Num",
            prompt: "Num",
            width: 65,
            align: "center",
            padding: 0
        })

        columns.map(column => {
            headers.push({
                id: column.code,
                name: column.code,
                prompt: column.name,
                width: 65,
                align: "center",
                padding: 0
            });

            return column
        })

        /*for (var i = 0; i < columns.length; i += 1) {
            headers.push({
                id: columns.name,
                name: columns.name,
                prompt: columns.name,
                width: 65,
                align: "center",
                padding: 0
            });
        }*/

        console.log("headersForDownloadPdf", headers)
        return headers
    }

    function rowsForDownloadPdf(columns, rows) {
        let data = []

        rows.map((row, index) => {
            let value = []

            value["Num"] = String(index + 1)

            console.log("rowsForDownloadPdf", row)

            columns.map(column => {
                value[column.code] = row.data[column.code]
            })

            // data.push(value)
            data.push(Object.assign({}, value))
        })

        /*
        var generateData = function(amount) {
            var result = [];
            var data = {
                coin: "100",
                game_group: "GameGroup",
                game_name: "XPTO2",
                game_version: "25",
                machine: "20485861",
                vlt: "0"
            };
            for (var i = 0; i < amount; i += 1) {
                data.id = (i + 1).toString();
                result.push(Object.assign({}, data));
            }
            return result;
        };
*/

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
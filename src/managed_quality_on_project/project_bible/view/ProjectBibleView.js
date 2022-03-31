import React, {useEffect, useState} from "react";
import {Button, Form, ProgressBar} from "react-bootstrap";
import TableInfo from "../view/TableInfo";
import Filter from "../view/Filter";
import ClientViewList from "../view/ClientViewList";
import queryString from 'query-string';
import "../css/tableFixHeader.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilePdf, faFilter, faUserTie, faFileExcel} from "@fortawesome/free-solid-svg-icons";
import XLSX from "xlsx";

const styles = {
    blockView: {
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '5px',
        margin: '0px'
    },

    progressBar: {
        margin: '10rem 10rem'
    },
}

export default function ProjectBibleView(props) {
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [actionColumn, setActionColumn] = useState(true)
    const [progressPercent, setProgressPercent] = useState(0)

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

    const [clientViewsList, setClientViewsList] = useState([{
        data: []
    }])

    let cellAllCount = 0
    let cellOnCount = 0

    async function moveUpRow(code, num) {
        if (num !== 1) {
            let value = rows[0].data[num - 1]
            let rowsForUpdate = []

            setRows(
                rows.map(info => {
                    info.data.splice(num - 1, 1)
                    info.data.splice(num - 2, 0, value)

                    info.data.map(value => {
                        rowsForUpdate.push({
                            code: value.code
                        })
                    })

                    return info
                })
            )

            await fetch("/proxy/project_bible_template/projectBibleInfoMoveUpRow", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "clientName": clientName,
                    "projectName": projectName,
                    "projectCode": projectCode,
                    "rows": rowsForUpdate
                })
            })
                .then(res => res.json())
                .then(
                    (resultMoveUp) => {

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
            let value = rows[0].data[num - 1]
            let rowsForUpdate = []

            setRows(
                rows.map(info => {
                    info.data.splice(num - 1, 1)
                    info.data.splice(num, 0, value)

                    info.data.map(value => {
                        rowsForUpdate.push({
                            code: value.code
                        })
                    })

                    return info
                })
            )

            await fetch("/proxy/project_bible_template/projectBibleInfoMoveDownRow", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "clientName": clientName,
                    "projectName": projectName,
                    "projectCode": projectCode,
                    "rows": rowsForUpdate
                })
            })
                .then(res => res.json())
                .then(
                    (resultMoveDown) => {

                    },
                    (error) => {
                        //todo придумать какой-то текст ошибки
                    }
                )
        }
    }

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
                                        "template": value.template,
                                        "filter": {
                                            "show": true,
                                            "showAll": {
                                                "value": true,
                                                "showFilledCells": true,
                                                "showEmptyCells": true,
                                                "data": new Map(),
                                                "selectedData": []
                                            }
                                        }
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
                                        "show": true,
                                        "data": [],
                                        "template": []
                                    });

                                    return info
                                })
                            )

                            return value
                        })

                        fillDataForHeaders()
                        fillDataForClientViewsList()
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
                                                cellAllCount = resultTemplate.columns.length * resultTemplate.rows.length

                                                resultTemplate.columns.map(value => {
                                                    setColumns(
                                                        columns.map(info => {
                                                            info.data.push({
                                                                "code": value.code,
                                                                "name": value.name,
                                                                "type": value.type,
                                                                "editable": value.editable,
                                                                "template": value.template,
                                                                "filter": {
                                                                    "show": true,
                                                                    "showAll": {
                                                                        "value": true,
                                                                        "showFilledCells": true,
                                                                        "showEmptyCells": true,
                                                                        "data": new Map(),
                                                                        "selectedData": []
                                                                    }
                                                                }
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
                                                                "show": true,
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
                                                    // console.log("columns[i].template columns[i].editable", resultTemplate, resultEditable)

                                                    if (resultEditable.length) {
                                                        row.data[column.code] = resultEditable[0].value

                                                        if (column.type === "checkbox") {
                                                            if (resultTemplate.length) {
                                                                console.log("тут должен быть шаблон и он есть", resultTemplate)
                                                                row.template[column.code] = resultTemplate[0].value
                                                            } else {
                                                                console.log("тут должен быть шаблон", resultTemplate)
                                                                row.template[column.code] = false
                                                            }
                                                        }
                                                        /*if (column.type === "input") {
                                                            row.data[column.code] = resultEditable[0].value
                                                        } else if (column.type === "checkbox") {
                                                            console.log("resultTemplate", row.code, column.code, resultTemplate)

                                                            row.data[column.code] = {
                                                                edit: resultEditable[0].value,
                                                                template: resultTemplate[0].value
                                                            }
                                                        }*/

                                                        if (resultEditable[0].value) {
                                                            setDataForSelectInColumn(column.code, resultEditable[0].value)
                                                        }
                                                    } else {
                                                        if (resultTemplate.length) {
                                                            row.data[column.code] = resultTemplate[0].value

                                                            if (column.type === "checkbox") {
                                                                row.template[column.code] = resultTemplate[0].value
                                                            }

                                                            if (resultTemplate[0].value) {
                                                                setDataForSelectInColumn(column.code, resultTemplate[0].value)
                                                            }
                                                        } else if (column.type === "input") {
                                                            row.data[column.code] = ""
                                                        } else if (column.type === "checkbox") {
                                                            row.data[column.code] = false
                                                            row.template[column.code] = false
                                                            /*row.data[column.code] = {
                                                                edit: false,
                                                                template: false
                                                            }*/
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
                                        // console.log("columns[i].template", result)

                                        // row.data.push(result)
                                        // row.data[column.code] = result

                                        if (result.length) {
                                            row.data[column.code] = result[0].value

                                            if (result[0].value) {
                                                setDataForSelectInColumn(column.code, result[0].value)
                                            }
                                        } else if (column.type === "input") {
                                            row.data[column.code] = ""
                                        } else if (column.type === "checkbox") {
                                            row.data[column.code] = false
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
                                        // console.log("columns[i].editable", result)
                                        if (result.length) {
                                            // row.data.push(result[0].value)
                                            row.data[column.code] = result[0].value

                                            if (result[0].value) {
                                                setDataForSelectInColumn(column.code, result[0].value)
                                            }
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
                    })

                    return columnsData
                })
            })

            return rowsData
        }))
    }

    function changeFilter(code, type, field, e) {
        if (field === "show") {
            setColumns(
                columns.map(info => {
                    info.data.map(value => {
                        if (value.code === code) {
                            value.filter.show = e.target.checked
                        }

                        return value
                    })

                    return info
                })
            )
        } else if (field === "showAll") {
            setColumns(
                columns.map(info => {
                    info.data.map(value => {
                        if (value.code === code) {
                            value.filter.showAll.value = e.target.checked
                        }

                        return value
                    })

                    return info
                })
            )
        } else if (field === "showEmptyCells") {
            setColumns(
                columns.map(info => {
                    info.data.map(value => {
                        if (value.code === code) {
                            value.filter.showAll.showEmptyCells = e.target.checked
                        }

                        return value
                    })

                    return info
                })
            )
        } else if (field === "showFilledCells") {
            setColumns(
                columns.map(info => {
                    info.data.map(value => {
                        if (value.code === code) {
                            value.filter.showAll.showFilledCells = e.target.checked
                        }

                        return value
                    })

                    return info
                })
            )
        }
    }

    function setDataForSelectInColumn(code, dataField) {
        setColumns(
            columns.map(info => {
                info.data.map(value => {
                    if (value.code === code) {
                        if (!value.filter.showAll.data.has(dataField)) {
                            value.filter.showAll.data.set(dataField, dataField)
                        }
                    }

                    return value
                })

                return info
            })
        )
    }

    function setSelectedDataForColumnInMultiselect(code, selectedItems) {
        setColumns(
            columns.map(info => {
                info.data.map(value => {
                    if (value.code === code) {
                        value.filter.showAll.selectedData = selectedItems
                    }

                    return value
                })

                return info
            })
        )
    }

    function filterTable() {
        setActionColumn(false)
        setAllRowsShow()

        columns.map(info => {
            info.data.map((column, index) => {
                if (column.filter.show) {
                    if (!column.filter.showAll.value) {
                        if (column.type === "input") {
                            filterFindInputRowsToRemove(column.code, column.filter.showAll.selectedData, column.filter.showAll.showEmptyCells)
                        } else if (column.type === "checkbox") {
                            filterFindCheckboxRowsToRemove(column.code, column.filter.showAll.showFilledCells)
                        }
                    }
                }

                return column
            })

            return info
        })
    }

    function setAllRowsShow() {
        setRows(
            rows.map(info => {
                info.data.map(row => {
                    row.show = true

                    return row
                })

                return info
            })
        )
    }

    function filterFindInputRowsToRemove(code, selectedData, showEmptyCells) {
        setRows(
            rows.map(info => {
                info.data.map(row => {
                    let removeValue = true;

                    selectedData.map(selectedDataValue => {
                        if (row.data[code] === selectedDataValue) {
                            removeValue = false;
                        }
                    })

                    if (showEmptyCells) {
                        if (row.data[code] === "") {
                            //todo наверное стоит сделать удаление всех пробелов в пустой строке, только делать это в
                            // момент сохранения значения ячейки
                            removeValue = false;
                        }
                    }

                    if (removeValue) {
                        row.show = false
                    }

                    return row
                })

                return info
            })
        )
    }

    function filterFindCheckboxRowsToRemove(code, showFilledCells) {
        console.log("filterFindCheckboxRowsToRemove", rows)

        setRows(
            rows.map(info => {
                info.data.map(row => {
                    if (row.data[code] !== showFilledCells) {
                        row.show = false
                    }

                    return row
                })

                return info
            })
        )
    }

    function resetFilter() {
        setActionColumn(true)

        setColumns(
            columns.map(info => {
                info.data.map(column => {
                    column.filter.show = true
                    column.filter.showAll.value = true
                    column.filter.showAll.showFilledCells = true
                    column.filter.showAll.showEmptyCells = true
                    column.filter.showAll.selectedData = []

                    return column
                })

                return info
            })
        )

        setRows(
            rows.map(info => {
                info.data.map(row => {
                    row.show = true

                    return row
                })

                return info
            })
        )
    }

    async function createClientView() {
        await fetch("/proxy/project_bible_template/projectBibleClientViewGenerateIndividualCode", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                async (resultGenerate) => {
                    if (!resultGenerate.exist.length) {
                        let columnsForClientView = createColumnsArrayForClientView()
                        let rowsForClientView = createRowsArrayForClientView()

                        await fetch("/proxy/project_bible_template/projectBibleClientViewInsert", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "clientName": clientName,
                                "projectName": projectName,
                                "projectCode": projectCode,
                                "code": resultGenerate.individualCode,
                                "columns": columnsForClientView,
                                "rows": rowsForClientView
                            }),
                        })
                            .then(res => res.json())
                            .then(
                                (resultAdd) => {
                                    let link = window.location.href.split("/")

                                    window.open(
                                        'http://' + link[2] + '/managed_quality_on_project/project_bible/client_view?client_name=' +
                                        clientName + '&project_name=' + projectName + '&project_code=' + projectCode +
                                        '&code=' + resultGenerate.individualCode + '#', '_blank')

                                    setClientViewsList(
                                        clientViewsList.map(info => {
                                            info.data.push({
                                                code: resultGenerate.individualCode,
                                                submit: false,
                                                date: new Date().toJSON().slice(0,10).replace(/-/g,'-')
                                            })

                                            return info
                                        })
                                    )
                                },
                                (error) => {
                                    //todo придумать какой-то текст ошибки
                                }
                            )
                    } else {
                        createClientView()
                    }
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    function createColumnsArrayForClientView() {
        let requiredColumns = []

        columns.map(info => {
            info.data.map(column => {
                if (column.filter.show) {
                    requiredColumns.push({
                        "code": column.code,
                        "name": column.name,
                        "type": column.type,
                        "editable": column.editable,
                        "template": column.template,
                    })
                }

                return column
            })

            return info
        })

        return requiredColumns
    }

    function createRowsArrayForClientView() {
        let requiredRows = []

        rows.map(info => {
            info.data.map(row => {
                if (row.show) {
                    requiredRows.push({
                        "code": row.code
                    })
                }

                return row
            })

            return info
        })

        return requiredRows
    }

    async function fillDataForClientViewsList() {
        await fetch("/proxy/project_bible_template/projectBibleClientView", {
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
                (resultClientView) => {
                    console.log("resultClientView", resultClientView)

                    resultClientView.map(value => {
                        setClientViewsList(
                            clientViewsList.map(info => {
                                let cutDate = value["date_create"].substr(0, 10)
                                let correctDate = new Date(cutDate);
                                // correctDate.setDate(correctDate.getDate() + 1)

                                info.data.push({
                                    code: value.code,
                                    submit: value.submit,
                                    date: correctDate.toISOString().split('T')[0]
                                })

                                return info
                            })
                        )

                        return value
                    })
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    async function deleteClientView(code, index) {
        await fetch("/proxy/project_bible_template/projectBibleClientViewDelete", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "code": code
            }),
        })
            .then(res => res.json())
            .then(
                (resultDelete) => {
                    setClientViewsList(
                        clientViewsList.map(info => {
                            info.data.splice(index, 1)

                            return info
                        })
                    )
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    function createExcel() {
        let wb = XLSX.utils.book_new()
        let ws_data = excelData()
        let ws = XLSX.utils.aoa_to_sheet(ws_data)

        wb.Props = {
            Title: "Project Bible",
            Subject: "Project Bible",
            Author: "Allcorrect"
        }

        wb.SheetNames.push("Project_Bible")
        wb.Sheets["Project_Bible"] = ws
        XLSX.writeFile(wb, "project_bible.xlsx")
    }

    function excelData() {
        let data = []
        let rowCount = 1

        columns.map(info => {
            let headers = []

            headers.push("№")

            info.data.map(column => {
                if (column.filter.show) {
                    headers.push(column.name)
                }

                return column
            })

            data.push(headers)

            return info
        })

        rows.map(rowInfo => {
            rowInfo.data.map((row, index) => {
                if (row.show) {
                    let value = []

                    value.push(rowCount++)

                    columns.map(columnInfo => {
                        columnInfo.data.map(column => {
                            if (column.filter.show) {
                                value.push(row.data[column.code])
                            }

                            return column
                        })

                        return columnInfo
                    })

                    data.push(value)
                }

                return row
            })

            return rowInfo
        })

        console.log("excelData", data)
        return data
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
        let columnsTable = []

        columnsTable.push({
            
        })

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
                <div className="row" style={styles.blockView}>
                    <div className="col-sm-12">
                        <Filter columns={columns[0].data} changeFilter={changeFilter}
                                selectedDataMultiselect={setSelectedDataForColumnInMultiselect}
                                filterTable={filterTable} resetFilter={resetFilter} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-sm-12 tableFixHead">
                        {<TableInfo columns={columns[0].data} rows={rows[0].data} moveUpRow={moveUpRow}
                                    moveDownRow={moveDownRow} actionColumn={actionColumn} />}
                    </div>
                </div>
                <br />
                <br />
                <div className="row">
                    <div className="col-sm-12 center">
                        <Button variant="dark" onClick={(e) => createClientView()}>
                            Создать страницу для клиента&nbsp;&nbsp;<FontAwesomeIcon icon={faUserTie} />
                        </Button>
                        &nbsp;&nbsp;
                        <Button variant="success" onClick={(e) => createExcel()}>
                            Выгрузить excel&nbsp;&nbsp;<FontAwesomeIcon icon={faFileExcel}/>
                        </Button>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <div className="row">
                    <div className="col-sm-12 center">
                        <ClientViewList clientName={clientName} projectName={projectName} projectCode={projectCode}
                                        clientViewList={clientViewsList[0].data} deleteClientView={deleteClientView} />
                    </div>
                </div>
            </div>
        )
    }
}
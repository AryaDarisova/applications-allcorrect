import React, {useEffect, useState} from "react";
import {Alert, Button, Table} from "react-bootstrap";
import TableInfo from "../template_body/TableInfo";
import TagModal from "../template_body/TagModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";

const styles = {
    alertMargin: {
        marginLeft: '.5rem',
        marginRight: '.5rem',
    },

    smallBtn: {
        height: '25px',
        paddingBottom: '0px',
        paddingTop: '0px'
    }
}

export default function ProjectBibleTemplateHeader(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoadedTagData, setIsLoadedTagData] = useState(false);
    const [columns, setColumns] = useState([{
        data: []
    }])
    const [rows, setRows] = useState([{
        data: []
    }])
    const [showAlert, setShowAlert] = useState(true)
    const [tagModalActive, setTagModalActive] = useState(false);
    const [tagModalData, setTagModalData] = useState([{
        allTags: [],
        selectedTags: [],
        row: '',
        column: ''
    }])

    let cellAllCount = 0
    let cellOnCount = 0

    async function addRowToTheEnd() {
        await fetch("/proxy/project_bible_template/projectBibleTemplateGenerateRowIndividualCode", {
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
                                    //todo ?????????????????? ??????????-???? ?????????? ????????????
                                }
                            )
                    } else {
                        addRowToTheEnd()
                    }
                },
                (error) => {
                    //todo ?????????????????? ??????????-???? ?????????? ????????????
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
                                                //todo ?????????????????? ??????????-???? ?????????? ????????????
                                            }
                                        )
                                },
                                (error) => {
                                    //todo ?????????????????? ??????????-???? ?????????? ????????????
                                }
                            )
                    } else {
                        addRow(num)
                    }
                },
                (error) => {
                    //todo ?????????????????? ??????????-???? ?????????? ????????????
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
                                //todo ?????????????????? ??????????-???? ?????????? ????????????
                            }
                        )
                },
                (error) => {
                    //todo ?????????????????? ??????????-???? ?????????? ????????????
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
                        //todo ?????????????????? ??????????-???? ?????????? ????????????
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
                        //todo ?????????????????? ??????????-???? ?????????? ????????????
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
                    //todo ???????????? ???????????? + 1
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
                    fillTagData()
                },
                (error) => {
                    setIsLoaded(true);
                    setIsLoadedTagData(true);
                    setError({
                        message: "???? ?????????????? ?????????????????? ????????????. ???????????????????? ?????????????????????????? ????????????????."
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
                        } else if (column.type === "tags_list") {
                            queryLinkTemplate += 'projectBibleTemplateTagJsonByNameIfExist'
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
                                        } else if (column.type === "tags_list") {
                                            row.data[column.code] = []
                                        }
                                    }

                                    cellOnCount++

                                    if (cellOnCount === cellAllCount && !error) {
                                        setIsLoaded(true);
                                    }
                                },
                                (error) => {
                                    setIsLoaded(true);
                                    setIsLoadedTagData(true);
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

    async function fillTagData() {
        await fetch("/proxy/project_bible_template/projectBibleTemplateTags", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                async (resultTags) => {
                    setTagModalData(
                        tagModalData.map(info => {
                            let resultData = []

                            resultTags.tag_groups.map(value => {
                                let groupCode = value.code
                                let groupTitle = value.name

                                resultData[groupCode] = {"code": groupCode, "title": groupTitle, "data": []}

                                return value
                            })

                            resultTags.tags.map(value => {
                                let groupCode = value["tag_group"]
                                let tagCode = value["tag_code"]

                                resultData[groupCode].data[tagCode] = {
                                    "code": tagCode, "title": value.value
                                }

                                return value
                            })

                            info.allTags = resultData

                            return info
                        })
                    )

                    setIsLoadedTagData(true)
                },
                (error) => {
                    setIsLoaded(true)
                    setIsLoadedTagData(true)
                    setError(error)
                }
            )
    }

    async function setTagValue(val, row, column) {
        await fetch('/proxy/project_bible_template/projectBibleTemplateTagJsonByNameIfExist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "rowCode": row,
                "colCode": column,
            })
        })
            .then(res => res.json())
            .then(
                async (resultSelectedTags) => {
                    setTagModalActive(val)

                    setTagModalData(
                        tagModalData.map(info => {
                            info.row = row
                            info.column = column

                            if (resultSelectedTags.length > 0) {
                                resultSelectedTags[0].value.map(selectTagGroup => {
                                    info.selectedTags[selectTagGroup.code] = {
                                        "code": selectTagGroup.code,
                                        "title": selectTagGroup.title,
                                        "data": []
                                    }

                                    selectTagGroup.data.map(selectTag => {
                                        info.selectedTags[selectTagGroup.code].data[selectTag.code] = selectTag.title

                                        return selectTag
                                    })

                                    return selectTagGroup
                                })
                            } else {
                                info.selectedTags = []
                            }

                            return info
                        })
                    )
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    async function saveTagCell(selectedTags) {
        await fetch('/proxy/project_bible_template/projectBibleTemplateTagJsonByNameIfExist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "colCode": tagModalData[0].column,
                "rowCode": tagModalData[0].row
            })
        })
            .then(res => res.json())
            .then(
                async (resultExist) => {
                    if (resultExist.length) {
                        let tempTagGroups = []

                        Object.keys(selectedTags).forEach( (elementGroup) => {
                            let tempTags = []

                            Object.keys(selectedTags[elementGroup].data).forEach( (elementTag) => {
                                tempTags.push({
                                    "code": elementTag,
                                    "title": selectedTags[elementGroup].data[elementTag]
                                })
                            })

                            tempTagGroups.push({
                                "code": selectedTags[elementGroup].code,
                                "title": selectedTags[elementGroup].title,
                                "data": tempTags
                            })
                        })

                        await fetch('/proxy/project_bible_template/projectBibleTemplateUpdateTagJsonCell', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "colCode": tagModalData[0].column,
                                "rowCode": tagModalData[0].row,
                                "value": tempTagGroups
                            })
                        })
                            .then(res => res.json())
                            .then(
                                async (resultUpdate) => {
                                    setRows(
                                        rows.map(info => {
                                            info.data.map(row => {
                                                if (row.code === tagModalData[0].row) {
                                                    row.data[tagModalData[0].column] = tempTagGroups
                                                }

                                                return row
                                            })

                                            return info
                                        })
                                    )

                                    setTagModalData(
                                        tagModalData.map(info => {
                                            info.selectedTags = []

                                            return info
                                        })
                                    )

                                    setTagModalActive(false)
                                },
                                (error) => {
                                    alert("???????????? ?????? ???????????????????? ???????????????? ????????????.")
                                }
                            )
                    } else {
                        let tempTagGroups = []

                        Object.keys(selectedTags).forEach( (elementGroup) => {
                            let tempTags = []

                            Object.keys(selectedTags[elementGroup].data).forEach( (elementTag) => {
                                tempTags.push({
                                    "code": elementTag,
                                    "title": selectedTags[elementGroup].data[elementTag]
                                })
                            })

                            tempTagGroups.push({
                                "code": selectedTags[elementGroup].code,
                                "title": selectedTags[elementGroup].title,
                                "data": tempTags
                            })
                        })

                        await fetch('/proxy/project_bible_template/projectBibleTemplateInsertTagJsonCell', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "colCode": tagModalData[0].column,
                                "rowCode": tagModalData[0].row,
                                "value": tempTagGroups
                            })
                        })
                            .then(res => res.json())
                            .then(
                                async (resultInsert) => {
                                    setRows(
                                        rows.map(info => {
                                            info.data.map(row => {
                                                if (row.code === tagModalData[0].row) {
                                                    row.data[tagModalData[0].column] = tempTagGroups
                                                }

                                                return row
                                            })

                                            return info
                                        })
                                    )

                                    setTagModalData(
                                        tagModalData.map(info => {
                                            info.selectedTags = []

                                            return info
                                        })
                                    )

                                    console.log("INSERT TAGS", tagModalData[0])

                                    setTagModalActive(false)
                                },
                                (error) => {
                                    alert("???????????? ?????? ???????????????????? ???????????????? ????????????.")
                                }
                            )
                    }
                },
                (error) => {
                    alert("???????????? ?????? ???????????????????? ???????????????? ????????????.")
                }
            )
    }

    if (error) {
        return (
            <div className="row">
                <div className="col-sm-12 center">
                    <br />
                    <h3>????????????: {error.message}</h3>
                </div>
            </div>
        )
    } else if (!isLoaded || !isLoadedTagData) {
        return (
            <div className="row">
                <div className="col-sm-12 center">
                    <br />
                    <h3>????????????????...</h3>
                </div>
            </div>
        )
    } else {
        // console.log("columns[0].data", columns[0].data)
        // console.log("rows[0].data", rows[0].data)

        return(
            <div>
                {
                    showAlert &&
                    <div style={styles.alertMargin}>
                        <br />
                        <Alert variant="primary" onClose={() => setShowAlert(false)} dismissible>
                            <Alert.Heading>?????????????? ???? ???????????????????????????? ?????????? ?? ????????????????:</Alert.Heading>
                            <span>
                                ???????????? ???????????? ?????????? ???????? ???????????????????????????? ??????, ?? ?????????? ?? ????????:
                                <br/>
                                <br/>
                                1. ???????? ???? ???????????? ???????????????? ???????????????????????? ????????????, ???????????? ?????? ?????? ?????????? ???? ??????????, ?? ????????????
                                ???????????????? ??????????, ???? ?????????????? ???????????????? ?? ?? ???????? ???????????????? ??????????.
                                <br/>
                                2. ?????????????????????? ?????????? (????????????: <Button size="sm" variant="primary"
                                                                        style={styles.smallBtn}>
                                <FontAwesomeIcon icon={faChevronUp}/></Button>&nbsp;<Button
                                size="sm" variant="primary" style={styles.smallBtn}><FontAwesomeIcon
                                icon={faChevronDown}/></Button>) ???????????? ?????????????? ???????????????????? ??????????.
                                <br/>
                                4. ???????????????????? ???????????? (????????????: <Button size="sm" variant="success"
                                                                      style={styles.smallBtn}><FontAwesomeIcon icon={faPlus}/></Button>) ?????????????? ???? ??????????
                                ????????????, ?? ?????????????? ???????? ???????????? ????????????.
                                <br/>
                                5. ???????????????? ???????????? (????????????: <Button size="sm" variant="danger" style={styles.smallBtn}>
                                <FontAwesomeIcon icon={faTimes}/></Button>) ???? ?????????????? ???? ???? ???????? ????????????, ?? ???????????? ????
                                ???????????????????? - ?????? "??????????????????" ???????????? ?????????? ???????????????????? ???????????????????????? ?? ??????????????, ???? ????????????
                                ???????????????????? ?????????????? ?????? ???????????? ?????? ????????????????????????.
                                <br/>
                                ?? ?????????? ?????? ????????, ?????????? ?????? ???????????????? ?????????? ?????????? ???? ???????????????? ???????????????? ?? ??????????????????????????
                                ??????????, ?????????????? ?????? ?????????? ?????????????????????????? ?????? ???????????? ????????????.
                                <br/>
                                6. ???????????????????? ???????????? (????????????: <Button size="sm" variant="primary"
                                                                      style={styles.smallBtn}>????????????????&nbsp;&nbsp;<FontAwesomeIcon icon={faPlus}/></Button>)
                                ?????????????? ???? ?? ??????????.
                                <br />
                                7. ?????????????????? ?? ?????????????? ?? ?????????????????? ?????????????????????? ???? ??????????????, ?????????????????? ??????????????????
                                ?????????????????????? ?????? ???????????? ???? ?????????????????????????? ???????????? ???? ?????????????????????????? ???????????? ?? ?????????? ????????????
                                ??????????.
                            </span>
                        </Alert>
                    </div>
                }
                <br />
                <div className="managedQualityOnProjectBlockView">
                    <div className="row">
                        <div className="col-sm-12">
                            <TableInfo columns={columns[0].data} rows={rows[0].data}
                                       addRow={addRow} deleteRow={deleteRow} moveUpRow={moveUpRow}
                                       moveDownRow={moveDownRow} setTagValue={setTagValue} />
                            <div className="center">
                                <Button variant="primary" onClick={(e) =>
                                    addRowToTheEnd()}>????????????????&nbsp;&nbsp;<FontAwesomeIcon icon={faPlus} />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <TagModal tagModalActive={tagModalActive} setTagModalActive={setTagModalActive}
                              tagModalData={tagModalData} setTagModalData={setTagModalData} saveTagCell={saveTagCell} />
                </div>
            </div>
        )
    }
}
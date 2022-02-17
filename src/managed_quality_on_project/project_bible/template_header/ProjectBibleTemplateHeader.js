import React, {useEffect, useState} from "react";
import {Button, Table, Alert} from "react-bootstrap";
import ColumnsActiveInfo from "./ColumnsActiveInfo";
import ColumnsForClientInfo from "./ColumnsForClientInfo";
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
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [columnsActive, setColumnsActive] = useState([{
        data: []
    }])
    const [columnsForClient, setColumnsForClient] = useState([{
        data: []
    }])
    const [showAlert, setShowAlert] = useState(true)

    async function addColumnToTheEnd(type) {
        await fetch("/proxy/project_bible_template/projectBibleTemplateGenerateIndividualCode", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                async (resultGenerate) => {
                    if (!resultGenerate.exist.length) {
                        await fetch("/proxy/project_bible_template/projectBibleTemplateAddColumnToTheEnd", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "name": "",
                                "type": "input",
                                "editable": false,
                                "template": false,
                                "num": type === "main" ? columnsActive[0].data.length + 1 : columnsForClient[0].data.length + 1,
                                "code": resultGenerate.individualCode,
                                "active": true,
                                "col_for_client": type === "main" ? false : true
                            })
                        })
                            .then(res => res.json())
                            .then(
                                (resultAdd) => {
                                    let value = {
                                        "name": "",
                                        "type": "input",
                                        "editable": false,
                                        "template": false,
                                        "num": type === "main" ? columnsActive[0].data.length + 1 : columnsForClient[0].data.length + 1,
                                        "code": resultGenerate.individualCode,
                                        "active": true,
                                        "col_for_client": type === "main" ? false : true
                                    }

                                    if (type === "main") {
                                        setColumnsActive(
                                            columnsActive.map(info => {
                                                info.data.push(value)

                                                return info
                                            })
                                        )
                                    } else if (type === "client") {
                                        setColumnsForClient(
                                            columnsForClient.map(info => {
                                                info.data.push(value)

                                                return info
                                            })
                                        )
                                    }
                                },
                                (error) => {
                                    //todo придумать какой-то текст ошибки
                                }
                            )
                    } else {
                        addColumnToTheEnd(type)
                    }
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    async function addColumn(type, num) {
        await fetch("/proxy/project_bible_template/projectBibleTemplateGenerateIndividualCode", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                async (resultGenerate) => {
                    if (!resultGenerate.exist.length) {
                        await fetch("/proxy/project_bible_template/projectBibleTemplateIncNumPredAddColumn", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "initNum": num,
                                "initType": type
                            })
                        })
                            .then(res => res.json())
                            .then(
                                async (resultPredAdd) => {
                                    await fetch("/proxy/project_bible_template/projectBibleTemplateAddColumn", {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            "name": "",
                                            "type": "input",
                                            "editable": false,
                                            "template": false,
                                            "num": num + 1,
                                            "code": resultGenerate.individualCode,
                                            "active": true,
                                            "col_for_client": type === "main" ? false : true
                                        })
                                    })
                                        .then(res => res.json())
                                        .then(
                                            (resultAdd) => {
                                                let value = {
                                                    "name": "",
                                                    "type": "input",
                                                    "editable": false,
                                                    "template": false,
                                                    "num": num + 1,
                                                    "code": resultGenerate.individualCode,
                                                    "active": true,
                                                    "col_for_client": type === "main" ? false : true
                                                }

                                                if (type === "main") {
                                                    setColumnsActive(
                                                        columnsActive.map(info => {
                                                            info.data.splice(num, 0, value)
                                                            // info.data.push(value)

                                                            return info
                                                        })
                                                    )
                                                } else if (type === "client") {
                                                    setColumnsForClient(
                                                        columnsForClient.map(info => {
                                                            info.data.splice(num, 0, value)
                                                            // info.data.push(value)

                                                            return info
                                                        })
                                                    )
                                                }
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
                        addColumn(type, num)
                    }
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    async function updateColumnTemplate(column, code, value) {
        await fetch("/proxy/project_bible_template/projectBibleTemplateUpdateColumnTemplate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "column": column,
                "code": code,
                "value": value
            })
        })
            .then(res => res.json())
            .then(
                (resultUpdate) => {

                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    async function deleteColumn(type, code, num) {
        await fetch("/proxy/project_bible_template/projectBibleTemplateDecNumPredDeleteColumn", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "initNum": num,
                "initType": type
            })
        })
            .then(res => res.json())
            .then(
                async (resultPredDelete) => {
                    await fetch("/proxy/project_bible_template/projectBibleTemplateDeleteColumn", {
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
                                if (type === "main") {
                                    setColumnsActive(
                                        columnsActive.map(info => {
                                            info.data.splice(num - 1, 1)

                                            return info
                                        })
                                    )
                                } else if (type === "client") {
                                    setColumnsForClient(
                                        columnsForClient.map(info => {
                                            info.data.splice(num - 1, 1)

                                            return info
                                        })
                                    )
                                }
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

    async function moveUpColumn(type, code, num) {
        if (num !== 1) {
            await fetch("/proxy/project_bible_template/projectBibleTemplateMoveUpColumn", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "type": type,
                    "code": code,
                    "num": num
                })
            })
                .then(res => res.json())
                .then(
                    (resultMoveUp) => {
                        let value = type === "main" ? columnsActive[0].data[num - 1] : columnsForClient[0].data[num - 1]

                        if (type === "main") {
                            setColumnsActive(
                                columnsActive.map(info => {
                                    info.data.splice(num - 1, 1)
                                    info.data.splice(num - 2, 0, value)

                                    return info
                                })
                            )
                        } else if (type === "client") {
                            setColumnsForClient(
                                columnsForClient.map(info => {
                                    info.data.splice(num - 1, 1)
                                    info.data.splice(num - 2, 0, value)

                                    return info
                                })
                            )
                        }
                    },
                    (error) => {
                        //todo придумать какой-то текст ошибки
                    }
                )
        }
    }

    async function moveDownColumn(type, code, num) {
        let columnLength = type === "main" ? columnsActive[0].data.length : columnsForClient[0].data.length

        if (num !== columnLength) {
            await fetch("/proxy/project_bible_template/projectBibleTemplateMoveDownColumn", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "type": type,
                    "code": code,
                    "num": num
                })
            })
                .then(res => res.json())
                .then(
                    (resultMoveDown) => {
                        let value = type === "main" ? columnsActive[0].data[num - 1] : columnsForClient[0].data[num - 1]

                        if (type === "main") {
                            setColumnsActive(
                                columnsActive.map(info => {
                                    info.data.splice(num - 1, 1)
                                    info.data.splice(num, 0, value)

                                    return info
                                })
                            )
                        } else if (type === "client") {
                            setColumnsForClient(
                                columnsForClient.map(info => {
                                    info.data.splice(num - 1, 1)
                                    info.data.splice(num, 0, value)

                                    return info
                                })
                            )
                        }
                    },
                    (error) => {
                        //todo придумать какой-то текст ошибки
                    }
                )
        }
    }

    useEffect(async () => {
        await fetch("/proxy/project_bible_template/projectBibleTemplate", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setColumnsActive(
                        columnsActive.map(info => {
                            info.data = result.columnsActive

                            return info
                        })
                    )

                    setColumnsForClient(
                        columnsForClient.map(info => {
                            info.data = result.columnsForClient

                            return info
                        })
                    )

                    setIsLoaded(true)
                },
                (error) => {
                    setIsLoaded(true)
                    setError(error)
                }
            )
    }, [])

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
            <div>
                {
                    //todo тут еще надо написать, что происходит при перемене галочек editable и template
                    showAlert &&
                    <div style={styles.alertMargin}>
                        <br />
                        <Alert variant="primary" onClose={() => setShowAlert(false)} dismissible>
                            <Alert.Heading>Памятка по редактированию столбцов:</Alert.Heading>
                            <span>
                                Каждая колонка имеет свой индивидуальный код, в связи с этим во избежание возможных
                                конфликтов:
                                <br/>
                                <br/>
                                1. Если вы хотите кардинально изменить существующую колонку, лучше удалите ее и с нуля
                                добавьте новую.
                                <br/>
                                К кардинальным изменениям можно относить:
                                <br/>
                                - изменение типа хранимых данных в колонке (Поле ввода, Чек-бокс, Список тегов);
                                <br/>
                                2. Изменить название колонки можно в любой момент, это изменение не считается
                                кардинальным.
                                <br/>
                                3. Перемещение колонок (кнопки: <Button size="sm" variant="primary"
                                style={styles.smallBtn}><FontAwesomeIcon icon={faChevronUp}/></Button>&nbsp;<Button
                                size="sm" variant="primary" style={styles.smallBtn}><FontAwesomeIcon
                                icon={faChevronDown}/></Button>) меняет порядок следования колонок.
                                <br/>
                                4. Добавление строки (кнопка: <Button size="sm" variant="success"
                                style={styles.smallBtn}><FontAwesomeIcon icon={faPlus}/></Button>) добавит ее после
                                строки, в которой была нажата кнопка.
                                <br/>
                                5. Удаление колонки (кнопка: <Button size="sm" variant="danger" style={styles.smallBtn}>
                                <FontAwesomeIcon icon={faTimes}/></Button>) не удаляет ее из базы данных, а делает ее
                                неактивной - так "удаленные" колонки могут продолжать отображаться в отчетах, на момент
                                заполнения которых эта колонка еще существовала.
                                <br/>
                                А также для того, чтобы при создании новых колонок не возникло ситуации с повторяющимся
                                кодом, который уже ранее генерировался для другой колонки.
                                <br/>
                                6. Добавление строки (кнопка: <Button size="sm" variant="primary"
                                style={styles.smallBtn}>Добавить&nbsp;&nbsp;<FontAwesomeIcon icon={faPlus}/></Button>)
                                добавит ее в конец.
                            </span>
                        </Alert>
                    </div>
                }
                <br />
                <div className="managedQualityOnProjectBlockView">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="center">
                                <h4>Колонки для отчета и их основные характеристики:</h4>
                            </div>
                            <br />
                            <Table responsive bordered>
                                <thead>
                                <tr>
                                    <th className="center">Название колонки</th>
                                    <th className="center">Тип поля</th>
                                    <th className="center">Редактируемое поле?</th>
                                    <th className="center">Есть ли шаблон?</th>
                                    <th className="center">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    columnsActive.map(info => (
                                        info.data.map(value => (
                                            <ColumnsActiveInfo key={value.code} column={value}
                                                               updateColumnTemplate={updateColumnTemplate}
                                                               addColumn={addColumn} deleteColumn={deleteColumn}
                                                               moveUpColumn={moveUpColumn}
                                                               moveDownColumn={moveDownColumn}>

                                            </ColumnsActiveInfo>
                                        ))
                                    ))
                                }
                                </tbody>
                            </Table>
                            <div className="center">
                                <Button variant="primary" onClick={(e) =>
                                    addColumnToTheEnd("main")}>Добавить&nbsp;&nbsp;<FontAwesomeIcon icon={faPlus} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="managedQualityOnProjectBlockView">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="center">
                                <h4>Колонки для заполнения клиентом и их характеристики:</h4>
                            </div>
                            <br />
                            <Table responsive bordered>
                                <thead>
                                <tr>
                                    <th className="center">Название колонки</th>
                                    <th className="center">Тип поля</th>
                                    <th className="center">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    columnsForClient.map(info => (
                                        info.data.map(value => (
                                            <ColumnsForClientInfo key={value.code} column={value}
                                                                  updateColumnTemplate={updateColumnTemplate}
                                                                  addColumn={addColumn} deleteColumn={deleteColumn}
                                                                  moveUpColumn={moveUpColumn}
                                                                  moveDownColumn={moveDownColumn}>
                                            </ColumnsForClientInfo>
                                        ))
                                    ))
                                }
                                </tbody>
                            </Table>
                            <div className="center">
                                <Button variant="primary" onClick={(e) =>
                                    addColumnToTheEnd("client")}>Добавить&nbsp;&nbsp;<FontAwesomeIcon icon={faPlus} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
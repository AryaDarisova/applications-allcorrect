import React, {useEffect, useState} from "react";
import TagGroupTable from "./TagGroupTable";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import ColumnsActiveInfo from "../template_header/ColumnsActiveInfo";

export default function ProjectBibleTemplateTags(props) {
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [tags, setTags] = useState([{
        data: []
    }])

    async function addTagGroup() {
        setTags(
            tags.map(info => {
                info.data[""] = {"title": "", "data": []}

                return info
            })
        )
    }

    async function addTag(group) {
        if (group === "") {
            alert("Для начала введите название группы тегов.")
        } else {
            setTags(
                tags.map(info => {
                    info.data[group].data.push("")

                    return info
                })
            )
        }
    }

    async function updateGroupTagTitle(oldTitle, newTitle) {
        if (newTitle !== "") {
            await fetch("/proxy/project_bible_template/projectBibleTemplateTagsUpdateGroupTag", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "oldTitle": oldTitle,
                    "newTitle": newTitle
                })
            })
                .then(res => res.json())
                .then(
                    async (resultUpdate) => {
                        let newData = [];

                        for (var key in tags[0].data) {
                            if (key !== oldTitle) {
                                newData[key] = tags[0].data[key]
                            } else {
                                // newData[newTitle] = tags[0].data[key]
                                newData[newTitle] = {"title": newTitle, "data": []}

                                for (let i = 0; i < tags[0].data[key].data.length; i++) {
                                    newData[newTitle].data.push(tags[0].data[key].data[i]);
                                }
                            }
                        }

                        setTags(
                            tags.map(info => {
                                console.log("newData after Update group title", newData)
                                info.data = newData

                                return info
                            })
                        )
                    },
                    (error) => {
                        //todo придумать какой-то текст ошибки
                    }
                )
        } else {
            alert("Вы оставили поле названия группы тегов пустым - заполните его.")
        }
    }

    async function updateTagTitle(group, oldTitle, newTitle) {
        if (newTitle === "") {
            alert("Заполните поле названия тега.")
        } else {
            await fetch("/proxy/project_bible_template/projectBibleTemplateTagsCheckExistBeforeUpdateTag", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "group": group,
                    "oldTitle": oldTitle
                })
            })
                .then(res => res.json())
                .then(
                    async (resultExist) => {
                        let link = "/proxy/project_bible_template"

                        if (resultExist.length > 0) {
                            link += "/projectBibleTemplateTagsUpdateTag"
                        } else {
                            link += "/projectBibleTemplateTagsAddTag"
                        }

                        await fetch(link, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "group": group,
                                "oldTitle": oldTitle,
                                "newTitle": newTitle
                            })
                        })
                            .then(res => res.json())
                            .then(
                                async (resultUpdate) => {
                                    if (group === "") {
                                        alert("Не забудьте заполнить название группы тегов.");
                                    }

                                    let indexForDelete = 0;

                                    for (let i = 0; i < tags[0].data[group].data.length; i++) {
                                        if (tags[0].data[group].data[i] === oldTitle) {
                                            break;
                                        }

                                        indexForDelete++;
                                    }

                                    setTags(
                                        tags.map(info => {
                                            info.data[group].data.splice(indexForDelete, 1, newTitle)

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
    }

    async function deleteGroupTag(group) {
        await fetch("/proxy/project_bible_template/projectBibleTemplateTagsDeleteGroupTag", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "group": group
            })
        })
            .then(res => res.json())
            .then(
                async (resultDelete) => {
                    let newData = [];

                    for (var key in tags[0].data) {
                        if (key !== group) {
                            newData[key] = tags[0].data[key]
                        }
                    }

                    setTags(
                        tags.map(info => {
                            info.data = newData

                            return info
                        })
                    )
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )

    }

    async function deleteTag(group, value) {
        await fetch("/proxy/project_bible_template/projectBibleTemplateTagsDeleteTag", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "group": group,
                "value": value
            })
        })
            .then(res => res.json())
            .then(
                async (resultDelete) => {
                    let indexForDelete = 0;

                    for (let i = 0; i < tags[0].data[group].data.length; i++) {
                        if (tags[0].data[group].data[i] === value) {
                            break;
                        }

                        indexForDelete++;
                    }

                    setTags(
                        tags.map(info => {
                            info.data[group].data.splice(indexForDelete, 1)

                            return info
                        })
                    )
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    useEffect(async () => {
        await fetch("/proxy/project_bible_template/projectBibleTemplateTags", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setTags(
                        tags.map(info => {
                            let resultData = []

                            result.tags.map(value => {
                                let groupTitle = value.tag_group

                                if (typeof resultData[groupTitle] === 'undefined') {
                                    resultData[groupTitle] = {"title": groupTitle, "data": []}
                                }

                                resultData[groupTitle].data.push(value.value)
                            })

                            info.data = resultData

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

    const getTagTables = tags => {
        let content = []

        for (var key in tags[0].data) {
            let value = tags[0].data[key]

            content.push(<TagGroupTable key={value.title} title={value.title} data={value.data}
                                        updateGroupTagTitle={updateGroupTagTitle} addTag={addTag}
                                        updateTagTitle={updateTagTitle} deleteTag={deleteTag}
                                        deleteGroupTag={deleteGroupTag}/>)
        }

        return content
    };

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
        return (
            <div>
                <br />
                <div className="managedQualityOnProjectBlockView">
                    <div className="row">
                        {/*<div className="col-sm-12">*/}
                            { getTagTables(tags) }
                        {/*</div>*/}
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="center">
                                <Button variant="primary" onClick={(e) =>
                                    addTagGroup()}>Добавить группу тегов&nbsp;&nbsp;<FontAwesomeIcon icon={faPlus} />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            </div>
        )
    }
}
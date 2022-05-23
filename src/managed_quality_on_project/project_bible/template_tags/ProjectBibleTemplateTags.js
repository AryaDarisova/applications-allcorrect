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
        await fetch("/proxy/project_bible_template/projectBibleTemplateGenerateTagGroupIndividualCode", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                async (resultGenerate) => {
                    console.log("resultGenerate", resultGenerate)

                    if (!resultGenerate.exist.length) {
                        await fetch("/proxy/project_bible_template/projectBibleTemplateTagsAddGroupTag", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "num": Object.keys(tags[0].data).length + 1,
                                "code": resultGenerate.individualCode,
                                "active": true
                            })
                        })
                            .then(res => res.json())
                            .then(
                                (resultAdd) => {
                                    setTags(
                                        tags.map(info => {
                                            info.data[resultGenerate.individualCode] = {
                                                "code": resultGenerate.individualCode,
                                                "title": "",
                                                "data": []
                                            }

                                            console.log("addTagGroup", tags)

                                            return info
                                        })
                                    )
                                },
                                (error) => {
                                    //todo придумать какой-то текст ошибки
                                }
                            )
                    } else {
                        addTagGroup()
                    }
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    async function addTag(groupCode) {
        await fetch("/proxy/project_bible_template/projectBibleTemplateGenerateTagIndividualCode", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                async (resultGenerate) => {
                    if (!resultGenerate.exist.length) {
                        await fetch("/proxy/project_bible_template/projectBibleTemplateTagsAddTag", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "groupCode": groupCode,
                                "tagCode": resultGenerate.individualCode
                            })
                        })
                            .then(res => res.json())
                            .then(
                                (resultAdd) => {
                                    setTags(
                                        tags.map(info => {
                                            info.data[groupCode].data[resultGenerate.individualCode] = ""

                                            return info
                                        })
                                    )
                                },
                                (error) => {
                                    //todo придумать какой-то текст ошибки
                                }
                            )
                    } else {
                        addTag(groupCode)
                    }
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    async function updateGroupTagTitle(groupCode, newTitle) {
        if (newTitle !== "") {
            await fetch("/proxy/project_bible_template/projectBibleTemplateTagsUpdateGroupTag", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "groupCode": groupCode,
                    "newTitle": newTitle
                })
            })
                .then(res => res.json())
                .then(
                    async (resultUpdate) => {
                        let newData = [];

                        for (let key in tags[0].data) {
                            if (key !== groupCode) {
                                newData[key] = tags[0].data[key]
                            } else {
                                newData[key] = {"code": groupCode, "title": newTitle, "data": []}

                                for (let i = 0; i < tags[0].data[key].data.length; i++) {
                                    newData[key].data.push(tags[0].data[key].data[i]);
                                }
                            }
                        }

                        setTags(
                            tags.map(info => {
                                console.log("newData after Update group title", newData)
                                info.data = newData

                                console.log("updateGroupTagTitle", tags)

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

    async function updateTagTitle(groupCode, tagCode, newTitle) {
        await fetch("/proxy/project_bible_template/projectBibleTemplateTagsUpdateTag", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "tagCode": tagCode,
                "newTitle": newTitle
            })
        })
            .then(res => res.json())
            .then(
                async (resultUpdate) => {
                    setTags(
                        tags.map(info => {
                            info.data[groupCode].data[tagCode] = newTitle

                            return info
                        })
                    )
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    async function deleteGroupTag(group, num) {
        await fetch("/proxy/project_bible_template/projectBibleTemplateDecNumPredDeleteTagGroup", {
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
                    await fetch("/proxy/project_bible_template/projectBibleTemplateTagsDeleteGroupTag", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "code": group
                        })
                    })
                        .then(res => res.json())
                        .then(
                            async (resultDelete) => {
                                let newData = [];

                                for (let key in tags[0].data) {
                                    if (key !== group) {
                                        newData[key] = tags[0].data[key]
                                    }
                                }

                                setTags(
                                    tags.map(info => {
                                        info.data = newData
                                        console.log("deleteGroupTag", tags)

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

    async function deleteTag(groupCode, tagCode) {
        await fetch("/proxy/project_bible_template/projectBibleTemplateTagsDeleteTag", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "tagCode": tagCode
            })
        })
            .then(res => res.json())
            .then(
                async (resultDelete) => {
                    deleteTagElementFromArray(groupCode, tagCode)
                },
                (error) => {
                    //todo придумать какой-то текст ошибки
                }
            )
    }

    function deleteTagElementFromArray(groupCode, tagCode) {
        let newData = [];

        for (let key in tags[0].data[groupCode].data) {
            if (key !== tagCode) {
                newData[key] = tags[0].data[groupCode].data[key]
            }
        }

        setTags(
            tags.map(info => {
                info.data[groupCode].data = newData

                return info
            })
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

                            result.tag_groups.map(value => {
                                let groupCode = value.code
                                let groupTitle = value.name

                                resultData[groupCode] = {"code": groupCode, "title": groupTitle, "data": []}
                            })

                            result.tags.map(value => {
                                let groupCode = value["tag_group"]
                                let tagCode = value["tag_code"]

                                if (typeof resultData[groupCode] !== 'undefined') {
                                    resultData[groupCode].data[tagCode] = value.value
                                }
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
        let index = 0

        for (let key in tags[0].data) {
            let value = tags[0].data[key]

            content.push(<TagGroupTable key={value.code} code={value.code} title={value.title} data={value.data}
                                        updateGroupTagTitle={updateGroupTagTitle} addTag={addTag}
                                        updateTagTitle={updateTagTitle} deleteTag={deleteTag}
                                        deleteGroupTag={deleteGroupTag} groupIndex={index} />)
            index++
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
                        { getTagTables(tags) }
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
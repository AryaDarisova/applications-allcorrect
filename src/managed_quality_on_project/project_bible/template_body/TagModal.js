import "../css/modal.css"
import {Col, FormCheck, FormLabel, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import parse from 'html-react-parser';
import TagGroupTable from "../template_tags/TagGroupTable";

const styles = {
    modalWH: {
        width: '60%',
        height: '70%'
    }
}

export default function TagModal(props) {
    const [selectedTags, setSelectedTags] = useState([{
        data: props.tagModalData[0].selectedTags
    }]);

    function setRowTags(groupCode, groupTitle, tagCode, tagTitle, e) {
        if (e.target.checked) {
            setSelectedTags(
                selectedTags.map(info => {
                    if (info.data[groupCode]) {
                        info.data[groupCode].data[tagCode] = tagTitle
                    } else {
                        info.data[groupCode] = {
                            "code": groupCode,
                            "title": groupTitle,
                            "data": []
                        }

                        info.data[groupCode].data[tagCode] = tagTitle
                    }

                    return info
                })
            )
        } else {
            if (Object.keys(selectedTags[0].data[groupCode].data).length > 1) {
                let newData = [];

                for (let key in selectedTags[0].data[groupCode].data) {
                    if (key !== tagCode) {
                        newData[key] = selectedTags[0].data[groupCode].data[key]
                    }
                }

                setSelectedTags(
                    selectedTags.map(info => {
                        info.data[groupCode].data = newData

                        return info
                    })
                )
            } else {
                let newData = [];

                for (let key in selectedTags[0].data) {
                    if (key !== groupCode) {
                        newData[key] = selectedTags[0].data[key]
                    }
                }

                setSelectedTags(
                    selectedTags.map(info => {
                        info.data = newData

                        return info
                    })
                )
            }
        }

        // props.setTagModalData(props.tagModalData[0].selectedTags = selectedTags[0].data)
    }

    let getAllTags = groups => {
        console.log("TAG MODAL SELECTED TAGS", props.tagModalData[0])

        let content = []

        for (let key in groups) {
            let value = groups[key]

            content.push(
                <div className="col-sm-4" key={value.code}>
                    <FormLabel><h5>{value.title}</h5></FormLabel>
                    { getTagsByGroup(value.data, value.code, value.title) }
                    <br />
                </div>
            )
        }

        return content
    };

    let getTagsByGroup = (tags, groupCode, groupTitle) => {
        let content = []

        for (let key in tags) {
            let value = tags[key]
            console.log("CHECKED VALUE", selectedTags, value.title)

            if (!!(selectedTags[0].data[groupCode] &&
                selectedTags[0].data[groupCode].data[value.code])) {
                content.push(
                    <FormCheck /*defaultChecked={true}*/checked={true} label={value.title}
                               onChange={(e) =>
                                   setRowTags(groupCode, groupTitle, value.code, value.title, e)} key={value.code} />
                )
            } else {
                content.push(
                    <FormCheck /*defaultChecked={false}*/checked={false} label={value.title}
                               onChange={(e) =>
                                   setRowTags(groupCode, groupTitle, value.code, value.title, e)} key={value.code} />
                )
            }
        }

        return content
    };

    function setTags() {
        let dataForCell = selectedTags[0].data

        setSelectedTags(
            selectedTags.map(info => {
                info.data = []

                return info
            })
        )

        props.saveTagCell(dataForCell)
    }

    return(
        <div className={props.tagModalActive ? "modal active" : "modal"} onClick={() => props.setTagModalActive(false)} >
            <div className={props.tagModalActive ? "modal__content active" : "modal__content"} onClick={e => e.stopPropagation()}
                 style={styles.modalWH} >
                <div className="row">
                    <div className="col-sm-8">
                        <h4>Здесь вы можете выбрать теги</h4>
                    </div>
                    <div className="col-sm-4 center">
                        <button className="btn btn-primary"
                                onClick={(e) => /*props.saveTagCell(selectedTags[0].data)*/setTags()}>Сохранить</button>
                    </div>
                </div>
                <hr />
                <br />
                <div className="row">
                    { getAllTags(props.tagModalData[0].allTags) }
                </div>
            </div>
        </div>
    )
}

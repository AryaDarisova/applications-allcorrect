import "../css/modal.css"
import {Col, Form, FormCheck, FormControl, FormLabel, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";

const styles = {
    modalWH: {
        width: '60%',
        height: '70%'
    }
}

export default function SaveInputRegexModal(props) {
    let associativeLinks = props.saveInputRegexModalData[0].links

    function setLinkTitle(link, e) {
        for (let key in associativeLinks) {
            let value = associativeLinks[key]

            if (key === link) {
                value.title = e.target.value
            }
        }
    }

    let getAllLinks = links => {
        let content = []

        for (let key in links) {
            let value = links[key]

            content.push(
                <div className="row" key={key}>
                    <div className="col-sm-8">
                        <FormControl placeholder={key} disabled />
                    </div>
                    <div className="col-sm-4">
                        <FormControl placeholder={value.title} onBlur={(e) =>
                            setLinkTitle(key, e)} />
                    </div>
                    <br />
                    <br />
                </div>
            )
        }

        return content
    };

    function saveAssociativeLinks() {
        let newValue = props.saveInputRegexModalData[0].value

        console.log("SAVE associativeLinks", associativeLinks)

        for (let key in associativeLinks) {
            let value = associativeLinks[key]

            if (value.tagExist && value.title) {
                //todo заменяем в теге с ссылкой сокращение
                console.log("todo заменяем в теге с ссылкой сокращение")
                newValue = newValue.replace(value.tagExist, "<a href='" + value.link + "'>" + value.title + "</a>")
            } else if (value.tagExist && !value.title) {
                //todo оставляем просто ссылку
                console.log("todo оставляем просто ссылку")
                newValue = newValue.replace(value.tagExist, value.link)
            } else if (!value.tagExist && !value.title) {
                //todo ничего не делаем
                console.log("todo WTF", value.tagExist, value.title)
            } else if (!value.tagExist && value.title) {
                //todo заменяем ссылку на тег с сокращением
                console.log("todo заменяем ссылку на тег с сокращением", value.link)
                newValue = newValue.replace(value.link, "<a href='" + value.link + "'>" + value.title + "</a>")
            }
        }

        props.saveCell(props.saveInputRegexModalData[0].column, props.saveInputRegexModalData[0].row, newValue,
            props.saveInputRegexModalData[0].oldValue)
    }

    return(
        <div className={props.saveInputRegexModalActive ? "modal active" : "modal"} onClick={() => props.setSaveInputRegexModalActive(false)} >
            <div className={props.saveInputRegexModalActive ? "modal__content active" : "modal__content"} onClick={e => e.stopPropagation()}
                 style={styles.modalWH} >
                <div className="row">
                    <div className="col-sm-8">
                        <h4>Здесь вы можете заменить ссылки на краткий термин</h4>
                    </div>
                    <div className="col-sm-4 center">
                        <button className="btn btn-primary"
                                onClick={(e) => saveAssociativeLinks()}>Сохранить</button>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-sm-12">
                        <FormControl placeholder={props.saveInputRegexModalData[0].value} disabled />
                    </div>
                </div>
                <br />
                <hr />
                <br />
                <div className="row">
                    <div className="col-sm-8 center">
                        <h5>Ссылка</h5>
                    </div>
                    <div className="col-sm-4 center">
                        <h5>Сокращение (если оставить поле пустым, то ссылка не заменится на тег)</h5>
                    </div>
                </div>
                { getAllLinks(props.saveInputRegexModalData[0].links) }
            </div>
        </div>
    )
}

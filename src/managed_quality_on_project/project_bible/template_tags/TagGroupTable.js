import React from "react";
import {Button, Table, FormControl} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronUp, faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import TableCell from "../view/TableCell";

const styles = {
    tagColumnWidth: {
        width: '85%'
    },

    actionColumnWidth: {
        width: '15%'
    }
}

export default function TagGroupTable(props) {
    const getTags = tags => {
        let content = []

        for (let key in tags) {
            let value = tags[key]

            content.push(
                <tr key={key}>
                    <td>
                        <FormControl placeholder="Название тега" defaultValue={value}
                                     onBlur={(e) =>
                                         props.updateTagTitle(props.code, key, e.target.value)}/>
                    </td>
                    <td className="center">
                        <Button size="sm" variant="danger" onClick={(e) =>
                            props.deleteTag(props.code, key)}>
                            <FontAwesomeIcon icon={faTimes} /></Button>
                    </td>
                </tr>
            )
        }

        return content
    };

    return (
        <div className="col-sm-4">
            <Table responsive bordered>
                <thead>
                <tr>
                    <th colSpan="2">
                        <FormControl placeholder="Название группы тегов" defaultValue={props.title}
                                     onBlur={(e) =>
                                         props.updateGroupTagTitle(props.code, e.target.value)}/>
                    </th>
                </tr>
                <tr>
                    <th className="center" style={styles.tagColumnWidth}>Тег</th>
                    <th className="center" style={styles.actionColumnWidth}>Действия</th>
                </tr>
                </thead>
                <tbody>
                { getTags(props.data) }
                {/*{
                    props.data.map((value, index) => {
                        return(
                            <tr key={value/*props.code + "_" + index*!/>
                                <td>
                                    <FormControl placeholder="Название тега" defaultValue={value}
                                                 onBlur={(e) =>
                                                     props.updateTagTitle(props.code, value, e.target.value, index)}/>
                                </td>
                                <td className="center">
                                    <Button size="sm" variant="danger" onClick={(e) =>
                                        props.deleteTag(props.code, value, index)}>
                                        <FontAwesomeIcon icon={faTimes} /></Button>
                                </td>
                            </tr>
                        )
                    })
                }*/}
                </tbody>
            </Table>
            <br />
            <div  className="center">
                <Button size="sm" variant="success" onClick={(e) =>
                    props.addTag(props.code)}>Добавить тег&nbsp;&nbsp;<FontAwesomeIcon icon={faPlus} />
                </Button>
                &nbsp;
                <Button size="sm" variant="danger" onClick={(e) =>
                    props.deleteGroupTag(props.code, props.groupIndex)}>Удалить группу тегов&nbsp;<FontAwesomeIcon icon={faTimes} />
                </Button>
            </div>
            <br />
        </div>
    )
}
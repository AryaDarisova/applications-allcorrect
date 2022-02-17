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
    return (
        <div className="col-sm-4">
            <Table responsive bordered>
                <thead>
                <tr>
                    <th colSpan="2">
                        <FormControl placeholder="Название группы тегов" defaultValue={props.title}
                                     onBlur={(e) =>
                                         props.updateGroupTagTitle(props.title, e.target.value)}/>
                    </th>
                </tr>
                <tr>
                    <th className="center" style={styles.tagColumnWidth}>Тег</th>
                    <th className="center" style={styles.actionColumnWidth}>Действия</th>
                </tr>
                </thead>
                <tbody>
                {
                    props.data.map(value => {
                        return(
                            <tr key={value}>
                                <td>
                                    <FormControl placeholder="Название тега" defaultValue={value}
                                                 onBlur={(e) =>
                                                     props.updateTagTitle(props.title, value, e.target.value)}/>
                                </td>
                                <td className="center">
                                    <Button size="sm" variant="danger" onClick={(e) =>
                                        props.deleteTag(props.title, value)}>
                                        <FontAwesomeIcon icon={faTimes} /></Button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
            <br />
            <div  className="center">
                <Button size="sm" variant="success" onClick={(e) =>
                    props.addTag(props.title)}>Добавить тег&nbsp;&nbsp;<FontAwesomeIcon icon={faPlus} />
                </Button>
                &nbsp;
                <Button size="sm" variant="danger" onClick={(e) =>
                    props.deleteGroupTag(props.title)}>Удалить группу тегов&nbsp;<FontAwesomeIcon icon={faTimes} />
                </Button>
            </div>
            <br />
        </div>
    )
}
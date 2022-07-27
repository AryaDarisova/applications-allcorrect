import React, {useEffect, useState} from "react";
import {FormCheck, FormLabel} from "react-bootstrap";
import { MultiSelect } from 'primereact/multiselect';
import "../css/tableFixHeader.css"

const styles = {
    multiselectStyle: {
        width: '100%'
    }
}

export default function FilterNotShowAll(props) {
    const multiselectOptions = []

    if (props.column.type === "input") {
        for (let [key, value] of props.column.filter.showAll.data) {
            multiselectOptions.push({
                label: key,
                value: value
            })
        }

        return(
            <div>
                <br />
                <FormLabel>Фильтр по полю:</FormLabel>
                <br />
                <MultiSelect value={props.column.filter.showAll.selectedData} options={multiselectOptions} style={styles.multiselectStyle} className="multiselect-custom-style"
                             onChange={(e) => props.selectedDataMultiselect(props.column.code, e.value)}
                             maxSelectedLabels={1} />
                <br />
                <br />
                <FormCheck checked={props.column.filter.showAll.showEmptyCells}
                           onChange={(e) => props.changeFilter(props.column.code, props.column.type, "showEmptyCells", e)}
                           label='Пустые поля'/>
            </div>
        )
    } else if (props.column.type === "checkbox") {
        return(
            <div>
                <br />
                <FormCheck checked={props.column.filter.showAll.showFilledCells}
                           onChange={(e) => props.changeFilter(props.column.code, props.column.type, "showFilledCells", e)}
                           label='Стоит галочка'/>
            </div>
        )
    } else if (props.column.type === "tags_list") {

    }
}


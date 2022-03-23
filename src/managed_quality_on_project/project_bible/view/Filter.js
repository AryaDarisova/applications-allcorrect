import React from "react";
import {Button, FormCheck} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter, faTimes} from "@fortawesome/free-solid-svg-icons";
import FilterNotShowAll from "../view/FilterNotShowAll";

const styles = {
    blockView: {
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '5px',
        margin: '.5rem'
    },
}

export default function Filter(props) {
    return(
        <div>
            <div className="row">
                {
                    props.columns.map(value => {
                        return (
                            <div key={value.code} className="col-sm-2">
                                <div style={styles.blockView}>
                                <FormCheck checked={value.filter.show} label={value.name}
                                           onChange={(e) => props.changeFilter(value.code, value.type, "show", e)}
                                />
                                { value.filter.show &&
                                    <div>
                                        <hr/>
                                        <FormCheck checked={value.filter.showAll.value}
                                                   label='Все поля'
                                                   onChange={(e) => props.changeFilter(value.code, value.type, "showAll", e)}
                                        />
                                        { !value.filter.showAll.value &&
                                            <FilterNotShowAll column={value} changeFilter={props.changeFilter} selectedDataMultiselect={props.selectedDataMultiselect} />
                                        }
                                    </div>
                                }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <br />
            <div className="row">
                <div className="col-sm-12 center">
                    <Button variant="primary" onClick={(e) => props.filterTable()} >
                        Отфильтровать таблицу&nbsp;&nbsp;<FontAwesomeIcon icon={faFilter} />
                    </Button>
                    &nbsp;
                    <Button variant="secondary" onClick={(e) => props.resetFilter()} >
                        Сбросить фильтр&nbsp;&nbsp;<FontAwesomeIcon icon={faTimes} />
                    </Button>
                </div>
            </div>
        </div>
    )
}
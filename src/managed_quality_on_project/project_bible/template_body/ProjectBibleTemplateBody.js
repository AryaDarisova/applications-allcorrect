import React, {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import TableInfo from "../template_body/TableInfo";

export default function ProjectBibleTemplateHeader(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rows, setRows] = useState([{
        data: []
    }]);

    useEffect(async () => {
        await fetch("/proxy/project_bible_template/projectBibleTemplate", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                (result) => {
                    result.map(value => {
                        console.log("value", value)
                        if (value.template) {
                            setRows(rows.map(info => {
                                info.data.push({
                                    "name": value.name,
                                    "type": value.type,
                                    "data": []
                                });

                                return info
                            }))
                        }

                        return value
                    })

                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
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
                <div className="row">
                    <div className="col-sm-12">
                        <div className="managedQualityOnProjectBlockView">
                            <TableInfo data={rows[0].data} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
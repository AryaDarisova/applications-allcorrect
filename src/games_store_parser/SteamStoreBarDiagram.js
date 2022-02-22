import React, {useState} from "react";
import {Bar} from "react-chartjs-2";
import logo from "../img/logo1.png";
import {defaults} from "react-chartjs-2";
import SteamBar from "./SteamBar";

const styles = {
    blockView: {
        border: '1px solid #ccc',
        padding: '.5rem 1rem',
        borderRadius: '5px',
        margin: '.5rem'
    },

    blockRight: {
        textAlign: 'right'
    },

    blockCenter: {
        textAlign: 'center'
    },

    inputPercent: {
        width: '50px',
    },

    inputCheckbox: {
        marginLeft: '0px',
    },
}

export default function SteamStoreBarDiagram(props) {
    let values = props.data
    let dataArray = []
    let labels = []
    let positiveData = []
    let negativeData = []
    let allData = []
    /*const [data, setData] = useState([{
        data: []
    }])*/
    const [typeOfDataForBarDiagram, setTypeOfDataForBarDiagram] = React.useState([
        {id: 'all', name: 'Деление на позитивные и негативные', checked: true},
        {id: 'positive', name: 'Только позитивные', checked: false},
        {id: 'negative', name: 'Только негативные', checked: false},
        {id: 'summ', name: 'Без деления на позитивные и негативные', checked: false}
    ])

    function typeOfDataForBarDiagramClick(id) {
        setTypeOfDataForBarDiagram(typeOfDataForBarDiagram.map(value => {
            if (value.id === id) {
                value.checked = !value.checked
            } else {
                value.checked = false
            }

            return value
        }))
    }

    if (props.clearLanguages) {
        let otherData = []

        values.forEach(function (value, key) {
            let perсent = value.get("all") / props.allReviewsCount * 100
            perсent = +perсent.toFixed(2)

            if (perсent >= props.languageClearPercent) {
                dataArray.push({
                    label: key,
                    positive: value.get("positive"),
                    negative: value.get("negative"),
                    all: value.get("all"),
                    percent: perсent
                })
            } else {
                let otherItem = {
                    positive: value.get("positive"),
                    negative: value.get("negative"),
                    all: value.get("all"),
                    percent: perсent
                }

                otherData.push(otherItem)
            }
        })

        if (otherData.length) {
            let otherPositiveValue = 0
            let otherNegativeValue = 0
            let otherAllValue = 0
            let otherPercentValue = 0

            for (let i = 0; i < otherData.length; i++) {
                otherPositiveValue += otherData[i].positive
                otherNegativeValue += otherData[i].negative
                otherAllValue += otherData[i].all
                otherPercentValue += otherData[i].percent
            }

            dataArray.push({
                label: "Other",
                positive: otherPositiveValue,
                negative: otherNegativeValue,
                all: otherAllValue,
                percent: +otherPercentValue.toFixed(2)
            })
        }
    } else {
        values.forEach(function (value, key) {
            let persent = value.get("all") / props.allReviewsCount * 100
            persent = +persent.toFixed(2)

            dataArray.push({
                label: key,
                positive: value.get("positive"),
                negative: value.get("negative"),
                all: value.get("all"),
                percent: persent
            })
        })
    }

    dataArray.sort(function(a, b) {
        if (a.label === "Other") {
            return 1
        } else {
            return b.all - a.all
        }
    })

    dataArray.forEach(function (value) {
        labels.push(value.label)
        positiveData.push(value.positive)
        negativeData.push(value.negative)
        allData.push(value.all)
    })

    defaults.font.size = 16

    /*setData(
        data.map(value => {
            value.data.push({
                labels: labels,
                datasets: [
                    {
                        label: 'Negative',
                        data: negativeData,
                        backgroundColor: 'rgb(255, 99, 132)',
                    },
                    {
                        label: 'Positive',
                        data: positiveData,
                        backgroundColor: 'rgb(54, 162, 235)',
                    }
                ]
            })

            return value
        })
    )*/

    let data = {
        labels: labels,
        datasets: [
            {
                label: 'Negative',
                data: negativeData,
                backgroundColor: 'rgb(255, 99, 132)',
            },
            {
                label: 'Positive',
                data: positiveData,
                backgroundColor: 'rgb(54, 162, 235)',
            }
        ]
    }

    let options = {
        responsive: true,
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 18
                    }
                }
            }
        }
    }

    return(
        <div>
            <div className="row">
                <div className="col-sm-6">
                    <div style={styles.blockView}>
                        <strong>Total reviews:</strong> {props.allReviewsCount}
                        <br />
                        <br />
                        {
                            dataArray.map(item => {
                                return (
                                    <div key={item.label}>
                                        <strong>{item.label}:</strong> {item.all} ({item.percent}%)
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="col-sm-1">

                </div>
                <div className="col-sm-5">
                    <div className="form-check" style={styles.blockView}>
                        <div className="row">
                            <div className="col-sm-1 form-check">
                                <input type="checkbox" className="form-check-input"
                                       id="steamClearLanguages"
                                       name="steamClearLanguages"
                                       checked={props.clearLanguages}
                                       onChange={() => props.clearLanguagesFunc("steam")} style={styles.inputCheckbox}/>
                            </div>
                            <div className="col-sm-8">
                                <label className="form-check-label">Убрать языки с количеством процентов менее </label>
                            </div>
                            <div className="col-sm-2">
                                <input
                                    className="form-control"
                                    id="inputSteamClearLanguagesPercent"
                                    name="inputSteamClearLanguagesPercent"
                                    defaultValue={props.languageClearPercent}
                                    onChange={e => props.setClearLanguagesPercent("steam", e.target.value)}
                                    style={styles.inputPercent}/>
                            </div>
                        </div>
                        <br />
                        <br />
                        {
                            typeOfDataForBarDiagram.map(value => {
                                return(
                                    <div key={value.id} className="row">
                                        <div className="col-sm-2 form-check">
                                            <input type="checkbox" className="form-check-input"
                                                   id={value.id}
                                                   checked={value.checked}
                                                   onChange={() => typeOfDataForBarDiagramClick(value.id)} style={styles.inputCheckbox}/>
                                        </div>
                                        <div className="col-sm-10">
                                            <label className="form-check-label">{value.name}</label>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <br />
            <br />
            <div className="row">
                <div className="col-sm-12" style={styles.blockRight}>
                    <img src={logo} alt="logo"/>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12" style={styles.blockCenter}>
                    <h4>{props.appName}</h4>
                </div>
            </div>
            <SteamBar allChecked={typeOfDataForBarDiagram[0].checked}
                      positiveChecked={typeOfDataForBarDiagram[1].checked}
                      negativeChecked={typeOfDataForBarDiagram[2].checked}
                      summChecked={typeOfDataForBarDiagram[3].checked} labels={labels} positiveData={positiveData}
                      negativeData={negativeData} allData={allData} />
            {/*<Bar data={data} options={options} />*/}
        </div>
    )
}
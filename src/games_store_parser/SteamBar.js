import React from "react";
import {Bar} from "react-chartjs-2";
import {defaults} from "react-chartjs-2";

export default function SteamBar(props) {
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

    if (props.positiveChecked) {
        let data = {
            labels: props.labels,
            datasets: [
                {
                    label: '',
                    data: props.positiveData,
                    backgroundColor: 'rgb(54, 162, 235)',
                }
            ]
        }

        return(
            <Bar data={data} options={options} />
        )
    } else if (props.negativeChecked) {
        let data = {
            labels: props.labels,
            datasets: [
                {
                    label: '',
                    data: props.negativeData,
                    backgroundColor: 'rgb(54, 162, 235)',
                }
            ]
        }

        return(
            <Bar data={data} options={options} />
        )
    } else if (props.summChecked) {
        let data = {
            labels: props.labels,
            datasets: [
                {
                    label: '',
                    data: props.allData,
                    backgroundColor: 'rgb(54, 162, 235)',
                }
            ]
        }

        return(
            <Bar data={data} options={options} />
        )
    } else {
        let data = {
            labels: props.labels,
            datasets: [
                {
                    label: 'Negative',
                    data: props.negativeData,
                    backgroundColor: 'rgb(255, 99, 132)',
                },
                {
                    label: 'Positive',
                    data: props.positiveData,
                    backgroundColor: 'rgb(54, 162, 235)',
                }
            ]
        }

        return(
            <Bar data={data} options={options} />
        )
    }
}


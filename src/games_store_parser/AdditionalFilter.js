import { DateRangePicker } from 'react-date-range';
import { useState } from 'react';

export default function AdditionalFilter({checked, steamRemoveEnglish, steamAllTime, setSteamDateRange}) {
    return(
        <div>
            {
                checked.map(store => {
                    if (store.checked) {
                        if (store.id === "appStore") {

                        } else if (store.id === "googlePlay") {

                        } else if (store.id === "steam") {
                            const selectionRange = {
                                startDate: new Date(),
                                endDate: new Date(),
                                key: 'selection',
                            }

                            return (
                                <div key={store.id}>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label htmlFor="inputAppName" className="form-label"><strong>Название приложения/игры</strong></label>
                                            <input className="form-control" id="inputAppName" name="inputAppName"
                                                   placeholder=""/>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input"
                                                       id="steamRemoveEnglishLanguage" name="steamRemoveEnglishLanguage"
                                                       checked={store.removeEnglish} onChange={() => steamRemoveEnglish()}/>
                                                <label className="form-check-label" htmlFor="steamLanguagesAll">Исключить английский</label>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input"
                                                       id="steamAllTime" name="steamAllTime"
                                                       checked={store.allTime} onChange={() => steamAllTime()}/>
                                                <label className="form-check-label" htmlFor="steamAllTime">За все время</label>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    {
                                        !store.allTime &&
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label htmlFor="inputDateRange" className="form-label"><strong>Период
                                                    выборки:</strong></label>
                                                <br/>
                                                <DateRangePicker
                                                    onChange={item => setSteamDateRange([item.selection])}
                                                    showSelectionPreview={true}
                                                    moveRangeOnFirstSelection={false}
                                                    months={1}
                                                    ranges={store.dateRange}
                                                    direction="horizontal"
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        }
                    }
                })
            }
        </div>
    )
}
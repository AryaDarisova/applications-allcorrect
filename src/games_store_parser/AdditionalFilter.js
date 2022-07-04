import { DateRangePicker } from 'react-date-range';
import React, { useState } from 'react';
import {MultiSelect} from "primereact/multiselect";

const styles = {
    multiselectStyle: {
        width: '100%'
    }
}

export default function AdditionalFilter({checked, setSelectedLanguagesMultiselect, setAllTime, setDateRange, setSearchLocReviews}) {
    return(
        <div>
            {
                checked.map(store => {
                    if (store.checked) {
                        if (store.id === "appStore") {
                            let multiselectOptions = []
                            let selected = []

                            store.countryList.map(country => {
                                country.countryCodes.map(code => {
                                    multiselectOptions.push({
                                        label: country.name + " (" + code.code + ")",
                                        value: {country: country.id, code: code.code}
                                    })

                                    if (code.checked) {
                                        selected.push({country: country.id, code: code.code})
                                    }
                                })
                            })

                            return (
                                <div key={store.id}>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label htmlFor="inputLanguages" className="form-label"><strong>Выбор языков:</strong></label>
                                            <br/>
                                            <MultiSelect value={selected}
                                                         options={multiselectOptions}
                                                         style={styles.multiselectStyle}
                                                         className="multiselect-custom-style"
                                                         onChange={(e) =>
                                                             setSelectedLanguagesMultiselect(store.id, e.value)}
                                                         maxSelectedLabels={1} />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input"
                                                       id="appStoreAllTime" name="appStoreAllTime"
                                                       checked={store.allTime} onChange={() => setAllTime(store.id)}/>
                                                <label className="form-check-label" htmlFor="appStoreAllTime">За все время</label>
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
                                                    onChange={item => setDateRange(store.id, [item.selection])}
                                                    showSelectionPreview={true}
                                                    moveRangeOnFirstSelection={false}
                                                    months={1}
                                                    ranges={store.dateRange}
                                                    direction="horizontal"
                                                />
                                            </div>
                                            <br />
                                        </div>
                                    }
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input"
                                                       id="appStoreSearchLocReviews" name="appStoreSearchLocReviews"
                                                       checked={store.searchLocReviews} onChange={() => setSearchLocReviews(store.id)}/>
                                                <label className="form-check-label" htmlFor="appStoreSearchLocReviews">Искать Лок отзывы</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        } else if (store.id === "googlePlay") {
                            let multiselectOptions = []
                            let selected = []

                            store.languageList.map(language => {
                                language.languageCodes.map(code => {
                                    multiselectOptions.push({
                                        label: language.name + " (" + code.code + ")",
                                        value: {language: language.id, code: code.code}
                                    })

                                    if (code.checked) {
                                        selected.push({language: language.id, code: code.code})
                                    }
                                })
                            })

                            return (
                                <div key={store.id}>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label htmlFor="inputLanguages" className="form-label"><strong>Выбор языков:</strong></label>
                                            <br/>
                                            <MultiSelect value={selected}
                                                         options={multiselectOptions}
                                                         style={styles.multiselectStyle}
                                                         className="multiselect-custom-style"
                                                         onChange={(e) =>
                                                             setSelectedLanguagesMultiselect(store.id, e.value)}
                                                         maxSelectedLabels={1} />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input"
                                                       id="googlePlayAllTime" name="googlePlayAllTime"
                                                       checked={store.allTime} onChange={() => setAllTime(store.id)}/>
                                                <label className="form-check-label" htmlFor="googlePlayAllTime">За все время</label>
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
                                                    onChange={item => setDateRange(store.id, [item.selection])}
                                                    showSelectionPreview={true}
                                                    moveRangeOnFirstSelection={false}
                                                    months={1}
                                                    ranges={store.dateRange}
                                                    direction="horizontal"
                                                />
                                            </div>
                                            <br />
                                        </div>
                                    }
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input"
                                                       id="googlePlaySearchLocReviews" name="googlePlaySearchLocReviews"
                                                       checked={store.searchLocReviews} onChange={() => setSearchLocReviews(store.id)}/>
                                                <label className="form-check-label" htmlFor="googlePlaySearchLocReviews">Искать Лок отзывы</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        } else if (store.id === "steam") {
                            let multiselectOptions = []
                            let selected = []

                            store.languageList.map(value => {
                                multiselectOptions.push({
                                    label: value.name,
                                    value: value.id
                                })

                                if (value.checked) {
                                    selected.push(value.id)
                                }
                            })

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
                                            <label htmlFor="inputLanguages" className="form-label"><strong>Выбор языков:</strong></label>
                                            <br/>
                                            <MultiSelect value={selected}
                                                         options={multiselectOptions}
                                                         style={styles.multiselectStyle}
                                                         className="multiselect-custom-style"
                                                         onChange={(e) =>
                                                             setSelectedLanguagesMultiselect(store.id, e.value)}
                                                         maxSelectedLabels={1} />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input"
                                                       id="steamAllTime" name="steamAllTime"
                                                       checked={store.allTime} onChange={() => setAllTime(store.id)}/>
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
                                                    onChange={item => setDateRange([item.selection])}
                                                    showSelectionPreview={true}
                                                    moveRangeOnFirstSelection={false}
                                                    months={1}
                                                    ranges={store.dateRange}
                                                    direction="horizontal"
                                                />
                                            </div>
                                            <br />
                                        </div>
                                    }
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input"
                                                       id="steamSearchLocReviews" name="steamSearchLocReviews"
                                                       checked={store.searchLocReviews} onChange={() => setSearchLocReviews(store.id)}/>
                                                <label className="form-check-label" htmlFor="steamSearchLocReviews">Искать Лок отзывы</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    }
                })
            }
        </div>
    )
}
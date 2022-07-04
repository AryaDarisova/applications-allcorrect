import Form from "./Form";
import ReviewsInfo from "./ReviewsInfo";
import React from "react";
import "./css/gamesStoreParser.css"

export default function GameStoreParser(props) {
    // let countGooglePlayLanguages = 0;
    let countGooglePlayLanguageCodes = 0;
    let countAppStoreCountriesCodes = 0;
    let countSteamLanguages = 0;

    const [gameStores, setGameStores] = React.useState([
        {
            id: 'googlePlay', name: 'Google Play', checked: false, infoOnGet: false, infoReady: false, /*removeEnglish: false,*/
            data: [], searchLocReviews: false, locReviewsData: [], appName: "", reviewsCount: 0,
            languageList: [
                {id: "arabic", name: "Arabic", languageCodes: [
                    {code: "AR", checked: true}
                ]},
                {id: "chineseSimpl", name: "Chinese (Simpl)", languageCodes: [
                    {code: "ZH-CN", checked: true}
                ]},
                {id: "chineseTrad", name: "Chinese (Trad)", languageCodes: [
                    {code: "ZH-TW", checked: true},
                    {code: "ZH-HK", checked: true}
                ]},
                {id: "czech", name: "Czech", languageCodes: [
                    {code: "CS", checked: true}
                ]},
                {id: "danish", name: "Danish", languageCodes: [
                    {code: "DA", checked: true}
                ]},
                {id: "dutch", name: "Dutch", languageCodes: [
                    {code: "NL", checked: true}
                ]},
                {id: "english", name: "English", languageCodes: [
                    {code: "EN", checked: true}
                ]},
                {id: "finnish", name: "Finnish", languageCodes: [
                    {code: "FI", checked: true}
                ]},
                {id: "french", name: "French", languageCodes: [
                    {code: "FR", checked: true}
                ]},
                {id: "german", name: "German", languageCodes: [
                    {code: "DE", checked: true}
                ]},
                {id: "greek", name: "Greek", languageCodes: [
                    {code: "EL", checked: true}
                ]},
                {id: "hebrew", name: "Hebrew", languageCodes: [
                    {code: "HE", checked: true}
                ]},
                {id: "hindi", name: "Hindi", languageCodes: [
                    {code: "HI", checked: true}
                ]},
                {id: "icelandic", name: "Icelandic", languageCodes: [
                    {code: "IS", checked: true}
                ]},
                {id: "indonesian", name: "Indonesian", languageCodes: [
                    {code: "ID", checked: true}
                ]},
                {id: "italian", name: "Italian", languageCodes: [
                    {code: "IT", checked: true}
                ]},
                {id: "japanese", name: "Japanese", languageCodes: [
                    {code: "JA", checked: true}
                ]},
                {id: "korean", name: "Korean", languageCodes: [
                    {code: "KO", checked: true}
                ]},
                {id: "malayan", name: "Malayan", languageCodes: [
                    {code: "MS", checked: true}
                ]},
                {id: "norwegian", name: "Norwegian", languageCodes: [
                    {code: "NO", checked: true}
                ]},
                {id: "polish", name: "Polish", languageCodes: [
                    {code: "PL", checked: true}
                ]},
                {id: "portugueseBR", name: "Portuguese (BR)", languageCodes: [
                    {code: "PT-BR", checked: true}
                ]},
                {id: "portuguesePT", name: "Portuguese (PT)", languageCodes: [
                    {code: "PT-PT", checked: true}
                ]},
                {id: "russian", name: "Russian", languageCodes: [
                    {code: "RU", checked: true}
                ]},
                {id: "spanish", name: "Spanish", languageCodes: [
                    {code: "ES", checked: true}
                ]},
                {id: "swedish", name: "Swedish", languageCodes: [
                    {code: "SV", checked: true}
                ]},
                {id: "thai", name: "Thai", languageCodes: [
                    {code: "TH", checked: true}
                ]},
                {id: "turkish", name: "Turkish", languageCodes: [
                    {code: "TR", checked: true}
                ]},
                {id: "vietnamese", name: "Vietnamese", languageCodes: [
                    {code: "VI", checked: true}
                ]},
            ], allTime: true, dateRange: [{
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }],
        },
        {
            id: 'appStore', name: 'App Store', checked: false, infoOnGet: false, infoReady: false, /*removeEnglish: false,*/
            data: [], searchLocReviews: false, locReviewsData: [], appName: "",
            countryList: [
                {id: "arabic", name: "Arabic", countryCodes: [
                    {code: "AE", checked: true},
                    {code: "EG", checked: true},
                    {code: "SA", checked: true}
                ]},
                {id: "chineseSimpl", name: "Chinese (Simpl)", countryCodes: [
                    {code: "CN", checked: true},
                    {code: "SG", checked: true}
                ]},
                {id: "chineseTrad", name: "Chinese (Trad)", countryCodes: [
                    {code: "HK", checked: true},
                    {code: "TW", checked: true}
                ]},
                {id: "czech", name: "Czech", countryCodes: [
                    {code: "CZ", checked: true}
                ]},
                {id: "danish", name: "Danish", countryCodes: [
                    {code: "DK", checked: true}
                ]},
                {id: "dutch", name: "Dutch", countryCodes: [
                    {code: "NL", checked: true}
                ]},
                {id: "english", name: "English", countryCodes: [
                    {code: "AU", checked: true},
                    {code: "CA", checked: true},
                    {code: "GB", checked: true},
                    {code: "IE", checked: true},
                    {code: "NZ", checked: true},
                    {code: "US", checked: true}
                ]},
                {id: "finnish", name: "Finnish", countryCodes: [
                    {code: "FI", checked: true}
                ]},
                {id: "french", name: "French", countryCodes: [
                    {code: "FR", checked: true}
                ]},
                {id: "german", name: "German", countryCodes: [
                    {code: "DE", checked: true}
                ]},
                {id: "greek", name: "Greek", countryCodes: [
                    {code: "GR", checked: true}
                ]},
                {id: "hebrew", name: "Hebrew", countryCodes: [
                    {code: "IL", checked: true}
                ]},
                {id: "hindi", name: "Hindi", countryCodes: [
                    {code: "IN", checked: true}
                ]},
                {id: "icelandic", name: "Icelandic", countryCodes: [
                    {code: "IS", checked: true}
                ]},
                {id: "indonesian", name: "Indonesian", countryCodes: [
                    {code: "ID", checked: true}
                ]},
                {id: "italian", name: "Italian", countryCodes: [
                    {code: "IT", checked: true}
                ]},
                {id: "japanese", name: "Japanese", countryCodes: [
                    {code: "JP", checked: true}
                ]},
                {id: "korean", name: "Korean", countryCodes: [
                    {code: "KR", checked: true}
                ]},
                {id: "malayan", name: "Malayan", countryCodes: [
                    {code: "MY", checked: true}
                ]},
                {id: "norwegian", name: "Norwegian", countryCodes: [
                    {code: "NO", checked: true}
                ]},
                {id: "polish", name: "Polish", countryCodes: [
                    {code: "PL", checked: true}
                ]},
                {id: "portugueseBRZ", name: "Portuguese (BRZ)", countryCodes: [
                    {code: "BR", checked: true}
                ]},
                {id: "portugueseEUR", name: "Portuguese (EUR)", countryCodes: [
                    {code: "PT", checked: true}
                ]},
                {id: "russian", name: "Russian", countryCodes: [
                    {code: "BY", checked: true},
                    {code: "RU", checked: true}
                ]},
                {id: "spanish", name: "Spanish", countryCodes: [
                    {code: "ES", checked: true}
                ]},
                {id: "swedish", name: "Swedish", countryCodes: [
                    {code: "SE", checked: true}
                ]},
                {id: "thai", name: "Thai", countryCodes: [
                    {code: "TH", checked: true}
                ]},
                {id: "turkish", name: "Turkish", countryCodes: [
                    {code: "TR", checked: true}
                ]},
                {id: "vietnamese", name: "Vietnamese", countryCodes: [
                    {code: "VN", checked: true}
                ]},
            ], allTime: true, dateRange: [{
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }]
        },
        {
            id: 'steam', name: 'Steam', checked: false, infoOnGet: false, infoReady: false, /*removeEnglish: false,*/
            data: [], searchLocReviews: false, locReviewsData: [], appName: "", languageClearPercent: 0.10,
            languageClearPercentOnInput: 0.10, reviewsCount: 0,
            languageList: [
                {id: "arabic", webId: "ar", name: "Arabic", checked: true},
                {id: "bulgarian", webId: "bg", name: "Bulgarian", checked: true},
                {id: "schinese", webId: "zh-CN", name: "Chinese (Simplified)", checked: true},
                {id: "tchinese", webId: "zh-TW", name: "Chinese (Traditional)", checked: true},
                {id: "czech", webId: "cs", name: "Czech", checked: true},
                {id: "danish", webId: "da", name: "Danish", checked: true},
                {id: "dutch", webId: "nl", name: "Dutch", checked: true},
                {id: "english", webId: "en", name: "English", checked: true},
                {id: "finnish", webId: "fi", name: "Finnish", checked: true},
                {id: "french", webId: "fr", name: "French", checked: true},
                {id: "german", webId: "de", name: "German", checked: true},
                {id: "greek", webId: "el", name: "Greek", checked: true},
                {id: "hungarian", webId: "hu", name: "Hungarian", checked: true},
                {id: "italian", webId: "it", name: "Italian", checked: true},
                {id: "japanese", webId: "ja", name: "Japanese", checked: true},
                {id: "koreana", webId: "ko", name: "Korean", checked: true},
                {id: "norwegian", webId: "no", name: "Norwegian", checked: true},
                {id: "polish", webId: "pl", name: "Polish", checked: true},
                {id: "brazilian", webId: "pt-BR", name: "Portuguese-Brazil", checked: true},
                {id: "portuguese", webId: "pt", name: "Portuguese", checked: true},
                {id: "romanian", webId: "ro", name: "Romanian", checked: true},
                {id: "russian", webId: "ru", name: "Russian", checked: true},
                {id: "latam", webId: "es-419", name: "Spanish-Latin America", checked: true},
                {id: "spanish", webId: "es", name: "Spanish-Spain", checked: true},
                {id: "swedish", webId: "sv", name: "Swedish", checked: true},
                {id: "thai", webId: "th", name: "Thai", checked: true},
                {id: "turkish", webId: "tr", name: "Turkish", checked: true},
                {id: "ukrainian", webId: "uk", name: "Ukrainian", checked: true},
                {id: "vietnamese", webId: "vn", name: "Vietnamese", checked: true}
            ], allTime: true, dateRange: [{
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }]
        },
    ])

    function storeCLick(id) {
        setGameStores(gameStores.map(store => {
            if (store.id === id) {
                store.checked = !store.checked
            } else {
                store.checked = false
            }

            return store
        }))
    }

    function getReviewsInfo(e) {
        e.preventDefault()
        let appId = e.target.elements.inputAppId.value

        gameStores.map(store => {
            if (store.checked) {
                if (store.id === "googlePlay") {
                    let allCountryCodesCount = countLanguagesLength(store.id, store.languageList)

                    countGooglePlayLanguageCodes = 0
                    // countGooglePlayLanguages = 0

                    setInfoReady("googlePlay", false)
                    setInfoOnGet("googlePlay", true)

                    for (let i = 0; i < store.languageList.length; i++) {
                        for (let j = 0; j < store.languageList[i].languageCodes.length; j++) {
                            if (store.languageList[i].languageCodes[j].checked) {
                                googlePlayRekursivelyGetReviews(null, appId, store.languageList[i].languageCodes[j],
                                    store.languageList.length, store.languageList[i].name, allCountryCodesCount)
                            }
                        }
                    }
                } else if (store.id === "appStore") {
                    let allCountryCodesCount = countLanguagesLength(store.id, store.countryList)

                    countAppStoreCountriesCodes = 0

                    setInfoReady("appStore", false)
                    setInfoOnGet("appStore", true)

                    for (let i = 0; i < store.countryList.length; i++) {
                        for (let j = 0; j < store.countryList[i].countryCodes.length; j++) {
                            let countryCode = store.countryList[i].countryCodes[j].code

                            if (store.countryList[i].countryCodes[j].checked) {
                                if (!store.allTime || store.searchLocReviews) {
                                    appStoreRekursivelyGetEveryReview(1, appId, countryCode,
                                        store.countryList[i].name, allCountryCodesCount)
                                } else {
                                    appStoreRekursivelyGetReviews(appId, countryCode, store.countryList[i].name,
                                        allCountryCodesCount)
                                }
                            }
                        }
                    }
                } else if (store.id === "steam") {
                    let appName = e.target.elements.inputAppName.value
                    let allLanguagesCount = countLanguagesLength(store.id, store.languageList)

                    countSteamLanguages = 0

                    steamAddAppName(appName)
                    setInfoReady("steam", false)
                    setInfoOnGet("steam", true)

                    for (let i = 0; i < store.languageList.length; i++) {
                        if (store.languageList[i].checked) {
                            steamRekursivelyGetReviews("*", appId, store.languageList[i].id, allLanguagesCount)
                        }
                    }
                }
            }

            return store
        })
    }

    function countLanguagesLength(store, languages) {
        let length = 0

        if (store === "steam") {
            for (let i = 0; i < languages.length; i++) {
                if (languages[i].checked) {
                    length++
                }
            }
        } else if (store === "appStore") {
            for (let i = 0; i < languages.length; i++) {
                for (let j = 0; j < languages[i].countryCodes.length; j++) {
                    if (languages[i].countryCodes[j].checked) {
                        length++
                    }
                }
            }
        } else if (store === "googlePlay") {
            for (let i = 0; i < languages.length; i++) {
                for (let j = 0; j < languages[i].languageCodes.length; j++) {
                    if (languages[i].languageCodes[j].checked) {
                        length++
                    }
                }
            }
        }

        return length
    }

    function setSearchLocReviews(gameStore) {
        setGameStores(gameStores.map(store => {
            if (store.id === gameStore) {
                store.searchLocReviews = !store.searchLocReviews
            }

            return store
        }))
    }

    function setSteamLanguageClearPercent(value) {
        setGameStores(gameStores.map(store => {
            if (store.id === "steam") {
                store.languageClearPercent = value;
            }

            return store
        }))
    }

    function setSteamLanguageClearPercentOnInput(e) {
        setGameStores(gameStores.map(store => {
            if (store.id === "steam") {
                store.languageClearPercentOnInput = e.target.elements.inputSteamClearLanguagesPercent.value;
            }

            return store
        }))
    }

    function setInfoReady(storeName, value) {
        setGameStores(gameStores.map(store => {
            if (store.id === storeName) {
                store.infoReady = value;

                if (!value) {
                    store.data = [];
                }
            }

            return store
        }))
    }

    function setInfoOnGet(storeName, value) {
        setGameStores(gameStores.map(store => {
            if (store.id === storeName) {
                store.infoOnGet = value;
            }

            return store
        }))
    }

    async function googlePlayRekursivelyGetReviews(nextPaginationToken, appId, lang, langLength, langName, langCodesLength) {
        const response = await fetch('/proxy/mobile_store_proxy/google_play', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({nextPaginationToken: nextPaginationToken, appId: appId, lang: lang})
        });
        let result = await response.json();

        console.log(result);

        if ('error' in result) {
            alert("Ошибка " + result.error + " во время получения данных языка " + langName);
        } else {
            let allTime = true
            let reachBeginningOfTheDateRange = false
            let reachEndOfTheDateRange = false

            setGameStores(gameStores.map(store => {
                if (store.id === "googlePlay") {
                    for (let i = 0; i < result.data.length; i++) {
                        let locCheck = checkLocKeys(result.data[i].text)
                        let voCheck = checkVoKeys(result.data[i].text)

                        allTime = store.allTime

                        if (store.allTime) {
                            let dataItem = {
                                "language": langName + " (" + lang + ")",
                                "score": result.data[i].score
                            };

                            store.data.push(dataItem);

                            if (store.searchLocReviews && (locCheck || voCheck)) {
                                let locReview = {
                                    "user": result.data[i].userName,
                                    "date": result.data[i].date,
                                    "review": result.data[i].text,
                                    "link": result.data[i].url,
                                    "rating": result.data[i].score,
                                    "language": langName + " (" + lang + ")",
                                    "loc": locCheck,
                                    "vo": voCheck
                                };

                                store.locReviewsData.push(locReview);
                            }
                        } else {
                            if (checkGooglePlayDateRange(result.data[i].date)) {
                                reachBeginningOfTheDateRange = true

                                let dataItem = {
                                    "language": langName + " (" + lang + ")",
                                    "score": result.data[i].score
                                };

                                store.data.push(dataItem);

                                if (store.searchLocReviews && (locCheck || voCheck)) {
                                    let locReview = {
                                        "user": result.data[i].userName,
                                        "date": result.data[i].date,
                                        "review": result.data[i].text,
                                        "link": result.data[i].url,
                                        "rating": result.data[i].score,
                                        "language": langName + " (" + lang + ")",
                                        "loc": locCheck,
                                        "vo": voCheck
                                    };

                                    store.locReviewsData.push(locReview);
                                }
                            } else if (reachBeginningOfTheDateRange) {
                                reachEndOfTheDateRange = true

                                break
                            }
                        }
                    }

                    store.reviewsCount += result.data.length;
                }

                return store
            }))

            if (allTime) {
                if (result.nextPaginationToken) {
                    googlePlayRekursivelyGetReviews(result.nextPaginationToken, appId, lang, langLength, langName, langCodesLength);
                } else {
                    if (countGooglePlayLanguageCodes === (langCodesLength - 1)) {
                        setInfoOnGet("googlePlay", false);
                        setInfoReady("googlePlay", true);
                    } else {
                        countGooglePlayLanguageCodes++;
                    }
                    /*if (countGooglePlayLanguages === (langLength - 1)) {
                        if (countGooglePlayLanguageCodes === (langCodesLength - 1)) {
                            setInfoOnGet("googlePlay", false);
                            setInfoReady("googlePlay", true);
                        } else {
                            countGooglePlayLanguageCodes++;
                        }
                    } else {
                        countGooglePlayLanguages++;
                    }*/
                }
            } else {
                if (result.nextPaginationToken &&
                    (!reachBeginningOfTheDateRange || (reachBeginningOfTheDateRange && !reachEndOfTheDateRange))) {
                    googlePlayRekursivelyGetReviews(result.nextPaginationToken, appId, lang, langLength, langName, langCodesLength);
                } else {
                    if (countGooglePlayLanguageCodes === (langCodesLength - 1)) {
                        setInfoOnGet("googlePlay", false);
                        setInfoReady("googlePlay", true);
                    } else {
                        countGooglePlayLanguageCodes++;
                    }

                    /*if (countGooglePlayLanguages === (langLength - 1)) {
                        if (countGooglePlayLanguageCodes === (langCodesLength - 1)) {
                            setInfoOnGet("googlePlay", false);
                            setInfoReady("googlePlay", true);
                        } else {
                            countGooglePlayLanguageCodes++;
                        }
                    } else {
                        countGooglePlayLanguages++;
                    }*/
                }
            }

            /*if (allTime) {
                if (result.length === 50) {
                    appStoreRekursivelyGetEveryReview(++page, appId, countryCodes, countryName, countryCodesLength)
                } else {
                    if (countAppStoreCountriesCodes === (countryCodesLength - 1)) {
                        setInfoOnGet("appStore", false);
                        setInfoReady("appStore", true);
                    } else {
                        countAppStoreCountriesCodes++;
                    }
                }
            } else {
                if (result.length === 50 &&
                    (!reachBeginningOfTheDateRange || (reachBeginningOfTheDateRange && !reachEndOfTheDateRange))) {
                    appStoreRekursivelyGetEveryReview(++page, appId, countryCodes, countryName, countryCodesLength)
                } else {
                    if (countAppStoreCountriesCodes === (countryCodesLength - 1)) {
                        setInfoOnGet("appStore", false);
                        setInfoReady("appStore", true);
                    } else {
                        countAppStoreCountriesCodes++;
                    }
                }
            }*/
        }
    }

    async function appStoreRekursivelyGetEveryReview(page, appId, countryCodes, countryName, countryCodesLength) {
        const response = await fetch('/proxy/mobile_store_proxy/app_store_every_reviews', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({appId: appId, countryCodes: countryCodes, page: page})
        });
        let result = await response.json();

        console.log("appStoreRekursivelyGetEveryReview", result)

        if ('error' in result) {
            alert("Ошибка " + result.error + " во время получения данных страны " + countryName + " - " + countryCodes);
        } else {
            let allTime = true
            let reachBeginningOfTheDateRange = false
            let reachEndOfTheDateRange = false

            setGameStores(gameStores.map(store => {
                if (store.id === "appStore") {
                    for (let i = 0; i < result.length; i++) {
                        let locCheck = checkLocKeys(result[i].text)
                        let voCheck = checkVoKeys(result[i].text)

                        allTime = store.allTime

                        if (store.allTime) {
                            let dataItem = {
                                "language": countryName + " (" + countryCodes + ")",
                                "id": countryCodes,
                                "name": countryName,
                                "score": result[i].score
                            };

                            store.data.push(dataItem);

                            if (store.searchLocReviews && (locCheck || voCheck)) {
                                let locReview = {
                                    "user": /*result[i].userName + " " + */result[i].userUrl,
                                    "date": result[i].updated,
                                    "review": result[i].text,
                                    "link": result[i].url,
                                    "rating": result[i].score,
                                    "language": countryName + " (" + countryCodes + ")",
                                    "loc": locCheck,
                                    "vo": voCheck
                                };

                                store.locReviewsData.push(locReview);
                            }
                        } else {
                            if (checkAppStoreDateRange(result[i].updated)) {
                                reachBeginningOfTheDateRange = true

                                let dataItem = {
                                    "language": countryName + " (" + countryCodes + ")",
                                    "id": countryCodes,
                                    "name": countryName,
                                    "score": result[i].score
                                };

                                store.data.push(dataItem);

                                if (store.searchLocReviews && (locCheck || voCheck)) {
                                    let locReview = {
                                        "user": /*result[i].userName + " " + */result[i].userUrl,
                                        "date": result[i].updated,
                                        "review": result[i].text,
                                        "link": result[i].url,
                                        "rating": result[i].score,
                                        "language": countryName + " (" + countryCodes + ")",
                                        "loc": locCheck,
                                        "vo": voCheck
                                    };

                                    store.locReviewsData.push(locReview);
                                }
                            } else if (reachBeginningOfTheDateRange) {
                                reachEndOfTheDateRange = true

                                break
                            }
                        }
                    }

                    store.reviewsCount += result.length;
                }

                return store
            }))

            if (allTime) {
                if (result.length === 50) {
                    appStoreRekursivelyGetEveryReview(++page, appId, countryCodes, countryName, countryCodesLength)
                } else {
                    if (countAppStoreCountriesCodes === (countryCodesLength - 1)) {
                        setInfoOnGet("appStore", false);
                        setInfoReady("appStore", true);
                    } else {
                        countAppStoreCountriesCodes++;
                    }
                }
            } else {
                if (result.length === 50 &&
                    (!reachBeginningOfTheDateRange || (reachBeginningOfTheDateRange && !reachEndOfTheDateRange))) {
                    appStoreRekursivelyGetEveryReview(++page, appId, countryCodes, countryName, countryCodesLength)
                } else {
                    if (countAppStoreCountriesCodes === (countryCodesLength - 1)) {
                        setInfoOnGet("appStore", false);
                        setInfoReady("appStore", true);
                    } else {
                        countAppStoreCountriesCodes++;
                    }
                }
            }
        }
    }

    async function appStoreRekursivelyGetReviews(appId, countryCodes, countryName, countryCodesLength) {
        const response = await fetch('/proxy/mobile_store_proxy/app_store', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({appId: appId, countryCodes: countryCodes})
        });
        let result = await response.json();

        console.log(result);
        if ('error' in result) {
            alert("Ошибка " + result.error + " во время получения данных страны " +
                countryName + " - " + countryCodes);
        } else {
            let dataItem = {
                "id": countryCodes,
                "name": countryName,
                "ratings": result.ratings,
                "histogram": [result.histogram[1], result.histogram[2], result.histogram[3],
                    result.histogram[4], result.histogram[5]]
            }

            setGameStores(gameStores.map(store => {
                if (store.id === "appStore") {
                    store.data.push(dataItem);
                }

                return store
            }))

            /*if (infoReadyBool) {
                setInfoReady("appStore", true);
            }*/
            if (countAppStoreCountriesCodes === (countryCodesLength - 1)) {
                setInfoReady("appStore", true);
            } else {
                countAppStoreCountriesCodes++;
            }
        }
    }

    async function steamRekursivelyGetReviews(cursor, appId, lang, langLength) {
        let response = await fetch(
            `/appreviews/${appId}?json=1&filter=recent&purchase_type=all&num_per_page=100&cursor=` + cursor + `&language=${lang}`
        );

        if (response.ok) {
            let json = await response.json();
            let allTime = true
            let reachBeginningOfTheDateRange = false
            let reachEndOfTheDateRange = false
            console.log("steam", json)

            setGameStores(gameStores.map(store => {
                if (store.id === "steam") {
                    for (let i = 0; i < json.reviews.length; i++) {
                        let locCheck = checkLocKeys(json.reviews[i].review)
                        let voCheck = checkVoKeys(json.reviews[i].review)

                        allTime = store.allTime

                        if (store.allTime) {
                            let dataItem = {
                                "language": getEngSteamId(store.languageList, json.reviews[i].language),
                                "voted_up": json.reviews[i].voted_up
                            };

                            store.data.push(dataItem);

                            if (store.searchLocReviews && (locCheck || voCheck)) {
                                let locReview = {
                                    "user": "https://steamcommunity.com/profiles/" + json.reviews[i].author.steamid + "/",
                                    "date": new Date(json.reviews[i].timestamp_created * 1000).toLocaleDateString("en-US"),
                                    "review": json.reviews[i].review,
                                    "link": "https://steamcommunity.com/profiles/" + json.reviews[i].author.steamid + "/recommended/" + appId + "/",
                                    "rating": json.reviews[i].voted_up,
                                    "language": json.reviews[i].language,
                                    "loc": locCheck,
                                    "vo": voCheck,
                                    "voted_up": json.reviews[i].voted_up
                                };

                                store.locReviewsData.push(locReview);
                            }
                        } else {
                            if (checkSteamDateRange(json.reviews[i].timestamp_created)) {
                                reachBeginningOfTheDateRange = true

                                let dataItem = {
                                    "language": getEngSteamId(store.languageList, json.reviews[i].language),
                                    "voted_up": json.reviews[i].voted_up
                                };

                                store.data.push(dataItem);

                                if (store.searchLocReviews && (locCheck || voCheck)) {
                                    let locReview = {
                                        "user": "https://steamcommunity.com/profiles/" + json.reviews[i].author.steamid + "/",
                                        "date": new Date(json.reviews[i].timestamp_created * 1000).toLocaleDateString("en-US"),
                                        "review": json.reviews[i].review,
                                        "link": "https://steamcommunity.com/profiles/" + json.reviews[i].author.steamid + "/recommended/" + appId + "/",
                                        "rating": json.reviews[i].voted_up,
                                        "language": json.reviews[i].language,
                                        "loc": locCheck,
                                        "vo": voCheck,
                                        "voted_up": json.reviews[i].voted_up
                                    };

                                    store.locReviewsData.push(locReview);
                                }
                            } else if (reachBeginningOfTheDateRange) {
                                reachEndOfTheDateRange = true

                                break
                            }
                        }
                    }

                    store.reviewsCount += json.reviews.length;
                }

                return store
            }))

            if (allTime) {
                if (cursor !== encodeURIComponent(json.cursor)) {
                    steamRekursivelyGetReviews(encodeURIComponent(json.cursor), appId, lang, langLength)
                } else {
                    if (countSteamLanguages === (langLength - 1)) {
                        setInfoOnGet("steam", false);
                        setInfoReady("steam", true);
                    } else {
                        countSteamLanguages++;
                    }
                }
            } else {
                //не достигли диапазона !reachBeginningOfTheDateRange - идем дальше
                //достигли диапазона и закончили reachBeginningOfTheDateRange && reachEndOfTheDateRange - закончили
                //достигли диапазона и не закончили reachBeginningOfTheDateRange && !reachEndOfTheDateRange - идем дальше
                //закончили reachEndOfTheDateRange - закончили
                if (cursor !== encodeURIComponent(json.cursor) &&
                    (!reachBeginningOfTheDateRange || (reachBeginningOfTheDateRange && !reachEndOfTheDateRange))) {
                    steamRekursivelyGetReviews(encodeURIComponent(json.cursor), appId, lang, langLength);
                } else {
                    if (countSteamLanguages === (langLength - 1)) {
                        setInfoOnGet("steam", false);
                        setInfoReady("steam", true);
                    } else {
                        countSteamLanguages++;
                    }
                }
            }
        } else {
            alert("Ошибка HTTP: " + response.status + " во время получения данных языка " + lang);
        }
    }

    function steamAddAppName(name) {
        setGameStores(gameStores.map(store => {
            if (store.id === "steam") {
                store.appName = name;
            }

            return store
        }))
    }

    function getEngSteamId(steamArr, id) {
        for (let i = 0; i < steamArr.length; i++) {
            if (steamArr[i].id === id) {
                return steamArr[i].name;
            }
        }
    }

    function setSelectedLanguagesMultiselect(storeName, value) {
        setGameStores(gameStores.map(store => {
            if (store.id === storeName) {
                if (storeName === "steam") {
                    store.languageList.map(language => {
                        language.checked = value.includes(language.id)
                    })
                } else if (storeName === "appStore") {
                    console.log("CHECKED", value)

                    store.countryList.map(country => {
                        country.countryCodes.map(code => {
                            let includedValue = {country: country.id, code: code.code}

                            // code.checked = value.includes(includedValue)
                            code.checked = value.some(item => JSON.stringify(item) === JSON.stringify(includedValue))
                        })
                    })
                } else if (storeName === "googlePlay") {
                    console.log("CHECKED", value)

                    store.languageList.map(language => {
                        language.languageCodes.map(code => {
                            let includedValue = {language: language.id, code: code.code}

                            // code.checked = value.includes(includedValue)
                            code.checked = value.some(item => JSON.stringify(item) === JSON.stringify(includedValue))
                        })
                    })
                }
            }

            return store
        }))
    }

    function setAllTime(storeName) {
        setGameStores(gameStores.map(store => {
            if (store.id === storeName) {
                store.allTime = !store.allTime
            }

            return store
        }))
    }

    function setDateRange(storeName, range) {
        setGameStores(gameStores.map(store => {
            if (store.id === storeName) {
                store.dateRange = range
            }

            return store
        }))
    }

    function checkSteamDateRange(reviewDate) {
        let check

        setGameStores(gameStores.map(store => {
            let startDate
            let endDate

            if (store.id === "steam") {
                startDate = store.dateRange[0].startDate.getTime() / 1000
                endDate = store.dateRange[0].endDate.getTime() / 1000 + 86400

                console.log("startDate", store.dateRange[0].startDate, startDate,
                    "endDate", store.dateRange[0].endDate, endDate, "reviewDate", reviewDate)

                check = reviewDate >= startDate && reviewDate <= endDate
            }

            return store
        }))

        return check
    }

    function checkGooglePlayDateRange(reviewDate) {
        let check

        setGameStores(gameStores.map(store => {
            let startDate
            let endDate

            if (store.id === "googlePlay") {
                startDate = store.dateRange[0].startDate.getTime() / 1000
                endDate = store.dateRange[0].endDate.getTime() / 1000 + 86400
                reviewDate = Date.parse(reviewDate.substr(0, 10)) / 1000

                console.log("startDate", store.dateRange[0].startDate, startDate,
                    "endDate", store.dateRange[0].endDate, endDate, "reviewDate", reviewDate)

                check = reviewDate >= startDate && reviewDate <= endDate
            }

            return store
        }))

        return check
    }

    function checkAppStoreDateRange(reviewDate) {
        let check

        setGameStores(gameStores.map(store => {
            let startDate
            let endDate

            if (store.id === "appStore") {
                startDate = store.dateRange[0].startDate.getTime() / 1000
                endDate = store.dateRange[0].endDate.getTime() / 1000 + 86400
                reviewDate = Date.parse(reviewDate.substr(0, 10)) / 1000

                check = reviewDate >= startDate && reviewDate <= endDate
            }

            return store
        }))

        return check
    }

    function checkLocKeys(review) {
        let locRegex = /(Íslensku|Übersetzung|översättning|þýðing|Česky|İngilizce|Γλώσσα|Ελληνικά|αγγλικά|εντοπισμός|μετάφραση|граммат|локализ|опечат|орфогр|перевед|перевел|перевод|пунктуа|русск|субтитр|язык|אנגלית|לוקליזציה|עברית|שָׂפָה|תִרגוּם|الإنجليزية|العربية|الموقع|ترجمة|لغة|अंग्रेजी|अनुवाद|भाषा|स्थानीयकरण|हिन्दी|การแปล|การ จำกัด|ภาษา|อังกฤษ|ไทย|中国|中國|局地化|日本|本土化|翻訳|翻譯|翻译|英語|英语|言語|語言|语言|번역|언어|영어|지방화|한국| çeviri | dil | grammatical(ly)? | taal |Anglický|Deutsch|Engels|Englisch|Français|Italiano|Jazyk|Kieli|Lokalisierung|Lokalizacja|Melayu|Nederlands|Portugues|Språk|Sprache|Sprog|Türk|Tiếng Việt|Traduction|angielski|anglais|bahasa|bahasa inggeris|dịch|dansk|engelsk|engelska|englanti|english|ensku|español|idioma|indonesia|inggris|inglés|inglês|inglese|język|käännös|língua|la langue|language|lingua|localis|localisation|localiz|localização|localización|localizzazione|lokalisatie|lokalisering|lokalisointi|lokalizace|nội địa hoá|ngôn ngữ|norsk|oversættelse|oversettelse|překlad|penyetempatan|polski|staðsetning|subtitle|suomalainen|svenska|tłumaczenie|terjemahan|tiếng Anh|tradução|traducción|traduzione|translat|tungumál|typo(s)? |vertaling|yerelleştirme)/g;
        let locMatchValue = review.match(locRegex) || []

        return locMatchValue.length;
    }

    function checkVoKeys(review) {
        let voRegex = /(Äänet|Ääni|Þulur|Đã lồng tiếng|Đang diễn|Ασύγχρονη αφήγηση|Αφηγητής|Διάλογος|Ηθοποιία φωνής|Ηθοποιός φωνής|Μεταγλωττισμένο|Μεταγλώττιση|Φωνές|Φωνή|Χείλος|актриса|голоса|голос|голос за кадром|диалог|дублировано|дубляж|закадровый перевод|укладка текста|דו-שיח|לדובב|מדובב|משחק|קולות|קול|קריין|קריינות|שחקן|שחקנית|שפה|أصوات|تعليق صوتي|تمثيل|حوار|دبلجة|راوي|شفة|صوت|مدبلج|ممثلة|ممثل|अभिनय|अभिनेता|अभिनेत्री|ओंठ|डब|डब किया हुआ|प्रस्तुतकर्ता|वॉएसओवर|वॉएसेस|वॉएस|संवाद|การแสดง|นักแสดงชาย|นักแสดงหญิง|บทสนทนา|ผู้บรรยาย|พากย์|ริมฝีปาก|เสียงบรรยาย|เสียงพากย์|เสียง|ナレーター|ボイスオーバー|リップ|会話|吹き替え版|吹き替え|声優|声音|声|女配音|对口型|对白|對嘴|對話|已配音|旁白員|旁白|演技|男配音|聲音|解说员|配音員|配音|饰演|내레이터|대화|더빙됨|더빙|립|보이스오버|연기자|연기|음성| акт(е|ё)р | Ret | Ses | Stem | actor(s)? |Acteerwerk|Acteur|Actrice|Actriz|Aktör|Akting|Aktor|Aktorka|Aktorstwo|Aktris|Alih suara|Anlatıcı|Ator|Atriz|Berättare|Berättarröst|Berlakon|Bibir|Commentaire|Dab|Dabovaný|Diálogo|Diễn viên nữ|Diễn viên nam|Dialih suara|Dialog|Dialogi|Dialogue|Dialoog|Diyalog|Doblado|Doblaje|Dobrado|Dobrar|Doublé|Doublage|Dubattu|Dubba|Dubbad|Dubbaus|Dubbet tale|Dubbing|Dubbingować|Dubbingowany|Dublaj|Dublajlı|Dudak|Eftersynkronisation|Eftersynkroniseret|Erzähler|Fortæller|Forteller|Fortellerstemme|Głos|Głosy|Giọng nói|Hội thoại|Herečka|Herec|Hlas|Hlasy|Hraní|Huuli|Interprétation|Interpretação|Interpretación|Kertoja|Komentář|Lábio|Läpp|Lồng tiếng|Leika|Leikari|Leikkona|Lip|Lippe|Lipsynchronisatie|Môi|Näytellä|Näyttelijä|Näyttelijätär|Nagesynchroniseerd|Narator|Narrateur|Narrator|Nasynchronisatie|Người tường thuật|Off-Stimme|Oyunculuk|Pelakon lelaki|Pelakon perempuan|Pengisah|Rödd|Röst|Röster|Raddir|Selostus|Seslendirme|Sesler|Sincronización labial|Skådespelare|Skådespeleri|Skådespelerska|Skuespil|Skuespill|Skuespiller|Skuespillerinne|Stemme|Stemmen|Stemmer|Stimme|Stimmen|Suara|Suara latar|Suara-suara|Synchronisation|Synchronisation labiale|Synchronisieren|Synchronisiert|Synchronsprecher|Synchronsprecherin|Talsetja|Talsetning|Talsett|Thuyết minh|Usta|Vör|Verteller|Viðræður|Voces|Voice-over|Voiceover|Voix|Voz|Voz en off|Voz-off|Vozes|Vypravěč|Z lektorem|attore|attrice|atuação|dialogo|doppiare|doppiata|doppiato|doppiatore|doppiatrice|dublado|dublar|handelend|labiale|leppe|narrador|narratore|narratrice|recitazione|sincronia labial|voce|voce fuori campo|voci)/g;
        let voMatchValue = review.match(voRegex) || []

        return voMatchValue.length;
    }

    return (
        <div className="wrapper">
            <Form gameStores={gameStores} storeCLick={storeCLick} getReviewsInfo={getReviewsInfo}
                  setSelectedLanguagesMultiselect={setSelectedLanguagesMultiselect}
                  setSearchLocReviews={setSearchLocReviews} setAllTime={setAllTime} setDateRange={setDateRange} />
            <br/>
            <ReviewsInfo gameStores={gameStores} setSteamLanguageClearPercent={setSteamLanguageClearPercent}
                         setSteamLanguageClearPercentOnInput={setSteamLanguageClearPercentOnInput}/>
        </div>
    )
}
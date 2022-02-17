import React from "react";
import Form from "./games_store_parser/Form";
import ReviewsInfo from "./games_store_parser/ReviewsInfo";
import Login from "./auth/Login";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GameStoreParser from "./games_store_parser/GameStoreParser";
import ManagedQualityOnProjectView from "./managed_quality_on_project/view/ManagedQualityOnProjectView";
import ManagedQualityOnProjectCreate from "./managed_quality_on_project/create/ManagedQualityOnProjectCreate";
import ProjectBibleTemplateHeader from "./managed_quality_on_project/project_bible/template_header/ProjectBibleTemplateHeader";
import ProjectBibleTemplateBody from "./managed_quality_on_project/project_bible/template_body/ProjectBibleTemplateBody";
import ProjectBibleTemplateTags from "./managed_quality_on_project/project_bible/template_tags/ProjectBibleTemplateTags";
import ProjectBibleView from "./managed_quality_on_project/project_bible/view/ProjectBibleView";
import logo from "./img/logo1.png";

const styles = {
  companyLogoStyle: {
    paddingLeft: '3rem',
    // margin: '.5rem'
  }
}

function App() {
  let countGooglePlayLanguages = 0;
  let countGooglePlayLanguageCodes = 0;
  let countSteamLanguages = 0;

  const [gameStores, setGameStores] = React.useState([
    {id: 'googlePlay', name: 'Google Play', checked: false, infoReady: false, data: [], reviewsCount: 0,
      languageList: [
        {id: "arabic", name: "Arabic", languageCodes: ['AR']},
        {id: "chineseSimpl", name: "Chinese (Simpl)", languageCodes: ['ZH-CN']},
        {id: "chineseTrad", name: "Chinese (Trad)", languageCodes: ['ZH-TW', 'ZH-HK']},
        {id: "czech", name: "Czech", languageCodes: ['CS']},
        {id: "danish", name: "Danish", languageCodes: ['DA']},
        {id: "dutch", name: "Dutch", languageCodes: ['NL']},
        {id: "english", name: "English", languageCodes: ['EN']},
        {id: "finnish", name: "Finnish", languageCodes: ['FI']},
        {id: "french", name: "French", languageCodes: ['FR']},
        {id: "german", name: "German", languageCodes: ['DE']},
        {id: "greek", name: "Greek", languageCodes: ['EL']},
        {id: "hebrew", name: "Hebrew", languageCodes: ['HE']},
        {id: "hindi", name: "Hindi", languageCodes: ['HI']},
        {id: "icelandic", name: "Icelandic", languageCodes: ['IS']},
        {id: "indonesian", name: "Indonesian", languageCodes: ['ID']},
        {id: "italian", name: "Italian", languageCodes: ['IT']},
        {id: "japanese", name: "Japanese", languageCodes: ['JA']},
        {id: "korean", name: "Korean", languageCodes: ['KO']},
        {id: "malayan", name: "Malayan", languageCodes: ['MS']},
        {id: "norwegian", name: "Norwegian", languageCodes: ['NO']},
        {id: "polish", name: "Polish", languageCodes: ['PL']},
        {id: "portugueseBR", name: "Portuguese (BR)", languageCodes: ['PT-BR']},
        {id: "portuguesePT", name: "Portuguese (PT)", languageCodes: ['PT-PT']},
        {id: "russian", name: "Russian", languageCodes: ['RU']},
        {id: "spanish", name: "Spanish", languageCodes: ['ES']},
        {id: "swedish", name: "Swedish", languageCodes: ['SV']},
        {id: "thai", name: "Thai", languageCodes: ['TH']},
        {id: "turkish", name: "Turkish", languageCodes: ['TR']},
        {id: "vietnamese", name: "Vietnamese", languageCodes: ['VI']},
      ]},
    {id: 'appStore', name: 'App Store', checked: false, infoReady: false, data: [],
      countryList: [
        //Localization country codes
        {id: "arabic", name: "Arabic", countryCodes: ['EG', 'SA', 'AE']},
        {id: "chineseSimpl", name: "Chinese (Simpl)", countryCodes: ['CN', 'SG']},
        {id: "chineseTrad", name: "Chinese (Trad)", countryCodes: ['HK', 'TW']},
        {id: "danish", name: "Danish", countryCodes: ['DK']},
        {id: "dutch", name: "Dutch", countryCodes: ['NL']},
        {id: "english", name: "English", countryCodes: ['US', 'CA', 'AU', 'GB', 'IE', 'NZ']},
        {id: "finnish", name: "Finnish", countryCodes: ['FI']},
        {id: "french", name: "French", countryCodes: ['FR']},
        {id: "german", name: "German", countryCodes: ['DE']},
        {id: "greek", name: "Greek", countryCodes: ['GR']},
        {id: "hebrew", name: "Hebrew", countryCodes: ['IL']},
        {id: "hindi", name: "Hindi", countryCodes: ['IN']},
        {id: "icelandic", name: "Icelandic", countryCodes: ['IS']},
        {id: "indonesian", name: "Indonesian", countryCodes: ['ID']},
        {id: "italian", name: "Italian", countryCodes: ['IT']},
        {id: "japanese", name: "Japanese", countryCodes: ['JP']},
        {id: "korean", name: "Korean", countryCodes: ['KR']},
        {id: "malayan", name: "Malayan", countryCodes: ['MY']},
        {id: "norwegian", name: "Norwegian", countryCodes: ['NO']},
        {id: "polish", name: "Polish", countryCodes: ['PL']},
        {id: "portugueseBRZ", name: "Portuguese (BRZ)", countryCodes: ['BR']},
        {id: "portugueseEUR", name: "Portuguese (EUR)", countryCodes: ['PT']},
        {id: "russian", name: "Russian", countryCodes: ['RU', 'BY'/*, 'KZ', 'KG'*/]},
        {id: "spanish", name: "Spanish", countryCodes: ['ES']},
        {id: "swedish", name: "Swedish", countryCodes: ['SE']},
        {id: "thai", name: "Thai", countryCodes: ['TH']},
        {id: "turkish", name: "Turkish", countryCodes: ['TR']},
        {id: "vietnamese", name: "Vietnamese", countryCodes: ['VN']},
        {id: "czech", name: "Czech", countryCodes: ['CZ']},
      ]},
    {id: 'steam', name: 'Steam', checked: false, infoOnGet: false, infoReady: false, removeEnglish: false,
      languageList: [
        {id: "arabic", webId: "ar", name: "Arabic"},
        {id: "brazilian", webId: "pt-BR", name: "Portuguese-Brazil"},
        {id: "bulgarian", webId: "bg", name: "Bulgarian"},
        {id: "czech", webId: "cs", name: "Czech"},
        {id: "danish", webId: "da", name: "Danish"},
        {id: "dutch", webId: "nl", name: "Dutch"},
        {id: "english", webId: "en", name: "English"},
        {id: "finnish", webId: "fi", name: "Finnish"},
        {id: "french", webId: "fr", name: "French"},
        {id: "german", webId: "de", name: "German"},
        {id: "greek", webId: "el", name: "Greek"},
        {id: "hungarian", webId: "hu", name: "Hungarian"},
        {id: "italian", webId: "it", name: "Italian"},
        {id: "japanese", webId: "ja", name: "Japanese"},
        {id: "koreana", webId: "ko", name: "Korean"},
        {id: "latam", webId: "es-419", name: "Spanish-Latin America"},
        {id: "norwegian", webId: "no", name: "Norwegian"},
        {id: "polish", webId: "pl", name: "Polish"},
        {id: "portuguese", webId: "pt", name: "Portuguese"},
        {id: "romanian", webId: "ro", name: "Romanian"},
        {id: "russian", webId: "ru", name: "Russian"},
        {id: "schinese", webId: "zh-CN", name: "Chinese (Simplified)"},
        {id: "spanish", webId: "es", name: "Spanish-Spain"},
        {id: "swedish", webId: "sv", name: "Swedish"},
        {id: "tchinese", webId: "zh-TW", name: "Chinese (Traditional)"},
        {id: "thai", webId: "th", name: "Thai"},
        {id: "turkish", webId: "tr", name: "Turkish"},
        {id: "ukrainian", webId: "uk", name: "Ukrainian"},
        {id: "vietnamese", webId: "vn", name: "Vietnamese"}
      ],  data: [], languageClearPercent: 0.10, languageClearPercentOnInput: 0.10, appName: "", reviewsCount: 0},
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

  function steamRemoveEnglish() {
    setGameStores(gameStores.map(store => {
      if (store.id === "steam") {
        store.removeEnglish = !store.removeEnglish
      }

      return store
    }))
  }

  function steamAddAppName(name) {
    setGameStores(gameStores.map(store => {
      if (store.id === "steam") {
        store.appName = name;
      }

      return store
    }))
  }

  function getReviewsInfo(e) {
    e.preventDefault();
    let appId = e.target.elements.inputAppId.value;
    // console.log("appId", appId);

    gameStores.map(store => {
      if (store.checked) {
        if (store.id === "googlePlay") {
          countGooglePlayLanguages = 0;
          setInfoReady("googlePlay", false);
          setInfoOnGet("googlePlay", true);

          for (let i = 0; i < store.languageList.length; i++) {
            for (let j = 0; j < store.languageList[i].languageCodes.length; j++) {
              googlePlayRekursivelyGetReviews(null, appId, store.languageList[i].languageCodes[j],
                  store.languageList.length, store.languageList[i].name, store.languageList[i].languageCodes.length);
            }
          }

        } else if (store.id === "appStore") {
          setInfoReady("appStore", false);
          // let appStoreReviews = require('app-store-scraper');

          for (let i = 0; i < store.countryList.length; i++) {
            for (let j = 0; j < store.countryList[i].countryCodes.length; j++) {
              let infoReadyBool = i === (store.countryList.length - 1) &&
                  j === (store.countryList[i].countryCodes.length - 1);

              appStoreRekursivelyGetReviews(appId, store.countryList[i].countryCodes[j],
                  store.countryList[i].name, infoReadyBool);
            }
          }
        } else if (store.id === "steam") {
          let appName = e.target.elements.inputAppName.value;

          countSteamLanguages = 0;

          steamAddAppName(appName);
          setInfoReady("steam", false);
          setInfoOnGet("steam", true);

          steamGetGameName(appId);

          if (store.removeEnglish) {
            for (let i = 0; i < store.languageList.length; i++) {
              if (store.languageList[i].id !== "english") {
                steamRekursivelyGetReviews("*", appId, store.languageList[i].id, store.languageList.length - 1);
              }
            }
          } else {
            for (let i = 0; i < store.languageList.length; i++) {
              steamRekursivelyGetReviews("*", appId, store.languageList[i].id, store.languageList.length);
            }
          }
        }
      }

      return store
    })
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
      setGameStores(gameStores.map(store => {
        if (store.id === "googlePlay") {
          for (let i = 0; i < result.data.length; i++) {
            let dataItem = {
              "language": langName + " (" + lang + ")",
              "score": result.data[i].score
            };

            store.data.push(dataItem);
          }

          store.reviewsCount += result.data.length;
        }

        return store
      }))

      /*console.log(lang, "countGooglePlayLanguages", countGooglePlayLanguages, "langLength", langLength,
          "countGooglePlayLanguageCodes", countGooglePlayLanguageCodes, "langCodesLength", langCodesLength);*/

      if (result.nextPaginationToken) {
        googlePlayRekursivelyGetReviews(result.nextPaginationToken, appId, lang, langLength, langName, langCodesLength);
      } else {
        if (countGooglePlayLanguages === (langLength - 1)) {
          if (countGooglePlayLanguageCodes === (langCodesLength - 1)) {
            setInfoOnGet("googlePlay", false);
            setInfoReady("googlePlay", true);
          } else {
            countGooglePlayLanguageCodes++;
          }
        } else {
          countGooglePlayLanguages++;
        }
      }
    }
  }

  async function appStoreRekursivelyGetReviews(appId, countryCodes, countryName, infoReadyBool) {
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

      if (infoReadyBool) {
        setInfoReady("appStore", true);
      }
    }
  }

  async function steamGetGameName(appId) {
    let getNameResponse = await fetch(
        /*`api/appdetails/?json=1&appids=${appId}`*/`api/appdetails?appids=${appId}`
    );

    if (getNameResponse.ok) {
      // console.log("STEAM game name", getNameResponse, getNameResponse.json());
      /*let json = await getNameResponse.json();
      console.log("STEAM game name", json);*/
    }
  }

  async function steamRekursivelyGetReviews(cursor, appId, lang, langLength) {
    let response = await fetch(
        `/appreviews/${appId}?json=1&filter=recent&purchase_type=all&num_per_page=100&cursor=` + cursor + `&language=${lang}`
    );

    if (response.ok) {
      let json = await response.json();
      console.log("steam", json);

      setGameStores(gameStores.map(store => {
        if (store.id === "steam") {
          for (let i = 0; i < json.reviews.length; i++) {
            let dataItem = {
              "language": getEngSteamId(store.languageList, json.reviews[i].language),
              "voted_up": json.reviews[i].voted_up
            };

            store.data.push(dataItem);
          }

          store.reviewsCount += json.reviews.length;
        }

        return store
      }))

      if (cursor !== encodeURIComponent(json.cursor)) {
        steamRekursivelyGetReviews(encodeURIComponent(json.cursor), appId, lang, langLength);
      } else {
        if (countSteamLanguages === (langLength - 1)) {
          setInfoOnGet("steam", false);
          setInfoReady("steam", true);
        } else {
          countSteamLanguages++;
        }
      }
    } else {
      alert("Ошибка HTTP: " + response.status + " во время получения данных языка " + lang);
    }
  }

  function getEngSteamId(steamArr, id) {
    for (let i = 0; i < steamArr.length; i++) {
      if (steamArr[i].id === id) {
        return steamArr[i].name;
      }
    }
  }

  function authLogIn() {

  }



  return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
          <div className="col-12">
            <div style={styles.companyLogoStyle}>
              <a className="navbar-brand" href="#">
                <img src={logo} alt="logo" width="163" height="33"/>
              </a>
            </div>
          </div>
        </nav>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={/*{<Login authLogIn={authLogIn} />}*/<GameStoreParser
                gameStores={gameStores} storeCLick={storeCLick} getReviewsInfo={getReviewsInfo}
                steamRemoveEnglish={steamRemoveEnglish} setSteamLanguageClearPercent={setSteamLanguageClearPercent}
                setSteamLanguageClearPercentOnInput={setSteamLanguageClearPercentOnInput} />} />
            <Route path="/game_store_parser" element={<GameStoreParser
                gameStores={gameStores} storeCLick={storeCLick} getReviewsInfo={getReviewsInfo}
                steamRemoveEnglish={steamRemoveEnglish} setSteamLanguageClearPercent={setSteamLanguageClearPercent}
                setSteamLanguageClearPercentOnInput={setSteamLanguageClearPercentOnInput} /> } />
            <Route path="/managed_quality_on_project/project_bible/template_header" element={<ProjectBibleTemplateHeader /> } />
            <Route path="/managed_quality_on_project/project_bible/template_body" element={<ProjectBibleTemplateBody /> } />
            <Route path="/managed_quality_on_project/project_bible/template_tags" element={<ProjectBibleTemplateTags /> } />
            <Route path="/managed_quality_on_project/project_bible/view" element={<ProjectBibleView /> } />




            <Route path="/managed_quality_on_project_create" element={<ManagedQualityOnProjectCreate /> } />
            <Route path="/managed_quality_on_project_view" element={<ManagedQualityOnProjectView /> } />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;

import React from "react";
import AppStoreDiagram from "./AppStoreDiagram";
import AppStoreBarDiagram from "./AppStoreBarDiagram";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import GooglePlayDiagram from "./GooglePlayDiagram";
import GooglePlayBarDiagram from "./GooglePlayBarDiagram";
import SteamStoreBarDiagram from "./SteamStoreBarDiagram";
import LocReviewsData from "./LocReviewsData";
import SteamStoreBarLocReviewsDiagram from "./SteamStoreBarLocReviewsDiagram";
import {Tab} from "bootstrap";
import {Tabs} from "react-bootstrap";
import translate from "translate";

const styles = {
    blockCenter: {
        textAlign: 'center'
    },

    blockRight: {
        textAlign: 'right'
    },

    blockView: {
        border: '1px solid #ccc',
        padding: '.5rem 1rem',
        borderRadius: '5px',
        margin: '.5rem'
    },

    columnBlock: {
        width: '33%',
        display: 'inline-block'
    },

    inputPercent: {
        width: '50px',
    },

    inputCheckbox: {
        marginLeft: '0px',
    }
}

export default function ReviewsInfo(props) {
    const [storesAddFilter, setStoresAddFilter] = React.useState([
        {id: 'googlePlay', clearLanguages: true, languageClearPercent: 0.10, switchChartBarToPie: false},
        {id: 'appStore', clearLanguages: true, languageClearPercent: 0.10, switchChartBarToPie: false},
        {id: 'steam', clearLanguages: true, languageClearPercent: 0.10}
    ])

    function clearLanguages(storeId) {
        setStoresAddFilter(storesAddFilter.map(store => {
            if (store.id === storeId) {
                store.clearLanguages = !store.clearLanguages
            }

            return store
        }))
    }

    function setClearLanguagesPercent(storeId, percent) {
        setStoresAddFilter(storesAddFilter.map(store => {
            if (store.id === storeId) {
                store.languageClearPercent = percent
            }

            return store
        }))
    }

    function switchChartBarToPie(storeId) {
        setStoresAddFilter(storesAddFilter.map(store => {
            if (store.id === storeId) {
                store.switchChartBarToPie = !store.switchChartBarToPie
            }

            return store
        }))
    }

    async function getTranslatedReview(review, apiName) {
        try {
            if (apiName === "translation-google-engine") {
                translate.engine = "google";
                translate.key = /*"AIzaSyB90_YclLfeTPrvWygTdcrPNPtiWUCuHvw"*/"";

                let text = await translate(/*review*//*"Hello world"*/"Ciao mondo", {to: "en", from: "it"});

                return text
            } else {
                return "123"
            }
        } catch (err) {
            console.log(err)
        }
    }

    function googleCloudTranslate(review) {
        const key = "AIzaSyB90_YclLfeTPrvWygTdcrPNPtiWUCuHvw"
        const {Translate} = require('@google-cloud/translate').v2
        const translate = new Translate({key: key})
        const target = 'en'
        let text = "Ciao mondo"

        async function translateText() {
            let [translations] = await translate.translate(text, target)
            translations = Array.isArray(translations) ? translations : [translations]
            console.log('Translations:', translations[0])
            /*translations.forEach((translation, i) => {
                console.log(`${text[i]} => (${target}) ${translation}`);
            });*/

            return translations[0]
        }

        return translateText()
    }

    return(
        <div>
            {
                props.gameStores.map(store => {
                  if (store.checked) {
                      if (store.id === "googlePlay") {
                          if (store.infoReady) {
                              let values = new Map();
                              let allReviewsCount = 0;

                              store.data.map(item => {
                                  let value = new Map();

                                  if (!values.has(item.language)) {
                                      let histogram = [0, 0, 0, 0, 0];

                                      if (item.score === 1) {
                                          histogram[0]++;
                                      } else if (item.score === 2) {
                                          histogram[1]++;
                                      } else if (item.score === 3) {
                                          histogram[2]++;
                                      } else if (item.score === 4) {
                                          histogram[3]++;
                                      } else if (item.score === 5) {
                                          histogram[4]++;
                                      }

                                      allReviewsCount++;

                                      value.set("name", item.language);
                                      value.set("histogram", histogram);
                                      value.set("all", 1);

                                      values.set(item.language, value);
                                  } else {
                                      let histogram = values.get(item.language).get("histogram");
                                      let all = values.get(item.language).get("all");

                                      if (item.score === 1) {
                                          histogram[0]++;
                                      } else if (item.score === 2) {
                                          histogram[1]++;
                                      } else if (item.score === 3) {
                                          histogram[2]++;
                                      } else if (item.score === 4) {
                                          histogram[3]++;
                                      } else if (item.score === 5) {
                                          histogram[4]++;
                                      }

                                      all++;
                                      allReviewsCount++;

                                      value.set("name", item.language);
                                      value.set("histogram", histogram);
                                      value.set("all", all);

                                      values.set(item.language, value);
                                  }

                                  return item
                              })

                              let dataArray = [];

                              values.forEach(function (value, key) {
                                  dataArray.push({
                                      name: key,
                                      histogram: value.get("histogram"),
                                      all: value.get("all"),
                                  });
                              })

                              dataArray.sort((a, b) => b.all - a.all);

                              return(
                                  <div key={store.id}>
                                      <div className="row">
                                          <div className="col-sm-8">

                                          </div>
                                          <div className="col-sm-4">
                                              <div className="form-check" style={styles.blockView}>
                                                  <div className="row">
                                                      <div className="col-sm-2 form-check">
                                                          <input type="checkbox" className="form-check-input"
                                                                 id="googlePlayClearLanguages"
                                                                 name="googlePlayClearLanguages"
                                                                 checked={storesAddFilter[0].switchChartBarToPie}
                                                                 onChange={() => switchChartBarToPie("googlePlay")} style={styles.inputCheckbox}/>
                                                      </div>
                                                      <div className="col-sm-10">
                                                          <label className="form-check-label">?????????????????????? ?????????????? ???? ?????? "Pie"</label>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <br />
                                      <div className="row">
                                          <div className="col-sm-12">
                                              {
                                                  storesAddFilter[0].switchChartBarToPie ? (
                                                      dataArray.map(dataItem => {
                                                          return (
                                                              <div key={dataItem.name} style={styles.columnBlock}>
                                                                  <GooglePlayDiagram data={dataItem}/>
                                                              </div>
                                                          )
                                                      })
                                                  ) : (
                                                      <div key={store.id}>
                                                          <GooglePlayBarDiagram clearLanguages={storesAddFilter[0].clearLanguages}
                                                                              languageClearPercent={storesAddFilter[0].languageClearPercent}
                                                                              data={values} allReviewsCount={allReviewsCount}
                                                                              clearLanguagesFunc={clearLanguages}
                                                                              setClearLanguagesPercent={setClearLanguagesPercent}/>
                                                      </div>
                                                  )
                                              }
                                          </div>
                                      </div>
                                      <div className="row">
                                          <div className="col-sm-12">
                                              <LocReviewsData store={store.id} data={store.locReviewsData} />
                                          </div>
                                      </div>
                                  </div>
                              )
                          } else if (store.infoOnGet) {
                              return (
                                  <div key={store.id}>
                                      <div className="row">
                                          <div className="col-sm-4">

                                          </div>
                                          <div className="col-sm-4" style={styles.blockView}>
                                              <div style={styles.blockCenter}>
                                                  ???????????????? {store.reviewsCount} ?????????????? <FontAwesomeIcon icon={faSpinner} spin/>
                                              </div>
                                          </div>
                                          <div className="col-sm-4">

                                          </div>
                                      </div>
                                  </div>
                              )
                          }
                      } else if (store.id === "appStore") {
                          if (store.infoReady && store.data.length) {
                              console.log("DATA", store.data)

                              if (!store.allTime || store.searchLocReviews) {
                                  let newData = new Map()
                                  let newDataArr = []

                                  store.data.map(dataItem => {
                                      if (newData.has(dataItem.id)) {
                                          let histogramValue = newData.get(dataItem.id).histogram
                                          let newHistogramValue = histogramValue[dataItem.score - 1]
                                          let newRatings = newData.get(dataItem.id).ratings

                                          newHistogramValue++
                                          newRatings++

                                          histogramValue[dataItem.score - 1] = newHistogramValue

                                          let mapNewValue = {
                                              id: dataItem.id,
                                              name: dataItem.name,
                                              ratings: newRatings,
                                              histogram: histogramValue
                                          }

                                          newData.delete(dataItem.id)
                                          newData.set(dataItem.id, mapNewValue)
                                      } else {
                                          let histogramValue = [0, 0, 0, 0, 0]

                                          histogramValue[dataItem.score - 1] = 1
                                          newData.set(dataItem.id, {
                                              id: dataItem.id,
                                              name: dataItem.name,
                                              ratings: 1,
                                              histogram: histogramValue
                                          })
                                      }

                                      return dataItem
                                  })

                                  for (let data of newData.values()) {
                                      newDataArr.push({
                                          id: data.id,
                                          name: data.name,
                                          ratings: data.ratings,
                                          histogram: data.histogram
                                      })
                                  }

                                  let values = new Map();
                                  let allReviewsCount = 0;

                                  newDataArr.sort((a, b) => b.ratings - a.ratings);

                                  newDataArr.map(item => {
                                      let value = new Map();

                                      value.set("name", item.name + " (" + item.id + ")");
                                      value.set("histogram", item.histogram);
                                      value.set("all", item.ratings);

                                      allReviewsCount += item.ratings;

                                      values.set(item.name + " (" + item.id + ")", value);

                                      return item
                                  })

                                  if (store.searchLocReviews) {
                                      let locReviewsColorKeys = []
                                      let locRegex = /(??slensku|??bersetzung|??vers??ttning|??????ing|??esky|??ngilizce|????????????|????????????????|??????????????|????????????????????|??????????????????|??????????????|??????????????|????????????|????????????|??????????????|??????????????|??????????????|??????????????|??????????|??????????????|????????|????????????|??????????????????|??????????|????????????|??????????????|????????????????????|??????????????|????????????|??????????|??????|????????????????????????|??????????????????|????????????|??????????????????????????????|??????????????????|??????????????????|????????? ???????????????|????????????|??????????????????|?????????|??????|??????|?????????|??????|?????????|??????|??????|??????|??????|??????|??????|??????|??????|??????|??????|??????|?????????|??????| ??eviri | dil | grammatical | grammatically | taal |Anglick??|Deutsch|Engels|Englisch|Fran??ais|Italiano|Jazyk|Kieli|Lokalisierung|Lokalizacja|Melayu|Nederlands|Portugues|Spr??k|Sprache|Sprog|T??rk|Ti???ng Vi???t|Traduction|angielski|anglais|bahasa|bahasa inggeris|d???ch|dansk|engelsk|engelska|englanti|english|ensku|espa??ol|idioma|indonesia|inggris|ingl??s|ingl??s|inglese|j??zyk|k????nn??s|l??ngua|la langue|language|lingua|localis|localisation|localiz|localiza????o|localizaci??n|localizzazione|lokalisatie|lokalisering|lokalisointi|lokalizace|n???i ?????a ho??|ng??n ng???|norsk|overs??ttelse|oversettelse|p??eklad|penyetempatan|polski|sta??setning|subtitle|suomalainen|svenska|t??umaczenie|terjemahan|ti???ng Anh|tradu????o|traducci??n|traduzione|translat|tungum??l|typo |typos |vertaling|yerelle??tirme)/g;
                                      let voRegex = /(????net|????ni|??ulur|???? l???ng ti???ng|??ang di???n|?????????????????? ??????????????|????????????????|????????????????|???????????????? ??????????|???????????????? ??????????|??????????????????????????????|????????????????????????|??????????|????????|????????????|??????????????|????????????|??????????|?????????? ???? ????????????|????????????|??????????????????????|????????????|???????????????????? ??????????????|?????????????? ????????????|????-??????|??????????|??????????|????????|??????????|??????|??????????|??????????????|????????|????????????|??????|??????????|?????????? ????????|??????????|????????|??????????|????????|??????|??????|??????????|??????????|????????|???????????????|?????????????????????|???????????????????????????|?????????|??????|?????? ???????????? ?????????|???????????????????????????????????????|?????????????????????|??????????????????|????????????|???????????????|?????????????????????|??????????????????????????????|?????????????????????????????????|?????????????????????|???????????????????????????|???????????????|????????????????????????|?????????????????????????????????|??????????????????????????????|???????????????|???????????????|?????????????????????|?????????|??????|???????????????|????????????|??????|??????|???|?????????|?????????|??????|??????|??????|?????????|?????????|??????|??????|?????????|??????|?????????|?????????|??????|??????|????????????|??????|?????????|??????|???|???????????????|?????????|??????|??????| ?????????? | ?????????? | Ret | Ses | Stem | actor | actors |Acteerwerk|Acteur|Actrice|Actriz|Akt??r|Akting|Aktor|Aktorka|Aktorstwo|Aktris|Alih suara|Anlat??c??|Ator|Atriz|Ber??ttare|Ber??ttarr??st|Berlakon|Bibir|Commentaire|Dab|Dabovan??|Di??logo|Di???n vi??n n???|Di???n vi??n nam|Dialih suara|Dialog|Dialogi|Dialogue|Dialoog|Diyalog|Doblado|Doblaje|Dobrado|Dobrar|Doubl??|Doublage|Dubattu|Dubba|Dubbad|Dubbaus|Dubbet tale|Dubbing|Dubbingowa??|Dubbingowany|Dublaj|Dublajl??|Dudak|Eftersynkronisation|Eftersynkroniseret|Erz??hler|Fort??ller|Forteller|Fortellerstemme|G??os|G??osy|Gi???ng n??i|H???i tho???i|Here??ka|Herec|Hlas|Hlasy|Hran??|Huuli|Interpr??tation|Interpreta????o|Interpretaci??n|Kertoja|Koment????|L??bio|L??pp|L???ng ti???ng|Leika|Leikari|Leikkona|Lip|Lippe|Lipsynchronisatie|M??i|N??ytell??|N??yttelij??|N??yttelij??t??r|Nagesynchroniseerd|Narator|Narrateur|Narrator|Nasynchronisatie|Ng?????i t?????ng thu???t|Off-Stimme|Oyunculuk|Pelakon lelaki|Pelakon perempuan|Pengisah|R??dd|R??st|R??ster|Raddir|Selostus|Seslendirme|Sesler|Sincronizaci??n labial|Sk??despelare|Sk??despeleri|Sk??despelerska|Skuespil|Skuespill|Skuespiller|Skuespillerinne|Stemme|Stemmen|Stemmer|Stimme|Stimmen|Suara|Suara latar|Suara-suara|Synchronisation|Synchronisation labiale|Synchronisieren|Synchronisiert|Synchronsprecher|Synchronsprecherin|Talsetja|Talsetning|Talsett|Thuy???t minh|Usta|V??r|Verteller|Vi??r????ur|Voces|Voice-over|Voiceover|Voix|Voz|Voz en off|Voz-off|Vozes|Vyprav????|Z lektorem|attore|attrice|atua????o|dialogo|doppiare|doppiata|doppiato|doppiatore|doppiatrice|dublado|dublar|handelend|labiale|leppe|narrador|narratore|narratrice|recitazione|sincronia labial|voce|voce fuori campo|voci)/g;

                                      store.locReviewsData.map(async value => {
                                          let valueDiagram = new Map()
                                          let type = ""
                                          let foundedKeysLoc = "LOC: "
                                          let foundedKeysVo = "VO: "
                                          let foundedKeys = ""
                                          let reviewColorKeys = value.review
                                          let splitReviewByKeys = []

                                          if (value.loc && value.vo) {
                                              let locKeysArray = [...value.review.matchAll(locRegex)]
                                              let voKeysArray = [...value.review.matchAll(voRegex)]

                                              type = "LOC + VO"

                                              for (let i = 0; i < locKeysArray.length; i++) {
                                                  foundedKeysLoc += locKeysArray[i][0] + "; "
                                              }

                                              for (let i = 0; i < voKeysArray.length; i++) {
                                                  foundedKeysVo += voKeysArray[i][0] + "; "
                                              }

                                              foundedKeys = foundedKeysLoc + " " + foundedKeysVo
                                              // foundedKeys = replace(foundedKeys, Chr(32), Chr(10))
                                          } else if (value.loc) {
                                              let locKeysArray = [...value.review.matchAll(locRegex)]

                                              type = "LOC"

                                              for (let i = 0; i < locKeysArray.length; i++) {
                                                  foundedKeysLoc += locKeysArray[i][0] + "; "
                                              }

                                              foundedKeys = foundedKeysLoc
                                          } else if (value.vo) {
                                              let voKeysArray = [...value.review.matchAll(voRegex)]

                                              type = "VO"

                                              for (let i = 0; i < voKeysArray.length; i++) {
                                                  foundedKeysVo += voKeysArray[i][0] + "; "
                                              }

                                              foundedKeys = foundedKeysVo
                                          }

                                          splitReviewByKeys = reviewColorKeys.split(locRegex)

                                          for (let i = 0; i < splitReviewByKeys.length; i++) {
                                              if ([...splitReviewByKeys[i].matchAll(locRegex)].length) {
                                                  splitReviewByKeys[i] = '<span style="background: yellow;">' + splitReviewByKeys[i] + '</span>'
                                              }
                                          }

                                          reviewColorKeys = splitReviewByKeys.join('');

                                          splitReviewByKeys = reviewColorKeys.split(voRegex)

                                          for (let i = 0; i < splitReviewByKeys.length; i++) {
                                              if ([...splitReviewByKeys[i].matchAll(voRegex)].length) {
                                                  splitReviewByKeys[i] = '<span style="background: orange;">' + splitReviewByKeys[i] + '</span>'
                                              }
                                          }

                                          locReviewsColorKeys.push({
                                              user: value.user,
                                              date: value.date,
                                              review: value.review,
                                              reviewColorKeys: reviewColorKeys,
                                              foundedKeys: foundedKeys,
                                              link: value.link,
                                              rating: value.rating,
                                              language: value.language,
                                              type: type
                                          })

                                          return value
                                      })

                                      return(
                                          <div key={store.id}>
                                              <br />
                                              <Tabs defaultActiveKey="reviewsDiagram">
                                                  <Tab eventKey="reviewsDiagram" title="Reviews Diagram">
                                                      <div className="tab-item-wrapper">
                                                          <br />
                                                          <div className="row">
                                                              <div className="col-sm-8">

                                                              </div>
                                                              <div className="col-sm-4">
                                                                  <div className="form-check" style={styles.blockView}>
                                                                      <div className="row">
                                                                          <div className="col-sm-2 form-check">
                                                                              <input type="checkbox" className="form-check-input"
                                                                                     id="appStoreClearLanguages"
                                                                                     name="appStoreClearLanguages"
                                                                                     checked={storesAddFilter[1].switchChartBarToPie}
                                                                                     onChange={() => switchChartBarToPie("appStore")} style={styles.inputCheckbox}/>
                                                                          </div>
                                                                          <div className="col-sm-10">
                                                                              <label className="form-check-label">?????????????????????? ?????????????? ???? ?????? "Pie"</label>
                                                                          </div>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <br />
                                                          <div className="row">
                                                              <div className="col-sm-12">
                                                                  {
                                                                      storesAddFilter[1].switchChartBarToPie ? (
                                                                          store.data.map(dataItem => {
                                                                              return (
                                                                                  <div key={dataItem.id} style={styles.columnBlock}>
                                                                                      <AppStoreDiagram data={dataItem}/>
                                                                                  </div>
                                                                              )
                                                                          })
                                                                      ) : (
                                                                          <div key={store.id}>
                                                                              <AppStoreBarDiagram clearLanguages={storesAddFilter[1].clearLanguages}
                                                                                                  languageClearPercent={storesAddFilter[1].languageClearPercent}
                                                                                                  data={values} allReviewsCount={allReviewsCount}
                                                                                                  clearLanguagesFunc={clearLanguages}
                                                                                                  setClearLanguagesPercent={setClearLanguagesPercent}/>
                                                                          </div>
                                                                      )
                                                                  }
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </Tab>
                                                  <Tab eventKey="locReviews" title="Loc Reviews">
                                                      <div className="tab-item-wrapper">
                                                          <br />
                                                          <LocReviewsData store={store.id} data={store.locReviewsData}
                                                                          locReviewsColorKeys={locReviewsColorKeys} />
                                                      </div>
                                                  </Tab>
                                              </Tabs>
                                          </div>
                                      )
                                  } else {
                                      return(
                                          <div key={store.id}>
                                              <div className="row">
                                                  <div className="col-sm-8">

                                                  </div>
                                                  <div className="col-sm-4">
                                                      <div className="form-check" style={styles.blockView}>
                                                          <div className="row">
                                                              <div className="col-sm-2 form-check">
                                                                  <input type="checkbox" className="form-check-input"
                                                                         id="appStoreClearLanguages"
                                                                         name="appStoreClearLanguages"
                                                                         checked={storesAddFilter[1].switchChartBarToPie}
                                                                         onChange={() => switchChartBarToPie("appStore")} style={styles.inputCheckbox}/>
                                                              </div>
                                                              <div className="col-sm-10">
                                                                  <label className="form-check-label">?????????????????????? ?????????????? ???? ?????? "Pie"</label>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                              <br />
                                              <div className="row">
                                                  <div className="col-sm-12">
                                                      {
                                                          storesAddFilter[1].switchChartBarToPie ? (
                                                              store.data.map(dataItem => {
                                                                  return (
                                                                      <div key={dataItem.id} style={styles.columnBlock}>
                                                                          <AppStoreDiagram data={dataItem}/>
                                                                      </div>
                                                                  )
                                                              })
                                                          ) : (
                                                              <div key={store.id}>
                                                                  <AppStoreBarDiagram clearLanguages={storesAddFilter[1].clearLanguages}
                                                                                      languageClearPercent={storesAddFilter[1].languageClearPercent}
                                                                                      data={values} allReviewsCount={allReviewsCount}
                                                                                      clearLanguagesFunc={clearLanguages}
                                                                                      setClearLanguagesPercent={setClearLanguagesPercent}/>
                                                              </div>
                                                          )
                                                      }
                                                  </div>
                                              </div>
                                          </div>
                                      )
                                  }
                              } else {
                                  let values = new Map();
                                  let allReviewsCount = 0;

                                  store.data.sort((a, b) => b.ratings - a.ratings);

                                  store.data.map(item => {
                                      let value = new Map();

                                      value.set("name", item.name + " (" + item.id + ")");
                                      value.set("histogram", item.histogram);
                                      value.set("all", item.ratings);

                                      allReviewsCount += item.ratings;

                                      values.set(item.name + " (" + item.id + ")", value);

                                      return item
                                  })

                                  return(
                                      <div key={store.id}>
                                          <div className="row">
                                              <div className="col-sm-8">

                                              </div>
                                              <div className="col-sm-4">
                                                  <div className="form-check" style={styles.blockView}>
                                                      <div className="row">
                                                          <div className="col-sm-2 form-check">
                                                              <input type="checkbox" className="form-check-input"
                                                                     id="appStoreClearLanguages"
                                                                     name="appStoreClearLanguages"
                                                                     checked={storesAddFilter[1].switchChartBarToPie}
                                                                     onChange={() => switchChartBarToPie("appStore")} style={styles.inputCheckbox}/>
                                                          </div>
                                                          <div className="col-sm-10">
                                                              <label className="form-check-label">?????????????????????? ?????????????? ???? ?????? "Pie"</label>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                          <br />
                                          <div className="row">
                                              <div className="col-sm-12">
                                                  {
                                                      storesAddFilter[1].switchChartBarToPie ? (
                                                          store.data.map(dataItem => {
                                                              return (
                                                                  <div key={dataItem.id} style={styles.columnBlock}>
                                                                      <AppStoreDiagram data={dataItem}/>
                                                                  </div>
                                                              )
                                                          })
                                                      ) : (
                                                          <div key={store.id}>
                                                              <AppStoreBarDiagram clearLanguages={storesAddFilter[1].clearLanguages}
                                                                                  languageClearPercent={storesAddFilter[1].languageClearPercent}
                                                                                  data={values} allReviewsCount={allReviewsCount}
                                                                                  clearLanguagesFunc={clearLanguages}
                                                                                  setClearLanguagesPercent={setClearLanguagesPercent}/>
                                                          </div>
                                                      )
                                                  }
                                              </div>
                                          </div>
                                      </div>
                                  )
                              }
                          }
                      } else if (store.id === "steam") {
                          if (store.infoReady) {
                              let values = new Map();
                              let allReviewsCount = 0;

                              store.data.map(item => {
                                  let value = new Map();

                                  if (!values.has(item.language)) {
                                      let positive = 0;
                                      let negative = 0;

                                      if (item.voted_up) {
                                          positive++;
                                      } else {
                                          negative++;
                                      }

                                      allReviewsCount++;

                                      value.set("name", item.language);
                                      value.set("positive", positive);
                                      value.set("negative", negative);
                                      value.set("all", 1);

                                      values.set(item.language, value);
                                  } else {
                                      let positive = values.get(item.language).get("positive");
                                      let negative = values.get(item.language).get("negative");
                                      let all = values.get(item.language).get("all");

                                      if (item.voted_up) {
                                          positive++;
                                      } else {
                                          negative++;
                                      }

                                      all++;
                                      allReviewsCount++;

                                      value.set("name", item.language);
                                      value.set("positive", positive);
                                      value.set("negative", negative);
                                      value.set("all", all);

                                      values.set(item.language, value);
                                  }

                                  return item
                              })

                              if (store.searchLocReviews) {
                                  let locReviewsValues = new Map()
                                  let allLocReviewsCount = 0
                                  let locReviewsColorKeys = []
                                  let locRegex = /(??slensku|??bersetzung|??vers??ttning|??????ing|??esky|??ngilizce|????????????|????????????????|??????????????|????????????????????|??????????????????|??????????????|??????????????|????????????|????????????|??????????????|??????????????|??????????????|??????????????|??????????|??????????????|????????|????????????|??????????????????|??????????|????????????|??????????????|????????????????????|??????????????|????????????|??????????|??????|????????????????????????|??????????????????|????????????|??????????????????????????????|??????????????????|??????????????????|????????? ???????????????|????????????|??????????????????|?????????|??????|??????|?????????|??????|?????????|??????|??????|??????|??????|??????|??????|??????|??????|??????|??????|??????|?????????|??????| ??eviri | dil | grammatical | grammatically | taal |Anglick??|Deutsch|Engels|Englisch|Fran??ais|Italiano|Jazyk|Kieli|Lokalisierung|Lokalizacja|Melayu|Nederlands|Portugues|Spr??k|Sprache|Sprog|T??rk|Ti???ng Vi???t|Traduction|angielski|anglais|bahasa|bahasa inggeris|d???ch|dansk|engelsk|engelska|englanti|english|ensku|espa??ol|idioma|indonesia|inggris|ingl??s|ingl??s|inglese|j??zyk|k????nn??s|l??ngua|la langue|language|lingua|localis|localisation|localiz|localiza????o|localizaci??n|localizzazione|lokalisatie|lokalisering|lokalisointi|lokalizace|n???i ?????a ho??|ng??n ng???|norsk|overs??ttelse|oversettelse|p??eklad|penyetempatan|polski|sta??setning|subtitle|suomalainen|svenska|t??umaczenie|terjemahan|ti???ng Anh|tradu????o|traducci??n|traduzione|translat|tungum??l|typo |typos |vertaling|yerelle??tirme)/g;
                                  let voRegex = /(????net|????ni|??ulur|???? l???ng ti???ng|??ang di???n|?????????????????? ??????????????|????????????????|????????????????|???????????????? ??????????|???????????????? ??????????|??????????????????????????????|????????????????????????|??????????|????????|????????????|??????????????|????????????|??????????|?????????? ???? ????????????|????????????|??????????????????????|????????????|???????????????????? ??????????????|?????????????? ????????????|????-??????|??????????|??????????|????????|??????????|??????|??????????|??????????????|????????|????????????|??????|??????????|?????????? ????????|??????????|????????|??????????|????????|??????|??????|??????????|??????????|????????|???????????????|?????????????????????|???????????????????????????|?????????|??????|?????? ???????????? ?????????|???????????????????????????????????????|?????????????????????|??????????????????|????????????|???????????????|?????????????????????|??????????????????????????????|?????????????????????????????????|?????????????????????|???????????????????????????|???????????????|????????????????????????|?????????????????????????????????|??????????????????????????????|???????????????|???????????????|?????????????????????|?????????|??????|???????????????|????????????|??????|??????|???|?????????|?????????|??????|??????|??????|?????????|?????????|??????|??????|?????????|??????|?????????|?????????|??????|??????|????????????|??????|?????????|??????|???|???????????????|?????????|??????|??????| ?????????? | ?????????? | Ret | Ses | Stem | actor | actors |Acteerwerk|Acteur|Actrice|Actriz|Akt??r|Akting|Aktor|Aktorka|Aktorstwo|Aktris|Alih suara|Anlat??c??|Ator|Atriz|Ber??ttare|Ber??ttarr??st|Berlakon|Bibir|Commentaire|Dab|Dabovan??|Di??logo|Di???n vi??n n???|Di???n vi??n nam|Dialih suara|Dialog|Dialogi|Dialogue|Dialoog|Diyalog|Doblado|Doblaje|Dobrado|Dobrar|Doubl??|Doublage|Dubattu|Dubba|Dubbad|Dubbaus|Dubbet tale|Dubbing|Dubbingowa??|Dubbingowany|Dublaj|Dublajl??|Dudak|Eftersynkronisation|Eftersynkroniseret|Erz??hler|Fort??ller|Forteller|Fortellerstemme|G??os|G??osy|Gi???ng n??i|H???i tho???i|Here??ka|Herec|Hlas|Hlasy|Hran??|Huuli|Interpr??tation|Interpreta????o|Interpretaci??n|Kertoja|Koment????|L??bio|L??pp|L???ng ti???ng|Leika|Leikari|Leikkona|Lip|Lippe|Lipsynchronisatie|M??i|N??ytell??|N??yttelij??|N??yttelij??t??r|Nagesynchroniseerd|Narator|Narrateur|Narrator|Nasynchronisatie|Ng?????i t?????ng thu???t|Off-Stimme|Oyunculuk|Pelakon lelaki|Pelakon perempuan|Pengisah|R??dd|R??st|R??ster|Raddir|Selostus|Seslendirme|Sesler|Sincronizaci??n labial|Sk??despelare|Sk??despeleri|Sk??despelerska|Skuespil|Skuespill|Skuespiller|Skuespillerinne|Stemme|Stemmen|Stemmer|Stimme|Stimmen|Suara|Suara latar|Suara-suara|Synchronisation|Synchronisation labiale|Synchronisieren|Synchronisiert|Synchronsprecher|Synchronsprecherin|Talsetja|Talsetning|Talsett|Thuy???t minh|Usta|V??r|Verteller|Vi??r????ur|Voces|Voice-over|Voiceover|Voix|Voz|Voz en off|Voz-off|Vozes|Vyprav????|Z lektorem|attore|attrice|atua????o|dialogo|doppiare|doppiata|doppiato|doppiatore|doppiatrice|dublado|dublar|handelend|labiale|leppe|narrador|narratore|narratrice|recitazione|sincronia labial|voce|voce fuori campo|voci)/g;

                                  store.locReviewsData.map(async value => {
                                      let valueDiagram = new Map()
                                      let type = ""
                                      let foundedKeysLoc = "LOC: "
                                      let foundedKeysVo = "VO: "
                                      let foundedKeys = ""
                                      let reviewColorKeys = value.review
                                      let splitReviewByKeys = []

                                      if (!locReviewsValues.has(value.language)) {
                                          allLocReviewsCount++

                                          valueDiagram.set("name", value.language)
                                          valueDiagram.set("all", 1)

                                          locReviewsValues.set(value.language, valueDiagram)
                                      } else {
                                          let all = locReviewsValues.get(value.language).get("all")

                                          all++
                                          allLocReviewsCount++

                                          valueDiagram.set("name", value.language)
                                          valueDiagram.set("all", all)

                                          locReviewsValues.set(value.language, valueDiagram)
                                      }

                                      if (value.loc && value.vo) {
                                          let locKeysArray = [...value.review.matchAll(locRegex)]
                                          let voKeysArray = [...value.review.matchAll(voRegex)]

                                          type = "LOC + VO"

                                          for (let i = 0; i < locKeysArray.length; i++) {
                                              foundedKeysLoc += locKeysArray[i][0] + "; "
                                          }

                                          for (let i = 0; i < voKeysArray.length; i++) {
                                              foundedKeysVo += voKeysArray[i][0] + "; "
                                          }

                                          foundedKeys = foundedKeysLoc + " " + foundedKeysVo
                                          // foundedKeys = replace(foundedKeys, Chr(32), Chr(10))
                                      } else if (value.loc) {
                                          let locKeysArray = [...value.review.matchAll(locRegex)]

                                          type = "LOC"

                                          for (let i = 0; i < locKeysArray.length; i++) {
                                              foundedKeysLoc += locKeysArray[i][0] + "; "
                                          }

                                          foundedKeys = foundedKeysLoc
                                      } else if (value.vo) {
                                          let voKeysArray = [...value.review.matchAll(voRegex)]

                                          type = "VO"

                                          for (let i = 0; i < voKeysArray.length; i++) {
                                              foundedKeysVo += voKeysArray[i][0] + "; "
                                          }

                                          foundedKeys = foundedKeysVo
                                      }

                                      splitReviewByKeys = reviewColorKeys.split(locRegex)

                                      for (let i = 0; i < splitReviewByKeys.length; i++) {
                                          if ([...splitReviewByKeys[i].matchAll(locRegex)].length) {
                                              splitReviewByKeys[i] = '<span style="background: yellow;">' + splitReviewByKeys[i] + '</span>'
                                          }
                                      }

                                      reviewColorKeys = splitReviewByKeys.join('');

                                      splitReviewByKeys = reviewColorKeys.split(voRegex)

                                      for (let i = 0; i < splitReviewByKeys.length; i++) {
                                          if ([...splitReviewByKeys[i].matchAll(voRegex)].length) {
                                              splitReviewByKeys[i] = '<span style="background: orange;">' + splitReviewByKeys[i] + '</span>'
                                          }
                                      }

                                      /*reviewColorKeys = splitReviewByKeys.join('');

                                      let reviewTranslationGoogleEngine = ""
                                      let reviewGoogleTranslationApi = ""

                                      getTranslatedReview(value.review, "translation-google-engine")
                                          .then(res => {
                                              reviewTranslationGoogleEngine = res
                                              console.log("reviewTranslationGoogleEngine", res)
                                          })
                                          .catch(alert)
                                          .finally(

                                          )

                                      console.log("googleCloudTranslate", googleCloudTranslate(value.review))*/

                                      locReviewsColorKeys.push({
                                          user: value.user,
                                          date: value.date,
                                          review: value.review,
                                          reviewColorKeys: reviewColorKeys,
                                          /*reviewTranslationGoogleEngine: reviewTranslationGoogleEngine,
                                          reviewGoogleTranslationApi: reviewGoogleTranslationApi,*/
                                          foundedKeys: foundedKeys,
                                          link: value.link,
                                          rating: value.rating,
                                          language: value.language,
                                          type: type
                                      })

                                      return value
                                  })

                                  // console.log("locReviewsColorKeys", locReviewsColorKeys)

                                  return(
                                      <div key={store.id}>
                                          <br />
                                          <Tabs defaultActiveKey="reviewsDiagram">
                                              <Tab eventKey="reviewsDiagram" title="Reviews Diagram">
                                                  <div className="tab-item-wrapper">
                                                      <br />
                                                      <SteamStoreBarDiagram appName={store.appName}
                                                                            clearLanguages={storesAddFilter[2].clearLanguages}
                                                                            languageClearPercent={storesAddFilter[2].languageClearPercent}
                                                                            data={values} allReviewsCount={allReviewsCount}
                                                                            clearLanguagesFunc={clearLanguages}
                                                                            setClearLanguagesPercent={setClearLanguagesPercent} />
                                                  </div>
                                              </Tab>
                                              <Tab eventKey="locReviewsDiagram" title="Loc Reviews Diagram">
                                                  <div className="tab-item-wrapper">
                                                      <br />
                                                      <SteamStoreBarLocReviewsDiagram appName={store.appName}
                                                                                      clearLanguages={storesAddFilter[2].clearLanguages}
                                                                                      languageClearPercent={storesAddFilter[2].languageClearPercent}
                                                                                      data={locReviewsValues}
                                                                                      allReviewsCount={allLocReviewsCount}
                                                                                      clearLanguagesFunc={clearLanguages}
                                                                                      setClearLanguagesPercent={setClearLanguagesPercent} />
                                                  </div>
                                              </Tab>
                                              <Tab eventKey="locReviews" title="Loc Reviews">
                                                  <div className="tab-item-wrapper">
                                                      <br />
                                                      <LocReviewsData store={store.id} data={store.locReviewsData}
                                                                      locReviewsColorKeys={locReviewsColorKeys} />
                                                  </div>
                                              </Tab>
                                          </Tabs>
                                      </div>
                                  )
                              } else {
                                  return(
                                      <div key={store.id}>
                                          <br />
                                          <SteamStoreBarDiagram appName={store.appName}
                                                                clearLanguages={storesAddFilter[2].clearLanguages}
                                                                languageClearPercent={storesAddFilter[2].languageClearPercent}
                                                                data={values} allReviewsCount={allReviewsCount}
                                                                clearLanguagesFunc={clearLanguages}
                                                                setClearLanguagesPercent={setClearLanguagesPercent}/>
                                      </div>
                                  )
                              }
                          } else if (store.infoOnGet) {
                              return (
                                  <div key={store.id}>
                                      <div className="row">
                                          <div className="col-sm-4">

                                          </div>
                                          <div className="col-sm-4" style={styles.blockView}>
                                              <div style={styles.blockCenter}>
                                                  ???????????????? {store.reviewsCount} ?????????????? <FontAwesomeIcon icon={faSpinner} spin/>
                                              </div>
                                          </div>
                                          <div className="col-sm-4">

                                          </div>
                                      </div>
                                  </div>
                              )
                          }
                      }
                  }
                })
            }
        </div>
    )
}
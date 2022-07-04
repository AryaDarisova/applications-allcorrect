import React, {useState} from "react";
import {Button, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileExcel} from "@fortawesome/free-solid-svg-icons";
import XLSX from "xlsx";
import translate from "translate";

export default function LocReviewsData(props) {
    let tableData = []

    function createExcel() {
        console.log("LOC reviews", props.data)

        let wb = XLSX.utils.book_new()
        let ws_data = excelData()
        let ws = XLSX.utils.aoa_to_sheet(ws_data)

        wb.Props = {
            Title: "Loc Reviews",
            Subject: "Loc Reviews",
            Author: "Allcorrect"
        }

        wb.SheetNames.push("Loc_Reviews")
        wb.Sheets["Loc_Reviews"] = ws
        XLSX.writeFile(wb, "loc_reviews.xlsx")
    }

    function excelData() {
        let data = []
        let rowCount = 1

        data.push(["№", "User", "Date", "Review", "Founded keys", "Link", "Rating", "Language", "Type"])

        props.data.map((value, index) => {
            let locRegex = /(Íslensku|Übersetzung|översättning|þýðing|Česky|İngilizce|Γλώσσα|Ελληνικά|αγγλικά|εντοπισμός|μετάφραση|граммат|локализ|опечат|орфогр|перевед|перевел|перевод|пунктуа|русск|субтитр|язык|אנגלית|לוקליזציה|עברית|שָׂפָה|תִרגוּם|الإنجليزية|العربية|الموقع|ترجمة|لغة|अंग्रेजी|अनुवाद|भाषा|स्थानीयकरण|हिन्दी|การแปล|การ จำกัด|ภาษา|อังกฤษ|ไทย|中国|中國|局地化|日本|本土化|翻訳|翻譯|翻译|英語|英语|言語|語言|语言|번역|언어|영어|지방화|한국| çeviri | dil | grammatical | grammatically | taal |Anglický|Deutsch|Engels|Englisch|Français|Italiano|Jazyk|Kieli|Lokalisierung|Lokalizacja|Melayu|Nederlands|Portugues|Språk|Sprache|Sprog|Türk|Tiếng Việt|Traduction|angielski|anglais|bahasa|bahasa inggeris|dịch|dansk|engelsk|engelska|englanti|english|ensku|español|idioma|indonesia|inggris|inglés|inglês|inglese|język|käännös|língua|la langue|language|lingua|localis|localisation|localiz|localização|localización|localizzazione|lokalisatie|lokalisering|lokalisointi|lokalizace|nội địa hoá|ngôn ngữ|norsk|oversættelse|oversettelse|překlad|penyetempatan|polski|staðsetning|subtitle|suomalainen|svenska|tłumaczenie|terjemahan|tiếng Anh|tradução|traducción|traduzione|translat|tungumál|typo |typos |vertaling|yerelleştirme)/g;
            let voRegex = /(Äänet|Ääni|Þulur|Đã lồng tiếng|Đang diễn|Ασύγχρονη αφήγηση|Αφηγητής|Διάλογος|Ηθοποιία φωνής|Ηθοποιός φωνής|Μεταγλωττισμένο|Μεταγλώττιση|Φωνές|Φωνή|Χείλος|актриса|голоса|голос|голос за кадром|диалог|дублировано|дубляж|закадровый перевод|укладка текста|דו-שיח|לדובב|מדובב|משחק|קולות|קול|קריין|קריינות|שחקן|שחקנית|שפה|أصوات|تعليق صوتي|تمثيل|حوار|دبلجة|راوي|شفة|صوت|مدبلج|ممثلة|ممثل|अभिनय|अभिनेता|अभिनेत्री|ओंठ|डब|डब किया हुआ|प्रस्तुतकर्ता|वॉएसओवर|वॉएसेस|वॉएस|संवाद|การแสดง|นักแสดงชาย|นักแสดงหญิง|บทสนทนา|ผู้บรรยาย|พากย์|ริมฝีปาก|เสียงบรรยาย|เสียงพากย์|เสียง|ナレーター|ボイスオーバー|リップ|会話|吹き替え版|吹き替え|声優|声音|声|女配音|对口型|对白|對嘴|對話|已配音|旁白員|旁白|演技|男配音|聲音|解说员|配音員|配音|饰演|내레이터|대화|더빙됨|더빙|립|보이스오버|연기자|연기|음성| актер | актёр | Ret | Ses | Stem | actor | actors |Acteerwerk|Acteur|Actrice|Actriz|Aktör|Akting|Aktor|Aktorka|Aktorstwo|Aktris|Alih suara|Anlatıcı|Ator|Atriz|Berättare|Berättarröst|Berlakon|Bibir|Commentaire|Dab|Dabovaný|Diálogo|Diễn viên nữ|Diễn viên nam|Dialih suara|Dialog|Dialogi|Dialogue|Dialoog|Diyalog|Doblado|Doblaje|Dobrado|Dobrar|Doublé|Doublage|Dubattu|Dubba|Dubbad|Dubbaus|Dubbet tale|Dubbing|Dubbingować|Dubbingowany|Dublaj|Dublajlı|Dudak|Eftersynkronisation|Eftersynkroniseret|Erzähler|Fortæller|Forteller|Fortellerstemme|Głos|Głosy|Giọng nói|Hội thoại|Herečka|Herec|Hlas|Hlasy|Hraní|Huuli|Interprétation|Interpretação|Interpretación|Kertoja|Komentář|Lábio|Läpp|Lồng tiếng|Leika|Leikari|Leikkona|Lip|Lippe|Lipsynchronisatie|Môi|Näytellä|Näyttelijä|Näyttelijätär|Nagesynchroniseerd|Narator|Narrateur|Narrator|Nasynchronisatie|Người tường thuật|Off-Stimme|Oyunculuk|Pelakon lelaki|Pelakon perempuan|Pengisah|Rödd|Röst|Röster|Raddir|Selostus|Seslendirme|Sesler|Sincronización labial|Skådespelare|Skådespeleri|Skådespelerska|Skuespil|Skuespill|Skuespiller|Skuespillerinne|Stemme|Stemmen|Stemmer|Stimme|Stimmen|Suara|Suara latar|Suara-suara|Synchronisation|Synchronisation labiale|Synchronisieren|Synchronisiert|Synchronsprecher|Synchronsprecherin|Talsetja|Talsetning|Talsett|Thuyết minh|Usta|Vör|Verteller|Viðræður|Voces|Voice-over|Voiceover|Voix|Voz|Voz en off|Voz-off|Vozes|Vypravěč|Z lektorem|attore|attrice|atuação|dialogo|doppiare|doppiata|doppiato|doppiatore|doppiatrice|dublado|dublar|handelend|labiale|leppe|narrador|narratore|narratrice|recitazione|sincronia labial|voce|voce fuori campo|voci)/g;
            let type = ""
            let foundedKeysLoc = "LOC: "
            let foundedKeysVo = "VO: "
            let foundedKeys = ""

            if (value.loc && value.vo) {
                let locKeysArray = [...value.review.matchAll(locRegex)]
                let voKeysArray = [...value.review.matchAll(voRegex)]

                console.log("LOC + VO", value.review, locKeysArray, voKeysArray)

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

                console.log("LOC", value.review, locKeysArray)

                type = "LOC"

                for (let i = 0; i < locKeysArray.length; i++) {
                    foundedKeysLoc += locKeysArray[i][0] + "; "
                }

                foundedKeys = foundedKeysLoc
            } else if (value.vo) {
                let voKeysArray = [...value.review.matchAll(voRegex)]

                console.log("VO", value.review, voKeysArray)

                type = "VO"

                for (let i = 0; i < voKeysArray.length; i++) {
                    foundedKeysVo += voKeysArray[i][0] + "; "
                }

                foundedKeys = foundedKeysVo
            }

            data.push([rowCount++, value.user, value.date, value.review, foundedKeys, value.link, value.rating, value.language, type])
        })

        return data
    }

    return(
        <div className="row">
            <div className="col-sm-12 center">
                {
                    props.data.length &&
                    <div>
                        <Button variant="success" onClick={(e) => createExcel()}>
                            Выгрузить excel&nbsp;&nbsp;<FontAwesomeIcon icon={faFileExcel}/>
                        </Button>
                        <br/>
                        <br/>
                        <Table className="table-loc-reviews" responsive bordered>
                            <thead>
                            <tr>
                                <th className="center">№</th>
                                <th className="center">User</th>
                                <th className="center">Date</th>
                                <th className="center">Review</th>
                                <th className="center">Founded keys</th>
                                <th className="center">Link</th>
                                <th className="center">Rating</th>
                                <th className="center">Language</th>
                                <th className="center">Type</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                props.locReviewsColorKeys.map((value, index) => {
                                    return(
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td><a href={value.user} target="_blank" style={{textDecoration: 'none'}}>👾</a></td>
                                            <td>{value.date}</td>
                                            <td dangerouslySetInnerHTML={{__html: value.reviewColorKeys}}></td>
                                            <td>{value.foundedKeys}</td>
                                            <td><a href={value.link} target="_blank" style={{textDecoration: 'none'}}>🎮</a></td>
                                            <td>{value.rating ? "👍" : "👎"}</td>
                                            <td>{value.language}</td>
                                            <td>{value.type}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                    </div>
                }
            </div>
        </div>
    )
}
const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3080;
const projectBibleTemplateRouter = require('./routes/projectBibleTemplate.routes')

let googlePlayReviews = require('google-play-scraper');
let appStoreReviews = require('./app-store-scraper');

/*app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello ' + PORT)
})*/

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../my-app/build')));

app.use('/proxy/project_bible_template', projectBibleTemplateRouter)

app.post('/proxy/mobile_store_proxy/google_play', (req, res) => {
    googlePlayReviews.reviews({
        appId: req.body.appId,
        lang: req.body.lang,
        sort: googlePlayReviews.sort.NEWEST,
        paginate: true,
        nextPaginationToken: req.body.nextPaginationToken
    })
        .then(
            result => {
                res.json(result);
            }
        )
        .catch(
            error => {
                res.json({'error': error})
            }
        );
});

app.post('/proxy/mobile_store_proxy/app_store', (req, res) => {
    appStoreReviews.ratings({
        id: req.body.appId,
        country: req.body.countryCodes
    })
        .then(
            result => {
                res.json(result);
            }
        )
        .catch(
            error => {
                res.json({'error': error})
            }
        );
});

app.listen(PORT, () => {
    console.log(`Server listening on the port::${PORT} (´• ω •) ʕ•ᴥ•ʔ`);
});
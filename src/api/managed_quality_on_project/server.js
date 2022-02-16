const express = require('express')
const projectBibleTemplateRouter = require('../routes/projectBibleTemplate.routes')
const PORT = process.env.PORT || 3060

const app = express()

app.use(express.json())
app.use('/proxy/project_bible_template', projectBibleTemplateRouter)

app.listen(PORT, () => console.log('second server started ʕ•ᴥ•ʔ'))
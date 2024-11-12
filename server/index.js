import express from 'express'

const port = 3001
const app = express()

app.get('/', (req, res) => {
    return res.status(200).json({result: "Succes"});
})

app.listen(port)
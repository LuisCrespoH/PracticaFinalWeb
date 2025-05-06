const express = require("express");
const cors = require("cors")
require('dotenv').config();
const morganBody = require("morgan-body");
const loggerStream = require("./utils/handleLogger")
const swaggerUi = require("swagger-ui-express")
const swaggerSpecs = require("./docs/swagger")

const routers = require('./routes')
const app = express()
const dbConnect = require('./config/mongo')
//Le decimos a la app de express() que use cors para evitar el error Cross-Domain (XD)
app.use(cors())
app.use(express.json())
app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs)
)
app.use('/api', routers)

morganBody(app, {
    noColors: true,
    skip: function(req, res) {
    return res.statusCode < 400
    },
    stream: loggerStream
})

//app.use(express.static("storage"))
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
console.log("Servidor escuchando en el puerto " + port)
dbConnect()
})

module.exports = {app, server}
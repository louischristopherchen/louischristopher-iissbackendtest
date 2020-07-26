require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const route = require('./route');
const PORT = process.env.PORT;
app.use(cors());

app.use(bodyParser.json());
app.use('/v1', route);
app.all('*', (req, res) => {
  res.status(400).send({
    message: "tidak sesuai silahkan check method/endpoint/sample data yg tersedia",
    method: ['post', 'put', 'delete', 'get'],
    endpoint : '/v1/tamu',
    sample_data: { "name": "louiss", "address": "asdf", "phone": "1234", "status": "1" }
  })
})

app.listen(PORT, () => {
  console.log(`server run on ${PORT}`);
});
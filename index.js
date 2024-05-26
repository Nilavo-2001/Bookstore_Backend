const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

app.use(bodyParser.json()); // to parse body in request

app.use('/api', require('./routes'))


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

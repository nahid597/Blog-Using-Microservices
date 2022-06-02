const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let events = [];

app.post('/events', async (req, res) => {
    const event = req.body;

    events.push(event);

   await axios.post('http://localhost:4000/events', event);
   await axios.post('http://localhost:4001/events', event);
   await axios.post('http://localhost:4002/events', event);
   await axios.post('http://localhost:4003/events', event);

    res.send({status: 'OK'});
});

app.get('/events', (req, res) => {
    res.status(200).send(events);
});

app.listen(4005, () => {
    console.log('Event bus running on port 4005');
});
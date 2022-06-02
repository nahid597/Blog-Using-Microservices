const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');


const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {

    if(type === "PostCreated") {
        const {id, title} = data;

        posts[id] = {id, title, comments: []};

    } else if(type === "CommentCreated") {
        const {id, content, postId} = data;

        const post = posts[postId];
        post.comments.push({id, content});
    } else if(type === 'CommentUpdated') {
        const {id, postId, status, content} = data;

        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;
    }
}


app.get('/posts', (req, res) => {
    res.status(200).send(posts);
});

app.post('/events', (req, res) => {

    const {type, data} = req.body;

    handleEvents(type, data);

    res.send({});

});


app.listen(4002, async() => {
    console.log('Server running on port 4002');

    const res =  await axios.get('http://localhost:4005/events');

    for(let event of res.data) {
        console.log('processing event: ', event.type);

        handleEvents(event.type, event.data);
    }
});
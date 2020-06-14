const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
var bodyParser = require('body-parser')
var fileupload = require("express-fileupload");
var fs = require('fs');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(fileupload());

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'tnhkh',
    port: 5432,
  });

client.connect();

app.get('/', (req, res, next) => {
    res.send('An alligator approaches!');
});

app.post('/login', (req, res, next) => {

    getPassword(req.body.username).then(result => {
        console.log(result.rows[0]) 
        if(result.rows[0] == undefined) res.send(false);
        else  res.send({'login': req.body.password == result.rows[0].password, 'userId':  result.rows[0].user_id });   
    })
    .catch(e => console.error(e.stack));
});

app.post('/image', (req, res, next) => {
    console.log(req.files.image);

    fs.writeFile(__dirname + '/images/' + req.files.image.name , req.files.image.data , function(err){
        if (err) throw err
        console.log('File saved.')
    });

    insertImage(req.files.image.name ,req.body.userId)
    .then (result => {
        console.log(result.rows[0].image_id) 
        res.send({data: req.files.image, imageId: result.rows[0].image_id});
    })
    .catch(e => {console.error(e.stack)} )

});

app.get('/images', (req, res, next) => {
    console.log(req);

    getUserImages(req.query.userId).then(result => {
        let tasks = result.rows.map((row)=>  {
          return () => readFromFile(__dirname + '/images/' + row.path, row.image_id);
        });

        const arrayOfPromises = tasks.map(task => task())

        Promise.all(arrayOfPromises).then(result => {
            res.send(result);
            // do more stuff
        });

    })
    .catch(e => console.error(e.stack));
});
6
app.post('/image/delete', (req, res, next) => {
    deleteImage (req.body.imageId).then (result => {
        console.log(result);
        res.send('deleted photo');
    })
    .catch(e => {console.error(e.stack);
                    res.send('error');});
        
});

app.listen(4000, () => console.log('Gator app listening on port 4000!'));


// quries
const getPassword = (username) =>{
    const text = 'select password, user_id from hadshanut.acount where username=$1';
    const values = [username];

    return client
    .query(text, values);
}

const insertImage = (path, userId) => {
    const text = 'INSERT INTO hadshanut.images (path, user_id) VALUES ($1, $2) RETURNING image_id';
    const values = [path, userId];
    return client
    .query(text, values);
}

const getUserImages = (userId) => {
    const text = 'SELECT image_id, path from hadshanut.images WHERE user_id = $1';
    const values = [userId];
    return client
    .query(text, values);
}

const deleteImage = (imageId) => {
    const text = 'DELETE FROM hadshanut.images WHERE image_id = $1;'
    const values = [imageId]; 
    return client
    .query(text, values);
}

function readFromFile(file, imageId) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve({data: data, imageId : imageId }) ;
            }
        });
    });
}







const express = require('express');
const path = require('path');
const {
    hashUrl, 
    writeText, 
    readText, 
    recycleText,
    requestLog,
    loadUrlTime,
    loadStat,
    syncStat,
} = require('./serverLib');

const CLIENTDIR = 'client/build';
const TEXTDIR = 'text';

const app = express();
let urlTime = loadUrlTime();
let urlStat = loadStat();

//static file for react app
app.use(express.static(path.join(__dirname, CLIENTDIR)));
app.use(express.static(path.join(__dirname, TEXTDIR)));
app.use(express.json());
app.use((req, res, next) => {
    let reqTime = Date.now();
    res.on('finish', () => {
        requestLog(req.path, req.method, reqTime);
    });
    next();
});

app.post('/api/submitText', (req, res) => {
    const textUrl = hashUrl(req.body.text);
    writeText(req.body.text, TEXTDIR, textUrl);
    urlTime[textUrl] = Date.now();
    res.json({url: '/' + TEXTDIR + '/' + textUrl});
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, CLIENTDIR, 'index.html'));
});

app.get('/text/:link', (req, res) => {
    const textUrl = req.params.link;
    urlTime[textUrl] = Date.now()
    readText(TEXTDIR, textUrl, res);
    if (urlStat.hasOwnProperty(textUrl)) {
        urlStat[textUrl] ++;
    }
    else {
        urlStat[textUrl] = 1;
    }
    syncStat(urlStat);
});

const interval = setInterval(()=>{
    recycleText(TEXTDIR, urlTime);
    syncTime(urlTime);
}, 30000);

const port = process.env.PORT || 5000;
server = app.listen(port);

process.on('SIGINT', () => {
    console.log('Clear Timer');
    clearInterval(interval);
    server.close();
})



console.log('App is running on port: ' + port);
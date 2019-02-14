const path = require('path');
const fs = require('fs');

exports.hashUrl = function(text) {
    //generate hash per text and current time stamp
    const textHash = text.split("").reduce(
        function(a,b) {a=((a<<5)-a)+b.charCodeAt(0);return a |= '00000000'}, 0
    ).toString();
    const timeHash = (+new Date).toString(36);
    return timeHash + textHash;
};
exports.writeText = function(text, textDir, url) {
    const filePath = path.join(__dirname, textDir, url);
    fs.writeFile(filePath, text, (err, data) => {
        if (err) {
            console.log(err);
        }
    })
};
exports.readText = function(textDir, url, res) {
    const filePath = path.join(__dirname, textDir, url);
    fs.readFile(filePath, (err, buf) => {
        if (err) {
            console.log(err);
            res.send('Failed to load the url: ' + url);
        }
        res.send(buf.toString());
    })
};
exports.recycleText = function(textDir, urlTime) {
    const curTime = Date.now();
    const urlLife = 60*60*24;
    const utEntries = Object.entries(urlTime);
    for (let [url, timeU] of utEntries) {
        if (curTime - timeU > urlLife) {
            delete urlTime[url];
            const filePath = path.join(__dirname, textDir, url);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log('Failed to delete file: ' + filePath);
                }
            })
        }
    }
}
exports.requestLog = function(url, method, reqTime) {
    const logPath = path.join(__dirname, 'log', 'request.log');
    const msg = method + ';' + url + ';' + reqTime + '\n';
    fs.appendFile(logPath, msg, (err, data) => {
        if (err) {
            console.log(err);
        }
    })
}
exports.loadUrlTime = function() {
    const timePath = path.join(__dirname, 'log', 'urlTime');
    if (!fs.existsSync(timePath)) {
        return {};
    }
    else {
        let timeData = fs.readFileSync(timePath);
        return JSON.parse(timeData);
    }
}
exports.loadStat = function() {
    const statPath = path.join(__dirname, 'log', 'stat');
    if (!fs.existsSync(statPath)) {
        return {};
    }
    else {
        let statData = fs.readFileSync(statPath);
        return JSON.parse(statData);
    }
}
exports.syncTime = function(urlTime) {
    const timePath = path.join(__dirname, 'log', 'urlTime');
    const timeData = JSON.stringify(urlTime);
    fs.writeFile(timePath, timeData, (err, data) => {
        if (err) {
            console.log(err);
        }
    })
}
exports.syncStat = function(statObj) {
    const statPath = path.join(__dirname, 'log', 'stat');
    const statData = JSON.stringify(statObj);
    fs.writeFile(statPath, statData, (err, data) => {
        if (err) {
            console.log(err);
        }
    })
}
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const request = require("request");
const urlencode = require(`urlencode`);
var result=-1;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/main.html");
});
app.post('/', (req, res) => {
    const apiKey = `RGAPI-318a5686-8f33-4030-a4ef-3eacacc19a26`;
    const summonerName = req.body.input_name;
    const summonerRegion = req.body.region;
    const summonerNameUrl = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(summonerName)}?api_key=${apiKey}`;
    var summonerLevel = 0;
    request(summonerNameUrl, function (error, response, body) {
        const info_jason = JSON.parse(body);
        summonerLevel = info_jason["summonerLevel"];
        const puuid = info_jason["puuid"];
        matchPuuid(puuid, summonerRegion);
    })


    function matchPuuid(puuid, region) {
        const GameIdUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}`;
        request(GameIdUrl, function (error, response, body) {
            const gameId = JSON.parse(body);
            lastGameTime(gameId[0], region);
        })
    }

    function lastGameTime(id, region) {
        const lastGameTimeUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${apiKey}`;
        request(lastGameTimeUrl, function (error, response, body) {
            const info_game = JSON.parse(body);
            const endTime = info_game["info"]["gameEndTimestamp"];
            nowToLastGame(endTime);
        })
    }

    function nowToLastGame(lastGameTime) {
        const nowTime = new Date().getTime();
        var dateDiff = Math.ceil((nowTime - lastGameTime) / (1000 * 3600 * 24));
        const t = calculateTime(dateDiff);
        if (t <= 0) {
            result=0;
            
        }
        else {
            result=t;
        }
        console.log(result);
        
    }
    function calculateTime(dif) {
        const day = Math.floor(dif / (1000 * 3600 * 24));
        return calculateNeedTime(summonerLevel) - day;
    }
    function calculateNeedTime(level) {
        if (level <= 6) {
            return 180;
        }
        else {
            return level * 30;
        }
    }
})
app.listen(3000, (err) => {
    if (err) return console.log(err);
    console.log("sever activated on port 3000");
})

function Unix_timestamp(t) {
    var date = new Date(t);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth() + 1);
    var day = "0" + date.getDate();
    var hour = "0" + date.getHours();
    var minute = "0" + date.getMinutes();
    var second = "0" + date.getSeconds();
    return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
}


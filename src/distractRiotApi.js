function LevAndPuuid(apiKey, summonerName, summonerRegion) {
    const urlencode = require(`urlencode`);
    const request = require("request");
    const summonerNameUrl = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(summonerName)}?api_key=${apiKey}`;

    try {
        return new Promise(function (resolve, reject) {
            request(summonerNameUrl, function (error, response, body) {
                const info_jason = JSON.parse(body);
                var summonerLevel = info_jason["summonerLevel"];
                var summonerPuuid = info_jason["puuid"];
                resolve({ level: summonerLevel, puuid: summonerPuuid });

            })
        })
    }
    catch (err) {
        console.log(err);
    }

}

function GetGameId(apiKey, puuid, region) {
    const request = require("request");
    const GameIdUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}`;
    try {
        return new Promise(function (resolve, reject) {
            request(GameIdUrl, function (error, response, body) {
                const info_GameId = JSON.parse(body)
                const lastGameId = info_GameId[0];
                resolve(lastGameId);

            }
            )
        }
        )
    }
    catch (err) {
        console.log(err);
    }
}

function lastGameTime(apiKey, id, region) {
    const lastGameTimeUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${apiKey}`;
    const request = require("request");
    try {
        return new Promise(function (resolve, reject) {
            request(lastGameTimeUrl, function (error, response, body) {
                const info_game = JSON.parse(body);
                const endTime = info_game["info"]["gameEndTimestamp"];
                resolve(endTime);
            })
        })
    }
    catch (err) {
        console.log(err);
    }
}


exports.LevAndPuuid = LevAndPuuid;
exports.GetGameId = GetGameId;
exports.lastGameTime = lastGameTime;

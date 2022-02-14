function Unix_timestamp(t){
    var date = new Date(t);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth()+1);
    var day = "0" + date.getDate();
    var hour = "0" + date.getHours();
    var minute = "0" + date.getMinutes();
    var second = "0" + date.getSeconds();
    return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
}
const request=require("request");
const urlencode=require(`urlencode`);

const apiKey=`RGAPI-318a5686-8f33-4030-a4ef-3eacacc19a26`;
const summonerName=`비내리는 유성`;
const summonerRegion='asia';
const summonerNameUrl=`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(summonerName)}?api_key=${apiKey}`;
let summonerLevel=0;
let leftTime=-1;
request(summonerNameUrl,function(error,response,body){
    const info_jason=JSON.parse(body);
    console.log(info_jason)
    summonerLevel=info_jason["summonerLevel"];
    puuid=info_jason["puuid"];
    matchPuuid(puuid,summonerRegion);
})

function matchPuuid(puuid,region){
    const GameIdUrl=`https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}`;
    request(GameIdUrl,function(error,response,body){
        const gameId=JSON.parse(body);
        lastGameTime(gameId[0],region);
    })
}

function lastGameTime(id,region){
    const lastGameTimeUrl=`https://${region}.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${apiKey}`;
    request(lastGameTimeUrl,function(error,response,body){
        const info_game=JSON.parse(body);
        const endTime=info_game["info"]["gameEndTimestamp"];
        nowToLastGame(endTime);
    })
}

function nowToLastGame(lastGameTime){
    const nowTime=new Date().getTime();
    const differ=nowTime-lastGameTime;
    var dateDiff = Math.ceil((nowTime-lastGameTime)/(1000*3600*24));
    const t=calculateTime(dateDiff);
    if(t<=0){
        leftTime=0;
    }
    else{
        leftTime=t;
    }
}

function calculateTime(dif){
    const day=Math.floor(dif/(1000*3600*24));
    return calculateNeedTime(summonerLevel)-day;
}

function calculateNeedTime(level){
    if(level<=6){
        return 180;
    }
    else{
        return level*30;
    }
}
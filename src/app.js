const express = require("express");
const app = express();
const bodyParser = require('body-parser');


const apiKey=`RGAPI-2ced1559-edd9-49b5-b19f-fb908a43765f`;
app.set(`views`,`./view`); //express에 템플릿엔진을 여기다 두겠다는 설정
app.set(`view engine`,`jade`);
app.locals.pretty=true; //jade파일 소스를 볼 때 줄바꿈해서 보이게해줌
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000, (err) => {
    if (err) return console.log(err);
    console.log("sever activated on port 3000");
})
app.get('/main',(req,res) => {
    res.render('main');
})

app.post('/result',(req,res) => {
    const summonerName = req.body.summonerName;
    const summonerRegion = req.body.region;
    const distract = require('./distractRiotApi');
    const timeCalculator = require(`./TimeCalculator`);
    const info = async () => {
        const info_LevAndPuuid = await distract.LevAndPuuid(apiKey,summonerName,summonerRegion);
        const info_gameId = await distract.GetGameId(apiKey,info_LevAndPuuid["puuid"],summonerRegion);
        const info_lastGameTime = await distract.lastGameTime(apiKey,info_gameId,summonerRegion);
        const info_calculateNeedTime = await timeCalculator.calculateNeedTime(info_lastGameTime,info_LevAndPuuid["level"]);
        return info_calculateNeedTime;
    }
    info().then((needTime) => {
        res.render('result',{time:needTime});
    });
    
    

})
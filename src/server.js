var express = require('express');
var app=express();
var bodyParser = require('body-parser');
app.listen(3000,() => {
    console.log('connected with port 3000!');
})
app.use(bodyParser.urlencoded({extended:false}));
app.set('views','./view'); //템플릿 엔진 경로 설정
app.set('view engine','jade'); //템플릿 엔진을 jade로 설정
app.locals.pretty=true //jade파일 소스를 볼 때 줄바꿈되어 이쁘게 보이게해줌
app.get('/',(req,res) => {
    res.render('main');
})

app.post('/result',(req,res) => {
    const name=req.body.summonerName;
    const region=req.body.region;
    res.render('result',{name:name, region:region});

})
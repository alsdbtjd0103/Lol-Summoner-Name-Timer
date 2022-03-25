var express = require(`express`);
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
app.use(bodyParser.urlencoded({extended:false}));
app.listen(3000,function(){
    console.log(`connected with port 3000!`);
})
app.get('/topic/new',(req,res) => {
    res.render('new');
})
app.set(`views`,`./views_file`); //express에 템플릿엔진을 여기다 두겠다는 설정
app.set(`view engine`,`jade`);
app.locals.pretty=true; //jade파일 소스를 볼 때 줄바꿈해서 보이게해줌
app.post('/topic',function(req,res){
    const title=req.body.title;
    const description=req.body.description;
    fs.writeFile('data/'+title,description,function(err){
        if (err){
            return res.status(500).send('Internal sever Error')
            //500은 서버에러라는 뜻
        }
        res.send("Sucess!");
    })//writeFile('file이름 및 경로','내용',callback함수)
})
app.get(`/topic`,function(req,res){
    fs.readdir(`data`,function(err,files){
        if (err){
            console.log(err)
            return res.status(500).send('Internal server error');

        }
        res.render('view',{topics:files});
    })//data 디렉토리 읽어오기 err와 file array
    
})
app.get(`/topic/:id`,function(req,res){//뒤에 :id는 id 파라미터를 통해 접근할 수 있음
    var id = req.params.id;//id값을 가져오는 방법
    fs.readdir(`data`,function(err,files){
        if (err){
            console.log(err)
            return res.status(500).send('Internal server error');

        }
    //data 디렉토리 읽어오기 err와 file array

    fs.readFile(`data/`+id,'utf8',function(err,data){
        if (err){
            console.log(err)
            return res.status(500).send('Internal server error');

        }
        res.render('view',{topics:files, title:id, description:data});
    })
})
})

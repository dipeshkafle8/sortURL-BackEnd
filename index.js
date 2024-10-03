const express=require("express");
const{connectToMongoDb}=require('./connect');
const path=require('path');
const URL=require("./model/url");
const app=express();
const urlRoute=require("./routes/url");
const staticRoute=require('./routes/staticRouter')
const PORT=8001;

connectToMongoDb("mongodb://127.0.0.1:27017/short-url")
.then(()=>{
    console.log("MongoDb Connected");
})
app.set("view engine","ejs");
app.set('views',path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/url",urlRoute);
app.use('/',staticRoute);

app.get('/test',async(req,res)=>{
    const allUrls=await URL.find({});
    return res.render("home",{
        urls:allUrls,
    });
})

app.get("/data/:shortId",async(req,res)=>{
    const shortId=req.params.shortId;
   const entry=await URL.findOneAndUpdate({
        shortId
    },{
        $push:{
            visitHistory:{
               timestamp:Date.now()
            }
        }
    })
    console.log(entry);
    res.redirect(entry.redirectURL);
})

app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
})
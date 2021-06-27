const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

const app=express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/WikiDB",{useUnifiedTopology: true ,useNewUrlParser: true});

const articleSchema=new mongoose.Schema({
  title:String,
  content:String
});

const Article=new mongoose.model("Article",articleSchema);

///////////for all articles route//////////
app.route('/articles')
  .get(function (req, res) {
    Article.find({},function(err,foundArticles){
      if(!err){
        if(foundArticles){
          console.log(foundArticles);
        }

      }
      else{
        res.redirect("/");
      }
    })
  })
  .post(function (req, res) {
    const newArticle=new Article({
      title:req.body.title,
      content:req.body.content
    });

    newArticle.save(function(err){
      if(err){
        console.log(err)
      }else{
        res.send("Succesfully added");
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({},function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("succesfully deleted all articles")
      }
    })
  })

///////for specific Article route/////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
const title=req.params.articleTitle;
Article.findOne({},function(err,foundArticle){
  if(!err){
    if(foundArticle){
    res.send(foundArticle.content);

    }else{
    res.send("Article not found");
    }
  }
  else{
    console.log("Error in locating article")
  }
})
})
.put(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err,results){
    if(!err){
      if(results._id!=""){
        res.send("Successfully updated")
      }
    }
  })
})
.patch(function(req,res){
  Article.update({title:req.params.articleTitle},
  {$set:req.body},
function(err){
  if(!err){
    res.send("Successfully updated");
  }

}
)
})
.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(!err){
      res.send("succesfully deleted the article");
    }
  })
});

app.listen(3000,function(){
  console.log("Server Running");
})

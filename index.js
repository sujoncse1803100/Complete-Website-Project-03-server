const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT;
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("server connected");
  res.send("server connected");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ifk56.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect(err=>{

    const collection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
    app.post('/membership',(req,res)=>{
        const userData = req.body;

        collection.insertOne(userData)
            .then(result=>{
                if(result){
                    res.send(result.acknowledged);
                }
            })

    })


    app.get('/customer',(req,res)=>{
        collection.find({})
        .toArray((err,documents)=>{
            if(documents.length){
                res.send(documents);
            }
        })
    })


})

app.listen(PORT || port, () => console.log("Listening on port ", port));

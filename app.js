const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/crud';
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
const ObjectID = require('mongodb').ObjectID;

var db;
const dbName = 'crud';

//For mongo version 3 you need to write like this 
mongo.connect(url, (err, client)=>{
	console.log('Connection Done');
	if(err) throw err;
	db = client.db(dbName);		// Pass collection name
	
	app.listen(3000,()=>{
		console.log('Server listening..');
	});
});


app.get('/', (req, res) => {
  db.collection('entry').find().toArray((err, result) => {
    if (err) 
    	return console.log(err)
    res.render('index', {quotes: result});
  })
})


app.post('/addItem',(req,res)=>{
	 db.collection('entry').save(req.body, (err, result) => {
	    if (err) return console.log(err);
	    console.log('saved to database');
	    res.redirect('/')
	  })
});

app.delete('/delete/:id',(req,res)=>{
	 const query = {_id:ObjectID(req.params.id)};
	 db.collection('entry').deleteOne(query, (err,result) => {
	 	if(err){
	 		if (err) return res.send(500, err)
	 	}
	 	res.send('deleted');
	 });
});

app.post('/update', (req, res) => {

	 //console.log(req.body.id,req.body.name,req.body.email)
  	 const query = {_id:ObjectID(req.body.id)}
  	 const newData = {
  	 	name : req.body.name,
  	 	email : req.body.email
  	 }
  	db.collection('entry')
	  .updateOne(query, { $set: newData}, (err, result) => {
	    if (err) return res.send(err)
	    res.redirect('/')
	})
});

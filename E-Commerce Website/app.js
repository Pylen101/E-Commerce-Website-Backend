
var express = require('express');
var path = require('path');
var fs = require('fs');
const { redirect } = require('express/lib/response');
var items = (JSON.parse(fs.readFileSync('items.json')));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


var session = require('express-session');
const cookieParser = require("cookie-parser");
const req = require('express/lib/request');


app.use(session({
  secret: "aykalam",
  saveUninitialized:true,
  resave: false
}));






if (process.env.PORT)
{
  app.listen(process.env.PORT,function(){console.log('Server started')});
}
else{
  app.listen(5000,function(){console.log('Sever started on port 3000')});
}

//app.listen(5000);





app.get('/', function (req, res) {
  res.render('login', { error: "" })
});

app.post('/', function (req, res) {
  var x = req.body.username;
  var y = req.body.password;



  

  login(req,x, y)
    .then(() => {
      if (req.session.success == 0)

        res.render('login', { error: "Invalid Username or password" })


      else {
        
        req.session.userid=x;
        res.redirect('home');

      }
    })
    .catch(console.error);





});


async function viewcart(req){
  var { MongoClient } = require('mongodb');
  var url = "mongodb+srv://admin:admin123@cluster0.uny2s.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });



  await client.connect();
 
 
   var query={username: req.session.userid};
 
   var output=JSON.stringify(await client.db('firstdb').collection('Credentials').find(query).toArray()); 
   var xx=JSON.parse(output);
    //console.log(xx[0].cart);


    client.close();


    return xx[0].cart;
 
 
    
 
 }
 


async function login(req,x, y) {
  var { MongoClient } = require('mongodb');
  var url = "mongodb+srv://admin:admin123@cluster0.uny2s.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });



  await client.connect();



  var query = { username: x, password: y };
  var output = await client.db('firstdb').collection('Credentials').find(query).toArray();
  //console.log(output);


  //check if user is present

  if (output.length == 0) {
    req.session.success = 0;

  }
  else {
    req.session.success = 1;
  }



  client.close();









}




app.post('/tennis', function (req, res) {
  add(req,"tennis").then(x => {
    var temp = x;

    if (temp == "Not Available") {
      res.render('tennis', { message: "Item Added Successfully" })
    }
    else
      res.render('tennis', { message: "Item Already Added" })

  });
});
app.post('/boxing', function (req, res) {
  add(req,"boxing").then(x => {
    var temp = x;

    if (temp == "Not Available") {
      res.render('boxing', { message: "Item Added Successfully" })
    }
    else
      res.render('boxing', { message: "Item Already Added" })

  });
});
app.post('/galaxy', function (req, res) {
  add(req,"galaxy").then(x => {
    var temp = x;

    if (temp == "Not Available") {
      res.render('galaxy', { message: "Item Added Successfully" })
    }
    else
      res.render('galaxy', { message: "Item Already Added" })

  });
});
app.post('/iphone', function (req, res) {
  add(req,"iphone").then(x => {
    var temp = x;

    if (temp == "Not Available") {
      res.render('iphone', { message: "Item Added Successfully" })
    }
    else
      res.render('iphone', { message: "Item Already Added" })

  });
});
app.post('/sun', function (req, res) {
  add(req,"sun").then(x => {
    var temp = x;

    if (temp == "Not Available") {
      res.render('sun', { message: "Item Added Successfully" })
    }
    else
      res.render('sun', { message: "Item Already Added" })

  });
});
app.post('/leaves', function (req, res) {
  add(req,"leaves").then(x => {
    var temp = x;

    if (temp == "Not Available") {
      res.render('leaves', { message: "Item Added Successfully" })
    }
    else
      res.render('leaves', { message: "Item Already Added" })

  });
});


app.post('/register', function (req, res) {
  var user = req.body.username;
  var pass = req.body.password;
  if (user.length == 0 || pass.length == 0) {
    res.render('registration', { message: "Please Enter UserName and Password" })
  }
  else {
    register(user, pass).then(x => {
      var temp = x;
      if (temp == "Not Available") {
        res.redirect('/');


      }
      else
        res.render('registration', { message: "UserName Already used" })

    });
  }

});


async function register(x, y) {
  var { MongoClient } = require('mongodb');
  var url = "mongodb+srv://admin:admin123@cluster0.uny2s.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });



  await client.connect();
  var query = { username: x };
  var output = await client.db('firstdb').collection('Credentials').find(query).toArray();
 // console.log(output);
  if (output.length != 0) {
    client.close();
    return "Available";
  }
  else {
    var user = { username: x, password: y, "cart": [] };
    await client.db('firstdb').collection('Credentials').insertOne(user);
    client.close();
    return "Not Available";



  }


}












async function add(req,x) {
  var { MongoClient } = require('mongodb');
  var url = "mongodb+srv://admin:admin123@cluster0.uny2s.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });



  await client.connect();

  var query = { username: req.session.userid };

  var output = JSON.stringify(await client.db('firstdb').collection('Credentials').find(query).toArray());
  var xx = JSON.parse(output)
  if (!xx[0].cart.includes(x)) {
    xx[0].cart.push(x);
    await client.db('firstdb').collection('Credentials').updateOne({ username: xx[0].username }, { $set: { "cart": xx[0].cart } });

    client.close();
    return "Not Available";
  }
  else {
    client.close();
    return "Available";
  }


}


app.get('/home', function (req, res) {

  console.log(req.session.success);
  var flag=false;
  if (req.session.success==null)
  {
    flag=true;
    res.redirect('/');
  }
  else 
    res.render('home');

    console.log(flag);
  



});
app.get('/registration', function (req, res) {
  res.render('registration', { message: "" });
});
app.get('/phones', function (req, res) {

  if (req.session.success != null) {
    res.render('phones', { message: "" });
  }
  else {
    res.redirect('/')
  }

});
app.get('/books', function (req, res) {

  if (req.session.success !=null) {
    res.render('books', { message: "" });
  }
  else {
    res.redirect('/')
  }

});
app.get('/sports', function (req, res) {
  if (req.session.success != null) {
    res.render('sports', { message: "" });
  }
  else {
    res.redirect('/')
  }


});
app.get('/galaxy', function (req, res) {

  if (req.session.success != null) {
    res.render('galaxy', { message: "" });
  }
  else {
    res.redirect('/')
  }

});
app.get('/iphone', function (req, res) {
  if (req.session.success != null) {
    res.render('iphone', { message: "" });
  }
  else {
    res.redirect('/')
  }

});
app.get('/leaves', function (req, res) {



  if (req.session.success==null)
  {
    res.redirect('/')
  }
  else res.render('leaves', { message: "" });

  // if (req.session.success != 0) {
  //   res.render('leaves', { message: "" });
  // }
  // else {
  //   res.redirect('/')
  // }

});
app.get('/sun', function (req, res) {
  if (req.session.success != null) {
    res.render('sun', { message: "" });
  }
  else {
    res.redirect('/')
  }


});
app.get('/tennis', function (req, res) {
  if (req.session.success != null) {
    res.render('tennis', { message: "" });
  }
  else {
    res.redirect('/')
  }

});
app.get('/boxing', function (req, res) {

  if (req.session.success != null) {
    res.render('boxing', { message: "" });
  }
  else {
    res.redirect('/')
  }

});
app.get('/cart', function (req, res) {
  if (req.session.success != null) {
    var flag=true;
    viewcart(req).then(y => { 
      var a =[];
   
       y.forEach((x, i) => {if (x=="tennis") a.push("tennis");
       else if (x=="boxing") a.push("boxing");
       else if (x=="galaxy") a.push("galaxy");
       else if (x=="iphone") a.push("iphone");
       else if (x=="sun") a.push("sun");
       else if (x=="leaves") a.push("leaves");
     });

     if (a.length==0)
       flag=false;

        // console.log(a);
        if (flag)
          res.render('cart',{msg:"",list:a});
        else
        res.render('cart',{msg:"Cart is empty",list:a});
       });
  }
  else {
    res.redirect('/');
  }

});

app.post('/search', function (req, res) {
  var key = (req.body.Search).toLowerCase();
  var searchedItems = [];
  var flag = false;
  //console.log(items);
  //finding if the input key is a substring of any element in the array
  for (i = 0; i < items.length; i++) {
    var curItem = items[i];
    // if it is a substring, add the list element to the searchedItems
    if (curItem.name.toLowerCase().includes(key)) {
      //console.log(items[i].name);
      searchedItems.push(curItem);
      flag = true;
    }
  }
  // We render 2 messages, one empty if items are found and another incase items are not found
  if (flag) {
    res.render('searchresults', { itemlist: searchedItems, msg: "" });
  } else {
    res.render('searchresults', { itemlist: [], msg: "Not found" });
  }


});







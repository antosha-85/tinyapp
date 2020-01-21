const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
   let result           = '';
   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength = characters.length;
   for ( let i = 0; i < 6; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

app.get("/hello", (req, res) => {
res.send("<html><body>Hello <b>World1</b></body></html>\n");
});


app.get("/set", (req, res) => {
    const a = 1;
    res.send(`a = ${a}`);
});
   
app.get("/fetch", (req, res) => {
    res.send(`a = ${a}`);
});

// routes

app.get ('/urls', (req, res) => {
    let templatelets = { urls: urlDatabase };
    res.render("urls_index", templatelets);
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
    let templatelets = 
    { 
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL]
    };
    res.render('urls_show', templatelets)
    
  })  
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
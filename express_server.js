const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require('cookie-parser');

const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",

};

function generateRandomString(length) {
   let result           = '';
   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL// Log the POST request body to the console
  res.redirect(`/u/${shortURL}`)
  // console.log(req.body.longURL);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  
  delete urlDatabase[req.params.shortURL];
  // console.log(urlDatabase)
  res.redirect('/urls')
});

app.get('/urls/:shortURL/edit', (req, res) => {
  let templateVars = {
    username: req.cookies["username"], 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]
  };
  console.log("TCL: req.cookies", req.cookies)
  
  res.render("urls_show", templateVars);
});

app.post('/urls/:shortURL/edit', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect("/urls");
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});


app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL])
});

console.log(urlDatabase)
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
    let templateVars = { 
      username: req.cookies["username"],
      urls/*using name of variable in ejs file */: urlDatabase/*using variable 
    form here */ };
    res.render("urls_index", templateVars);
})

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
    let templateVars = 
    { username: req.cookies["username"],
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL]
    };
    res.render('urls_show', templateVars)
    
  })  

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
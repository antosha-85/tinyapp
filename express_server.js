const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require('cookie-parser');

const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

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
});

app.get ('/urls', (req, res) => {
  if (req.cookies.user) {
    let templateVars = { 
      user: users[req.cookies.user],
      urls: urlDatabase
    }
    res.render("urls_index", templateVars);
    } else {
      res.send('Please login or register first!')
    }  
});


app.get("/urls/new", (req, res) => {
  if (req.cookies.user) {
    let templateVars = { 
      user: users[req.cookies.user]
    }
    res.render("urls_new", templateVars);
    } else {
      res.redirect('/login')
    }  
});

app.post('/urls/:shortURL/delete', (req, res) => {
  
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
});

app.get('/urls/:shortURL/edit', (req, res) => {
  let templateVars = {
    user: users[req.cookies.user],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]['longURL']
  };
  
  res.render("urls_show", templateVars);
});

app.post('/urls/:shortURL/edit', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

// login routes

app.get('/login', (req, res) => {
  let templateVars = {
    user: users[req.cookies.user],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('login', templateVars)
});

app.post('/login', (req, res) => {
  for (const user in users) {
    if (req.body.email === users[user].email && req.body.password === users[user].password) {
      res.cookie('user', user)
      res.redirect('/urls')
      return
    }
  }
  res.status(400).send('The user doesn\'t exist, please go to the register page or the password is not correct!')
});

app.post('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect("/urls");
});

//register routes

app.get('/register', (req, res) => {
  let templateVars = {
    user: users[req.cookies.user],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('register', templateVars)
});

app.post('/register', (req, res) => {
  if(req.body.password === '' || req.body.email === '') {
    res.status(400).send('Email and Password are required!')
  } 
  //looping to check existing user
  for (const user in users) {
    //if user exists we send the error message
    if(req.body.email === users[user].email) {
      res.status(400).send('You already have an account here, login instead?')
    }
  }
  const newID = generateRandomString(6);
  const userID = {};
  userID.id = newID;
  users[newID] = userID;
  userID.password = req.body.password;
  userID.email = req.body.email;
  res.cookie('user', newID);
  res.redirect('/urls')
});
//delimiter

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL])
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




app.get("/urls/:shortURL", (req, res) => {
    let templateVars = 
    { user: users[req.cookies.user],
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL]
    };
    res.render('urls_show', templateVars)
    
  })  

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
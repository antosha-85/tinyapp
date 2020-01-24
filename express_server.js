const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require('cookie-parser');
const { generateRandomString, getloggedUserID } = require('./helperFunc/helperFunc');



const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL]['longURL'] = req.body.longURL;
  urlDatabase[shortURL]['userID'] = req.cookies.user;
  res.redirect(`/urls`)
});
//start from here maybe loop first?



app.get('/urls', (req, res) => {
  //creating variable with user ID
  const user = users[req.cookies.user];
  // checking if userID exists i.e. if the user is logged in
  if (user && user.id) {
    const userId = user.id
    loggedUserID = getloggedUserID(urlDatabase, userId);
    let templateVars = {
      user: users[req.cookies.user],
      urls: loggedUserID
    }
    res.render("urls_index", templateVars);
    return //WHY IS IT HERE?!
  }
  res.redirect('/login')
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
  res.redirect("/login");
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
  if (req.body.password === '' || req.body.email === '') {
    res.status(400).send('Email and Password are required!')
  }
  //looping to check existing user
  for (const user in users) {
    //if user exists we send the error message
    if (req.body.email === users[user].email) {
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

app.get("/urls/:shortURL", (req, res) => {
  let templateVars =
  {
    user: users[req.cookies.user],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars)

})

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
  console.log("TCL: urlDatabase", urlDatabase)
  console.log("TCL: req.body", req.body)
  console.log("TCL: req.cookies.user", req.cookies.user)
  urlDatabase[req.params.shortURL]['longURL'] = req.body.longURL
  
  
  // urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

//delimiter

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]['longURL'])
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

// app.get("/urls.json", (req, res) => {
//     res.json(urlDatabase);
//   });

// app.get("/hello", (req, res) => {
// res.send("<html><body>Hello <b>World1</b></body></html>\n");
// });


// app.get("/set", (req, res) => {
//     const a = 1;
//     res.send(`a = ${a}`);
// });

// app.get("/fetch", (req, res) => {
//     res.send(`a = ${a}`);
// });

// routes
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
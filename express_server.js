const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require('cookie-parser');
const { generateRandomString, getloggedUserID } = require('./helperFunc/helperFunc');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');




const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session_new',
  keys: ['kkk'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

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
  urlDatabase[shortURL]['userID'] = req.session.user_id;
  res.redirect(`/urls`)
});
//start from here maybe loop first?



app.get('/urls', (req, res) => {
  //creating variable with user ID
  const user = users[req.session.user_id];
  // checking if userID exists i.e. if the user is logged in
  if (user && user.id) {
    const userId = user.id
    loggedUserID = getloggedUserID(urlDatabase, userId);
    let templateVars = {
      user: users[req.session.user_id],
      urls: loggedUserID
    }
    res.render("urls_index", templateVars);
    return //WHY IS IT HERE?!
  }
  res.send('you need to login first!')
});


app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {
      user: users[req.session.user_id]
    }
    res.render("urls_new", templateVars);
  } else {
    res.send('you need to login first!')
  }
});

// login routes

app.get('/login', (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  
  res.render('login', templateVars)

});

app.post('/login', (req, res) => {
  for (const user in users) {
    if (req.body.email === users[user].email && bcrypt.compareSync(req.body.password, users[user].password)) {
      req.session.user_id = user;
      res.redirect('/urls')
      return
    }
  }
  res.status(400).send('The user doesn\'t exist, please go to the register page or the password is not correct!')
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect("/login");
  return
});

//register routes

app.get('/register', (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
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
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  userID.password = hashedPassword;
  userID.email = req.body.email;
  req.session.user_id = newID;
  console.log("TCL: newID", newID)
  console.log("TCL: req.session.user_id", req.session.user_id)
  console.log("TCL: hashedPassword", hashedPassword)

  res.redirect('/urls/new')
  return
  next()
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars =
  {
    user: users[req.session.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars)

})

app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls')
  }
});

app.get('/urls/:shortURL/edit', (req, res) => {
  if (req.session.user_id) {
  let templateVars = {
    user: users[req.session.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]['longURL']
  }
  res.render("urls_show", templateVars);
  return
};
res.send(`please login first!`);
return
});

app.post('/urls/:shortURL/edit', (req, res) => {
  if (req.session.user_id) {
  urlDatabase[req.params.shortURL]['longURL'] = req.body.longURL
  res.redirect("/urls");
  }
  res.send(`please login first!`);
  return
  // urlDatabase[req.params.shortURL] = req.body.longURL;
});

//delimiter

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]['longURL'])
});

app.get("/", (req, res) => {
  console.log('session', req.session.user_id)
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
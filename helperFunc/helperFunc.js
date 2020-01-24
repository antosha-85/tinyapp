function generateRandomString(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 function getloggedUserID (urlDatabase, userId) {
   const loggedUserID = {};
   //looping through the urlDatabase object to check that ids match
     for (const url in urlDatabase) {
       if (urlDatabase[url].userID === userId) {
         loggedUserID[url] = urlDatabase[url];
       }
     }
     return loggedUserID;
 }
 module.exports = {generateRandomString, getloggedUserID}
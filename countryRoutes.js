const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const router = express.Router();

// Use body-parser middleware to parse form data
router.use(bodyParser.urlencoded({ extended: true }));

// // Route handler for the login page
// router.get('/', (req, res) => {
//   res.send(`
//     <h2>Login</h2>
//     <form action="/login" method="post">
//       <div>
//         <label for="username">Username:</label>
//         <input type="text" id="username" name="username">
//       </div>
//       <div>
//         <label for="password">Password:</label>
//         <input type="password" id="password" name="password">
//       </div>
//       <button type="submit">Login</button>
//     </form>
//   `);
// });

// Route handler for the landing page
router.get('/login', (req, res) => {
  res.send('Welcome to the landing page!');
});

// Route handler for processing the login form submission
router.post('/login', processLoginForm);

// Route handlers for country pages
router.get('/:country', (req, res) => {
  const country = req.params.country;
  if (country === 'kenya' || country === 'uganda' || country === 'tanzania') {
    res.send(`Welcome to ${country.charAt(0).toUpperCase() + country.slice(1)}`);
  } else {
    res.send('Unknown country');
  }
});

function processLoginForm(req, res) {
  const { username, password } = req.body;

  // Load user data from users.json
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      // Handle the error
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Parse the JSON data
    const usersData = JSON.parse(data);

    // Check if the provided credentials match any user in users.json
    const user = usersData.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

    if (user) {
      // If user found, authentication successful
      res.redirect(`/${user.country.toLowerCase()}`);
    } else {
      // If user not found, authentication failed
      res.send('Invalid username or password');
    }
  });
}

module.exports = router;
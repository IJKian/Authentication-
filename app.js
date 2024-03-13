const express = require('express'); // Import Express library
const bodyParser = require('body-parser');
const path = require('path'); // Import Path library
const bcrypt = require('bcrypt'); // Import bcrypt library for password hashing
const fs = require('fs'); // Import FS library for file operations

const app = express(); // Initialize Express app
const port = 3000;

// Configure view engine and views directory
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Load user data from 'users.json'
const usersFile = path.join(__dirname, 'users.json');
let usersData;
try {
  const usersRaw = fs.readFileSync(usersFile, 'utf8');
  usersData = JSON.parse(usersRaw);
} catch (err) {
  console.error(err);
  process.exit(1);
}

// Utility function to get the country of a user by username
function getUserCountry(username) {
  const user = usersData.find(user => user.username === username);
  return user ? user.country : null;
}

// Utility function to authenticate a user by username and password
function authenticateUser(username, password) {
  console.log(`Authenticating user ${username} with password ${password}`);
  const user = usersData.find(user => user.username === username);
  if (!user) {
    return false;
  }
  return(password === user.password); // Compare plaintext password with hashed password
}

// Route handler for displaying the login page
app.get('/', (req, res) => {
  res.render('login', { error: null });
});

// Route handler for processing the login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Received form data:', req.body);

  // Validate input
  if (!username || !password) {
    console.log('Invalid input: missing username or password');
    return res.render('login', { error: 'Username and password are required.' });
  }

  // Authenticate user
  if (authenticateUser(username, password)) {
    console.log('Authentication successful');

    // Get the user's country
    const userCountry = getUserCountry(username);

    // Redirect the user to the country-specific page
    if (userCountry) {
      res.redirect(`/${userCountry}`);
    } else {
      res.redirect('/');
    }
  } else {
    console.log('Authentication failed');
    res.render('login', { error: 'Invalid username or password.' });
  }
});

// Route handler for the success page
app.get('/success', (req, res) => {
  res.send('Authentication successful!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', reason, 'promise:', promise);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/kenya', (req, res) => {
  res.render('kenya', { country: 'Kenya' });
});

app.get('/uganda', (req, res) => {
  res.render('uganda', { country: 'Uganda' });
});

app.get('/tanzania', (req, res) => {
  res.render('tanzania', { country: 'Tanzania' });
});
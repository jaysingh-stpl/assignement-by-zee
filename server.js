const express = require('express');
const bodyParser = require('body-parser');
const moviesRoute = require('./routes');
const path = require('path');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
// Use Routes
app.use('/api/movies', moviesRoute);
app.get('*', (req, res) => res.json({ msg: "Server is running." }))

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));

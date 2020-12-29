const express = require("express");
const router = express.Router();
const fs = require('fs');

const erroResponse = (res, statusCode, message) => {
    return res.status(statusCode).send({ statusCode, message })
}

const getAllMovies = (req, res) => {
    const moviesDb = require('./db/movies.json')
    return res.json(moviesDb);
}


const findByTitle = (req, res) => {
    const moviesDb = require('./db/movies.json')

    const { title } = req.query;
    if (!title) {
        return erroResponse(res, 400, 'Please pass movie title');
    }
    try {
        const result = moviesDb.filter(({ Title }) => {
            if (Title && Title.toString().toLowerCase().indexOf(title.toLowerCase()) > -1) {
                return true
            }
            return false
        })
        return res.send(result);
    } catch (err) {
        console.log(err)
        return erroResponse(res, 500, 'Internal Server Error')
    }
}

const createReportByGenre = (req, res) => {
    const moviesDb = require('./db/movies.json')

    const { genre } = req.params;
    if (!genre) {
        return erroResponse(res, 400, 'Please provide genre');
    }
    try {
        const result = moviesDb.filter(({ Major_Genre }) => {
            if (Major_Genre && Major_Genre.toString().toLowerCase().indexOf(genre.toLowerCase()) > -1) {
                return true
            }
            return false
        })
        return res.send(result);
    } catch (err) {
        console.log(err)
        return erroResponse(res, 500, 'Internal Server Error')
    }
}

const createReportByYear = (req, res) => {
    const moviesDb = require('./db/movies.json')

    const { year } = req.params;
    if (!year) {
        return erroResponse(res, 400, 'Please provide year');
    }
    try {
        const result = moviesDb.filter(({ Release_Date }) => {
            if (Release_Date && Release_Date.toString().indexOf(year) > -1) {
                return true
            }
            return false
        })
        return res.send(result);
    } catch (err) {
        console.log(err)
        return erroResponse(res, 500, 'Internal Server Error')
    }
}

const deleteByTitle = (req, res) => {
    const moviesDb = require('./db/movies.json')
    const { title } = req.body;
    if (!title) {
        return erroResponse(res, 400, 'Please provide movie title');
    }

    try {
        let moviesLocations = []
        moviesDb.forEach(({ Title }, index) => {
            if (Title && Title.toString() == title) {
                moviesLocations.push(index)
            }
        })
        moviesLocations.sort((a, b) => (b - a));

        if (moviesLocations.length > 0) {
            moviesLocations.forEach(location => {
                moviesDb.splice(location, 1)
            });
            const data = JSON.stringify(moviesDb, null, 1)
            return fs.writeFile(__dirname + '/db/movies.json', data, err => {
                if (err) {
                    console.log(err)
                    return erroResponse(res, 500, 'Internal Server Error')
                }
                return res.send({ message: "Movie deleted successfully." })

            });
        }
        return res.status(400).send({ message: "Title does not exist." })
    } catch (err) {
        console.log(err)
        return erroResponse(res, 500, 'Internal Server Error')
    }
}

const addMovie = (req, res) => {
    const moviesDb = require('./db/movies.json')
    const {
        Title,
        US_Gross,
        Worldwide_Gross,
        US_DVD_Sales,
        Production_Budget,
        Release_Date,
        MPAA_Rating,
        Running_Time_min,
        Distributor,
        Source,
        Major_Genre,
        Creative_Type,
        Director,
        Rotten_Tomatoes_Rating,
        IMDB_Rating,
        IMDB_Votes
    } = req.body;

    if (!Title) {
        return erroResponse(res, 400, 'Please provide movie title');
    }

    try {
        const newMovie = {
            Title,
            US_Gross,
            Worldwide_Gross,
            US_DVD_Sales,
            Production_Budget,
            Release_Date,
            MPAA_Rating,
            Running_Time_min,
            Distributor,
            Source,
            Major_Genre,
            Creative_Type,
            Director,
            Rotten_Tomatoes_Rating,
            IMDB_Rating,
            IMDB_Votes
        }
        moviesDb.push(newMovie)

        const data = JSON.stringify(moviesDb, null, 1)
        return fs.writeFile(__dirname + '/db/movies.json', data, err => {
            if (err) {
                console.log(err)
                return erroResponse(res, 500, 'Internal Server Error')
            }
            return res.send({ message: "Movie added successfully." })
        });
    } catch (err) {
        console.log(err)
        return erroResponse(res, 500, 'Internal Server Error')
    }
}


const updateMovie = (req, res) => {
    const moviesDb = require('./db/movies.json')
    const {
        Title,
        US_Gross,
        Worldwide_Gross,
        US_DVD_Sales,
        Production_Budget,
        Release_Date,
        MPAA_Rating,
        Running_Time_min,
        Distributor,
        Source,
        Major_Genre,
        Creative_Type,
        Director,
        Rotten_Tomatoes_Rating,
        IMDB_Rating,
        IMDB_Votes
    } = req.body;
    const { title } = req.params
    if (!Title || !title) {
        return erroResponse(res, 400, 'Please provide movie title');
    }

    try {
        const updateMovieRecord = {
            Title,
            US_Gross,
            Worldwide_Gross,
            US_DVD_Sales,
            Production_Budget,
            Release_Date,
            MPAA_Rating,
            Running_Time_min,
            Distributor,
            Source,
            Major_Genre,
            Creative_Type,
            Director,
            Rotten_Tomatoes_Rating,
            IMDB_Rating,
            IMDB_Votes
        }
        let moviesLocation = 0
        const result = moviesDb.filter(({ Title }, index) => {
            if (Title && Title.toString() == title) {
                moviesLocation = index
                return true
            }
            return false
        })
        if (result.length == 1) {
            moviesDb[moviesLocation] = updateMovieRecord

            const data = JSON.stringify(moviesDb, null, 1)
            return fs.writeFile(__dirname + '/db/movies.json', data, err => {
                if (err) {
                    console.log(err)
                    return erroResponse(res, 500, 'Internal Server Error')
                }
                return res.send({ message: "Record Updated successfully." })

            });
        } else if (result.length > 1) {
            return res.status(400).send({ message: "Title is not unique" })
        }
        return res.status(400).send({ message: "Title does not exist." })
    } catch (err) {
        console.log(err)
        return erroResponse(res, 500, 'Internal Server Error')
    }
}




// @route   POST api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check for user
        if (!user) {
            errors.email = "User not found";
            return res.status(404).json(errors);
        }

        // Check Password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User Matched
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    address: user.address,
                    occupation: user.occupation

                }; // Create JWT Payload
                // Sign Token
                JWTToken(payload, res);
            } else {
                errors.password = "Email or Password incorrect";
                return res.status(400).json(errors);
            }
        });
    });
});


module.exports = {
    getAllMovies,
    findByTitle,
    deleteByTitle,
    addMovie,
    updateMovie,
    createReportByGenre,
    createReportByYear
};

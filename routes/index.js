const express = require("express");
const router = express.Router();
const moviesApi = require('./api/movies');

router.get("/search", moviesApi.findByTitle);
router.get("/report-by-genre/:genre", moviesApi.createReportByGenre);
router.get("/report-by-year/:year", moviesApi.createReportByYear);
router.post("/delete", moviesApi.deleteByTitle);
router.post("/add", moviesApi.addMovie);
router.put("/update/:title", moviesApi.updateMovie);
router.get("/", moviesApi.getAllMovies);


module.exports = router;

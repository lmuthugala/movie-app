var express = require('express');
var router = express.Router();
const request = require('request');

const apiKey = '1fb720b97cc13e580c2c35e1138f90f8';
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

router.use((req,res,next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
})

/* GET home page. */
router.get('/', (req, res, next) => {
  // request.get takes 2 args:
  // 1. it takes the URL to http "get"
  // 2. the callback to run when the http response is back. 3 args:
  //   1. error (if any)
  //   2. http response
  //   3. json/data the server sent back
  request.get(nowPlayingUrl,(error,response,movieData) => {
    // console.log("=====The Error====");
    // console.log(error);
    // console.log("=====The Response====");
    // console.log(response)
    // console.log("=====Movie Data====");
    // console.log(movieData)
    // console.log("=====Parsed Movie Data====");
    const parsedData = JSON.parse(movieData);
    // console.log(parsedData)
    res.render("index",{parsedData:parsedData.results})
  }); 
});

// /movie/:id is a wildcard route. 
// that means that :id is going to be stored in...
router.get('/movie/:id',(req, res, next)=>{
  // res.json(req.params.id);
  const movieId = req.params.id;
  const movieRequestUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;

  request.get(movieRequestUrl,(error,response,movieData) => {
    const parsedData = JSON.parse(movieData);
    res.render("single-movie",{parsedData:parsedData})
  })
})

router.post('/search',(req, res, next)=>{
  //  res.json("Sanity Check");
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const searchUrl = `${apiBaseUrl}/search/${cat}/?query=${userSearchTerm}&api_key=${apiKey}`
  request.get(searchUrl,(error,response,movieData) => {
    const parsedData = JSON.parse(movieData);
    if(cat === "person"){
      parsedData.results = parsedData.results[0].known_for;
    }
    res.render("index",{parsedData:parsedData.results})
  })
})


module.exports = router;

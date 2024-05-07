// Global variables
var movieList = [];
var movieName;
var mainActor;

// local storage functions
initMovieList();
initMovieData();

function renderMovies() {
  $("#list-of-movies").empty();
  $("#movie-name").val("");

  for (i = 0; i < movieList.length; i++) {
    var a = $("<a>");
    a.addClass("button is-inline px-4 m-4 movie");
    a.attr("data-name", movieList[i]);
    a.text(movieList[i]);
    $("#list-of-movies").prepend(a);
  }
}
// This function pulls the movie list array from local storage
function initMovieList() {
  var storedMovies = JSON.parse(localStorage.getItem("movies"));

  if (storedMovies !== null) {
    movieList = storedMovies;
    $("#recent-search").attr("style", "visibility: visible");
    $("#data-display").attr("style", "visibility: visible");
  }
  renderMovies();
}
// This function pull the current movie into local storage to display the current info on reload
function initMovieData() {
  var storedMovieData = JSON.parse(localStorage.getItem("currentMovie"));

  if (storedMovieData !== null) {
    movieName = storedMovieData;
    getMovieDetails(movieName);
  }
}

// This function saves the movie array to local storage
function storeMovieArray() {
  localStorage.setItem("movies", JSON.stringify(movieList));
}

// This function saves the currently displayed movie to local storage
function storeCurrentMovie(searchedMovie) {
  localStorage.setItem("currentMovie", JSON.stringify(searchedMovie));
}

// Click event handler for movie search button
$(".search-btn").on("click", function (event) {
  event.preventDefault();
  var userMovieName;
  userMovieName = $("#movie-name").val().trim();
  if (userMovieName === "") {
    alert("Please enter a movie to look up");
  } else if (movieList.length >= 3) {
    movieList.shift();
    movieList.push(userMovieName);
  } else {
    movieList.push(userMovieName);
  }
  storeCurrentMovie(userMovieName);
  storeMovieArray();
  renderMovies();
  $("#PosterContainer").empty();
  $("#actorPic").empty();
  getMovieDetails(userMovieName);
  $("#recent-search").attr("style", "visibility: visible");
  $("#data-display").attr("style", "visibility: visible");
});

// "enter" key executes the movie search field as well
$("#movie-name").keyup(function (event) {
  if (event.keyCode === 13) {
    $(".search-btn").click();
  }
});

function getMovieDetails(movie) {
  let url = "https://www.omdbapi.com/?t=" + movie + "=&apikey=3825ead9";

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("data", data);

      movieName = data.Title;
      allActors = data.Actors.split(",");
      mainActor = allActors[0];

      $("#Movie-Title").text(data.Title);
      $("#Director").text(data.Director);
      $("#Main-Actor").text(mainActor);
      $("#Year").text(data.Year);
      $("#Genre").text(data.Genre);
      $("#moviePlot").text(data.Plot);
      $("#movieAwards").text(data.Awards);

      var posterString =
        '<img src="' +
        data.Poster +
        '"' +
        ' alt="Poster" width="auto" height="180px"' +
        "/>";
      $("#PosterContainer").append(posterString);

      getActorId(movieName);
    });
}

function getActorId(movie) {
  let movieInput;
  console.log("movie", movie);
  let movieArr = movie.split(" ");
  if (movieArr.length > 1) {
    let movieString = movie.split(" ").join("");
    movieInput = movieString;
  } else {
    movieInput = movie;
  }
  var url = `https://imdb188.p.rapidapi.com/api/v1/searchIMDB?query=${movieInput}`;
  var options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "43637246d6mshea324c7ad19ea80p111d59jsncae2d5c6899c",
      "X-RapidAPI-Host": "imdb188.p.rapidapi.com",
    },
  };

  fetch(url, options)
    .then(function (response) {
      console.log("response", response);
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      //   console.log("movie", movie);
      //   console.log("callIMDB for movie", data);
      if (data.status) {
        const movieData = data.data;
        const searchedMovie = movieData.filter(
          (movieData) => movieData.title == movie
        );

        let starActorName = searchedMovie[0].stars.split(",")[0];
        getActorBio(starActorName);

        $("#PersonCharacter").text(starActorName);
      } else {
        console.log("data", data);
      }
    });
}

function getActorBio(starActorName) {
  const joinActor = starActorName.split(" ").join("");

  const url = `https://imdb188.p.rapidapi.com/api/v1/searchIMDB?query=${joinActor}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "43637246d6mshea324c7ad19ea80p111d59jsncae2d5c6899c",
      "X-RapidAPI-Host": "imdb188.p.rapidapi.com",
    },
  };

  fetch(url, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // added actor face img to center column
      var actorFace =
        '<img src="' +
        data.data[0].image +
        '"' +
        ' alt="Star Actor" width="auto" height="180px"' +
        "/>";
      $("#actorPic").append(actorFace);
    })
    .catch((err) => console.error(err));
}

$("#PosterContainer").empty();
$("#actorPic").empty();

function historyDisplayMovies() {
  searchedMovie = $(this).attr("data-name");
  $("#PosterContainer").empty();
  $("#actorPic").empty();
  getMovieDetails(searchedMovie);
  $("#recent-search").attr("style", "visibility: visible");
  $("#data-display").attr("style", "visibility: visible");
}

$(document).on("click", ".movie", historyDisplayMovies);

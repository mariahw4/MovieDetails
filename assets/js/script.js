 // Global variables
 var movieList = [];
 var movieName;
 

// local storage functions
initMovieList();
initWikipedia();

function renderMovies(){
    $("#list-of-movies").empty();
    $("#movie-name").val("");
    
    for (i=0; i<movieList.length; i++){
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
    }
    
    renderMovies();
    }
// This function pull the current movie into local storage to display the current info on reload
function initWikipedia() {
    var storedWikipedia = JSON.parse(localStorage.getItem("wikipedia"));

    if (storedWikipedia !== null) {
        movieName = storedWikipedia;

        displayWikipedia();
    }
}

// This function saves the movie array to local storage
function storeMovieArray() {
    localStorage.setItem("movies", JSON.stringify(movieList));
    }

// This function saves the currently displayed movie to local storage
function storeCurrentMovie() {

    localStorage.setItem("currentMovie", JSON.stringify(movieName));
}
      
// Click event handler for movie search button
$(".search-btn").on("click", function(event){
    event.preventDefault();

    movieName = $("#movie-name").val().trim();
    if(movieName === ""){
        alert("Please enter a movie to look up")

    }else if (movieList.length >= 3){  
        movieList.shift();
        movieList.push(movieName);

    }else{
    movieList.push(movieName);
    }
    storeCurrentMovie();
    storeMovieArray();
    renderMovies();
    // displayWikipedia();
});

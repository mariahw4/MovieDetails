 // Global variables
var movieList = [];
var movieName;
var mainActor;

// local storage functions
initMovieList();
initMovieData();

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
$(".search-btn").on("click", function(event){
    event.preventDefault();
    var userMovieName;
    userMovieName = $("#movie-name").val().trim();
    if(userMovieName === ""){
        alert("Please enter a movie to look up")

    }else if (movieList.length >= 3){  
        movieList.shift();
        movieList.push(userMovieName);

    }else{
    movieList.push(userMovieName);
    }
    storeCurrentMovie(userMovieName);
    storeMovieArray();
    renderMovies();
    $('#PosterContainer').empty();
    $('#PersonFace').empty();
    getMovieDetails(userMovieName);
    $("#recent-search").attr("style", "visibility: visible");
    $("#data-display").attr("style", "visibility: visible");

        
});

// "enter" key executes the movie search field as well
$("#movie-name").keyup(function(event) {
    if (event.keyCode === 13) {
        $(".search-btn").click();
    }
});

function getMovieDetails(movie){
    let url = 'https://www.omdbapi.com/?t=' + movie + '=&apikey=b05ca673';
    
    fetch(url)
    .then(function (response){
    return(response.json());
    }).then(function(data){
    
        movieName = data.Title;
        mainActor = data.Actors.split(",")[0];
        
        $('#Movie-Title').text(data.Title);
        $('#Director').text(data.Director);
        $('#Main-Actor').text(mainActor);
        $('#Year').text(data.Year);
        $('#Genre').text(data.Genre);

        var posterString = '<img src="' + data.Poster +'"' + ' alt="Poster" width="auto" height="180px"' + '/>';
        $('#PosterContainer').append(posterString);

        getActorId(movieName);
}); 
    
}

function getActorId(movie){
    var url = "https://imdb8.p.rapidapi.com/title/find?q="+movie;
    var options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2cb15b5d0bmsh9a58fa38194342bp15d719jsn583d89ed735c',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    fetch(url, options)
    .then(function(response){
        return(response.json());
    }).then(function(data){
        console.log("callIMDB for movie", data); 
        console.log('id :>> ', data.results[0].principals[0].id);  
        console.log('char id:>>', data.results[0].principals[0].roles[0].character);
        var actorIdRaw = data.results[0].principals[0].id;
        const start = actorIdRaw.search("nm");
        const end = actorIdRaw.length - 1;
        var actorId = actorIdRaw.substring(start,end);
        getActorBio(actorId)
        
        // added actor character name to center column
        var actorCharRaw = data.results[0].principals[0].roles[0].character;
        const startC = actorCharRaw.search("nm");
        const endC = actorCharRaw.length;
        var actorChar = actorCharRaw.substring(startC,endC);
        $('#PersonCharacter').text(actorChar);
    });
}

function getActorBio(actorId){
    url = "https://imdb8.p.rapidapi.com/actors/get-bio?nconst=" + actorId;
    var options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2cb15b5d0bmsh9a58fa38194342bp15d719jsn583d89ed735c',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    fetch(url, options)
    .then(function(response){
        return(response.json());
    }).then(function(data){
        // added actor face img to center column
        var actorFace = '<img src="' + data.image.url +'"' + ' alt="Image" width="auto" height="180px"' + '/>';
        $('#PersonFace').append(actorFace);

        console.log("data intended for bio", data);
        console.log("image url ==>", data.image.url);
        var actorBioRaw = data.miniBios[0].text;
        const lim = actorBioRaw.search("\n");
        var actorBio = actorBioRaw.substring(0,lim);
        var actorName = data.name;
        $('#PersonName').text(actorName);
        $('#PersonBio').text(actorBio);
        

    }).catch(err => console.error(err));

}

$('#PosterContainer').empty();
$('#PersonFace').empty();


function historyDisplayMovies(){
    searchedMovie = $(this).attr("data-name");
    $('#PosterContainer').empty();
    $('#PersonFace').empty();
    getMovieDetails(searchedMovie);
    console.log(searchedMovie);    
    $("#recent-search").attr("style", "visibility: visible");
    $("#data-display").attr("style", "visibility: visible");
}

$(document).on("click", ".movie", historyDisplayMovies);

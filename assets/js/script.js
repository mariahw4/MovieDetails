 // Global variables
var movieList = [];
var movieName;
var mainActor;

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
    storeCurrentMovie();
    storeMovieArray();
    renderMovies();
    $('#PosterContainer').empty();
    getMovieDetails(userMovieName);
        
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
        var actorIdRaw = data.results[0].principals[0].id;
        const start = actorIdRaw.search("nm");
        const end = actorIdRaw.length - 1;
        var actorId = actorIdRaw.substring(start,end);
        getActorBio(actorId)
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
        var actorBioRaw = data.miniBios[0].text;
        const lim = actorBioRaw.search("\n");
        var actorBio = actorBioRaw.substring(0,lim);
        var actorName = data.name;
        $('#PersonName').text(actorName);
        $('#PersonBio').text(actorBio);

    }).catch(err => console.error(err));

}

$('#PosterContainer').empty();

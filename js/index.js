/* 
LEARNT: 
💡delaying functions, defining functions inside objects, template literals, DOM elements, async await functions, catching errors to parameters destructuring!
*/

// Definining functions in objects

const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; // If movie.Poster equals N/A it will assign value of empty string. Otherwise will return movie.Poster to imgSRC
        return `
        <div class="images-holder">
            <div class="card-image">
                <img src="${imgSrc}"/>
                <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">view</i></a>
            </div>
        </div>
        <div class="card-content">
            <p><b>${movie.Title}</b><br>(${movie.Year})</p>
        </div>
       
        
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: {
                // this object will be turned into a string and appended to the end of the URL
                apikey: '63a1f276',
                s: searchTerm
            }
        });
        if (response.data.Error) {
            // If there is no results, menu is hidden.
            return [];
        }

        return response.data.Search;
    }
};

// Creating a new object of createAutoComplete, takes all of the properties in autoCompleteConfig and adds in new property of rootWidget
// Parameters destructuring
createAutoComplete({
    ...autoCompleteConfig, // Makes a copy of this object and throws into this object
    rootWidget: document.querySelector('#autocomplete'),
    onOptionSelect(movie) {
        onMovieSelect(movie, document.querySelector('.results'));
    }
});

// Added a helper function - to call for an API request to fetch more data based on the imdbID

const onMovieSelect = async (movie, summary) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '63a1f276',
            i: movie.imdbID
        }
    });

    summary.innerHTML = movieTemplate(response.data);
};

// movieDetail will pass in all the movie object
const movieTemplate = (movieDetail) => {
    // turns boxOffice string - replaces $ and , with empty space turns '$600,000' = 600000
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    // Gives an array, where every element in the array is one of the words/numbers ex - ["Nominated", "for", "3", "Oscards"]
    const awards = movieDetail.Awards.split(' ').reduce((prevVal, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return prevVal;
        } else {
            return prevVal + value;
        }
    }, 0);
    return `

    <div class="movieDiv--two">
        
        <img class="card-image--two" src="${movieDetail.Poster}"/>
        
        <div class="content">
            <h5>Title: <b class="text-detail">${movieDetail.Title}</b></h5>
            <h5>Genre: <b class="text-detail">${movieDetail.Genre}</b></h5>
            <h5>Overview: <b class="text-detail">${movieDetail.Plot}</b></h5>
        </div>

        <ul id="collection">
            <li id="collection-item" data-value=${awards}">
                <div class="results-container">
                    <img src="images/award.png" alt="">
                    <span class="results-title">Awards</span>
                </div>
                <p>${movieDetail.Awards}</p>
            </li>
            <li id="collection-item" data-value=${dollars}">
                <div class="results-container">
                    <img src="images/dollars.png" alt="">
                    <span class="results-title">Box Office</span>
                </div>
                <p>${movieDetail.BoxOffice}</p>
            </li>
            <li id="collection-item" data-value=${metaScore}">
                <div class="results-container">    
                    <img src="images/metascore.png" alt="">
                    <span class="results-title">Metascore</span>
                </div>
                <p>${movieDetail.Metascore}</p>
            </li>
            <li id="collection-item" data-value=${imdbRating}">
                <div class="results-container">   
                    <img src="images/imdbrating.png" alt="">
                    <span class="results-title">IMDB Rating</span>
                </div>
                <p>${movieDetail.imdbRating}</p>
            </li>
            <li id="collection-item" data-value=${imdbVotes}">    
                <div class="results-container"> 
                    <img src="images/votes.png" alt="">
                    <span class="results-title">IMDB Votes</span>
                </div>
                <p>${movieDetail.imdbVotes}</p>
            </li>
        </ul>
  </div>
    `;
};

/*
ADD MORE FUNCTIONALITY

- Add an error message like 'Cannot find anything with this name' when no results show
*/
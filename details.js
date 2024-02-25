// Function to fetch movie details from OMDB API
async function fetchMovieDetails(imdbID) {
    // API key for OMDB
    const apiKey = 'cf7331ea';
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;
    
    // Fetch movie details from the API
    const response = await fetch(url);
    const objDetails = await response.json();
    
    // Log the fetched details for debugging
    console.log(objDetails);
    
    // Call function to display the movie details on the webpage
    displayCard(objDetails);
}

// Function to display movie details on the webpage
function displayCard(objDetails) {
    // Get the container for object details from the HTML
    const objDetailsContainer = document.getElementById('object-body');

    // Check if the response is successful and contains valid details
    if (objDetails.Response && objDetails.Response === 'True') {
        // Clear previous content from the container
        while (objDetailsContainer.firstChild) {
            objDetailsContainer.removeChild(objDetailsContainer.firstChild);
        }

        // Create container for the object
        const objContainer = document.createElement('div');
        objContainer.id = 'obj-container';

        // Create image element for the movie poster
        const img = document.createElement('img');
        img.alt = objDetails.Title;
        
        // Set the image source based on the availability of the poster
        if (objDetails.Poster !== "N/A") {
            img.src = objDetails.Poster;
        } else {
            img.src = "images/img-not-found.jpg";
        }

        // Create container for object details
        const objDetailsDiv = document.createElement('div');
        objDetailsDiv.id = 'details';

        // Create container for object title and year
        const objHeadDiv = document.createElement('div');
        objHeadDiv.id = 'head';

        // Create heading for title and year
        const titleHeading = document.createElement('h2');
        titleHeading.textContent = `${objDetails.Title} (${objDetails.Year})`;

        // Create span elements for genres
        const genreDiv = document.createElement('div');
        genreDiv.className = 'genres';

        const captionSpan = document.createElement('span');
        captionSpan.className = 'obj-rating';
        captionSpan.textContent = 'Genres: ';
        genreDiv.appendChild(captionSpan);

        const genres = objDetails.Genre.split(', ');
        genres.forEach(genre => {
            const genreSpan = document.createElement('span');
            genreSpan.className = 'genre';
            genreSpan.textContent = genre;
            genreDiv.appendChild(genreSpan);
        });

        // Create paragraph for IMDb rating
        const ratingParagraph = document.createElement('p');
        ratingParagraph.className = 'obj-rating';
        ratingParagraph.textContent = objDetails.imdbRating === 'N/A' ? 'IMDb RATING: ' : `IMDb RATING ${objDetails.imdbRating}`;

        // Create paragraph for directors
        const creatorsParagraph = document.createElement('p');
        creatorsParagraph.className = 'obj-details';
        creatorsParagraph.textContent = objDetails.Director === 'N/A' ? 'Creators: ' : `Creators: ${objDetails.Director}`;

        // Create paragraph for stars
        const starsParagraph = document.createElement('p');
        starsParagraph.className = 'obj-details';
        starsParagraph.textContent = objDetails.Actors === 'N/A' ? 'Stars: ' : `Stars: ${objDetails.Actors}`;

        // Create paragraph for plot
        const plotParagraph = document.createElement('p');
        plotParagraph.className = 'obj-details';
        plotParagraph.textContent = objDetails.Plot === 'N/A' ? '' : objDetails.Plot;

        // Create paragraph for duration
        const durationParagraph = document.createElement('p');
        durationParagraph.className = 'obj-details';
        durationParagraph.textContent = objDetails.Runtime === 'N/A' ? '' : `Duration: ${objDetails.Runtime}`;

        // Create paragraph for release date
        const releaseDateParagraph = document.createElement('p');
        releaseDateParagraph.className = 'obj-details';
        releaseDateParagraph.textContent = objDetails.Released === 'N/A' ? '' : `Release Date: ${objDetails.Released}`;

        // Create paragraph for language
        const languageParagraph = document.createElement('p');
        languageParagraph.className = 'obj-details';
        languageParagraph.textContent = objDetails.Language === 'N/A' ? '' : `Language: ${objDetails.Language}`;

        // Append elements to their respective parents
        objHeadDiv.appendChild(titleHeading);
        objDetailsDiv.appendChild(objHeadDiv);
        objDetailsDiv.appendChild(genreDiv);
        objDetailsDiv.appendChild(durationParagraph);
        objDetailsDiv.appendChild(releaseDateParagraph);
        objDetailsDiv.appendChild(languageParagraph);
        objDetailsDiv.appendChild(ratingParagraph);
        objDetailsDiv.appendChild(creatorsParagraph);
        objDetailsDiv.appendChild(starsParagraph);
        objDetailsDiv.appendChild(plotParagraph);

        // Append the image and details container to the main object container
        objContainer.appendChild(img);
        objContainer.appendChild(objDetailsDiv);

        // Append the main object container to the container in the HTML
        objDetailsContainer.appendChild(objContainer);
    } else {
        // If object details not found, display a message
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = 'Object details not found.';
        objDetailsContainer.appendChild(messageParagraph);
    }
}

// Event listener to fetch and display movie details when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the movie ID from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    // Call the function to fetch movie details based on the ID
    fetchMovieDetails(movieId);
});

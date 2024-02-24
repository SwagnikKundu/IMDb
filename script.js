// DOM constants
const searchInput = document.querySelector('#search-input');
const typeSelect = document.querySelector('.search-filter'); 
const recentSection = document.querySelector('#recently-viewed');
const wishlistSection = document.querySelector('#my-wishlist');

const apiKey = 'cf7331ea';
const maxItems = 10;

// Function to fetch data from a URL and save it as an object
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to clear the search list and input field
function clearSearchList() {
    const searchList = document.getElementById('search-list');
    while (searchList.firstChild) {
        searchList.removeChild(searchList.firstChild);
    }
    searchInput.value = ''; // Clear input field
}

// Function to display search results
function displaySearchResults(data) {
    const searchList = document.getElementById('search-list');
    searchList.innerHTML = ''; // Clear previous results

    if (data && data.Response === 'True') {
        data.Search.forEach(item => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item');

            const listItemContent = document.createElement('div');
            listItemContent.classList.add('list-item-content');

            const thumbnail = document.createElement('div');
            thumbnail.classList.add('item-thumbnail');
            const thumbnailImg = document.createElement('img');
            if (item.Poster !== "N/A") {
                thumbnailImg.src = item.Poster;
            } else {
                thumbnailImg.src = "images/img-not-found.jpg";
            }
            thumbnail.appendChild(thumbnailImg);

            const info = document.createElement('div');
            info.classList.add('item-info');
            const title = document.createElement('h3');
            title.textContent = item.Title;
            const year = document.createElement('p');
            year.textContent = item.Year;
            const tagIcon = document.createElement('i');
            tagIcon.classList.add('fas','p-2', item.Type === 'movie' ? 'fa-film' : 'fa-tv');
            const tagText = document.createElement('span');
            tagText.textContent = item.Type === 'movie' ? 'Movie' : 'Series';
            const tagContainer = document.createElement('div');
            tagContainer.classList.add('tag-container');
            tagContainer.appendChild(tagIcon);
            tagContainer.appendChild(tagText);

            info.appendChild(title);
            info.appendChild(year);
            info.appendChild(tagContainer);

            // Create an icon for adding to favorites
            const addToFavoritesIcon = document.createElement('i');
            addToFavoritesIcon.classList.add('fa-regular', 'fa-heart', 'wishlist-icon');
            addToFavoritesIcon.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent event from bubbling up to the parent elements
                handleWishlistClick(item);
            });

            
            listItem.addEventListener('click', function(event) { 
                handleThumbnailClick(item);
                closeSearchList();
                redirectToDestinationPage(item);
                
                
            });

            // Append elements
            listItemContent.appendChild(thumbnail);
            listItemContent.appendChild(info);

            listItem.appendChild(listItemContent);
            listItem.appendChild(addToFavoritesIcon);

            searchList.appendChild(listItem);
        });
    } else {
        const message = document.createElement('p');
        message.textContent = 'No results found.';
        searchList.appendChild(message);
    }
}



// Function to add item to wishlist
async function addToWishlist(item) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const existingIndex = wishlist.findIndex((wishlistItem) => wishlistItem.imdbID === item.imdbID);
    if (existingIndex === -1) {
        wishlist.splice(itemIndex, 1);
    }
    const movieDetails = await fetchMovieDetails(item.imdbID);
        wishlist.push({ ...item,details: movieDetails});
        wishlist = wishlist.slice(0, maxItems);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Function to handle click on wishlist icon
async function handleWishlistClick(item) {
    let wishList = JSON.parse(localStorage.getItem('wishlist')) || [];
    const itemIndex = wishList.findIndex((viewedItem) => viewedItem.imdbID === item.imdbID);
    if (itemIndex !== -1) {
        wishList.splice(itemIndex, 1);
    }
    const movieDetails = await fetchMovieDetails(item.imdbID);
    wishList.push({ ...item, details: movieDetails });
    
    wishList = wishList.slice(0, maxItems);
    localStorage.setItem('wishlist', JSON.stringify(wishList));
    renderMyWishlist();
}




async function fetchMovieDetails(imdbID) {
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;
    const response = await fetch(url);
    const movieDetails = await response.json();
    return movieDetails;
}

async function addToRecentlyViewed(item) {
    let recentlyViewedList = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const itemIndex = recentlyViewedList.findIndex((viewedItem) => viewedItem.imdbID === item.imdbID);
    if (itemIndex !== -1) {
        recentlyViewedList.splice(itemIndex, 1);
    }
    const movieDetails = await fetchMovieDetails(item.imdbID);
    recentlyViewedList.unshift({ ...item, details: movieDetails });
    
    recentlyViewedList = recentlyViewedList.slice(0, 2*maxItems);
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewedList));
}

// localStorage.clear();


// Function to handle click on thumbnail
function handleThumbnailClick(item) {
    addToRecentlyViewed(item);
    renderRecentViewed();
}

// Event listener for the input field
searchInput.addEventListener('input', search);
typeSelect.addEventListener('change', search);

function search() {
    const searchTerm = searchInput.value.trim();
    const selectedType = typeSelect.value; 
    if (searchTerm.length === 0) {
        clearSearchList();
        return;
    }
    let type = '';
    if (selectedType !== 'all') {
        type = `&type=${selectedType}`;
    }

    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&page=1&s=${searchTerm}${type}`;

    fetchData(apiUrl)
        .then(data => {
            displaySearchResults(data);
        });
}

// Function to close search list when clicking outside
function closeSearchList() {
    const searchList = document.getElementById('search-list');
    clearSearchList();
    searchInput.value = ''; 
}

document.body.addEventListener('click', closeSearchList);

function createElementsFromArray(array, parentElement,headingText) {
    
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }

    const heading = document.createElement('h2');
    heading.textContent = headingText;
    parentElement.appendChild(heading);

    const mainDiv = document.createElement('div');
    mainDiv.className = 'main';
    

    array.forEach(item => {
        const div = document.createElement('div');
        const img = document.createElement('img');
        const infoDiv = document.createElement('div');
        const title = document.createElement('h3');
        const rating = document.createElement('span');
        const plot = document.createElement('div');
        const deleteDiv = document.createElement('div');
        div.className = 'object';
        img.className = 'object-image';
        infoDiv.className = 'object-info';
        rating.className = 'rating';
        if (item.Poster !== "N/A") {
            img.src = item.Poster;
        } else {
            img.src = "images/img-not-found.jpg";
        }
        title.textContent = item.Title;


        

        infoDiv.appendChild(title);
        if(item.details.imdbRating!=='N/A'){
            rating.textContent = item.details['imdbRating'];
            if(item.details['imdbRating']>=6){
                rating.classList.add('green');
            } else {
                rating.classList.add('red');
            }
            infoDiv.appendChild(rating);
        }
        div.appendChild(img);
        div.appendChild(infoDiv);
        if(item.details.Plot!=='N/A'){
            plot.textContent = item.details['Plot'];
            plot.classList.add('plot');
            div.appendChild(plot);
        }

        div.addEventListener('click', function() {
            redirectToDestinationPage(item);
        });

        
        mainDiv.appendChild(div);
    });

    parentElement.appendChild(mainDiv);
}

function renderRecentViewed(){
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    console.log(recentlyViewed);
    if(recentlyViewed[0])
        createElementsFromArray(recentlyViewed,recentSection,'Recently Viewed >');
}


// Function to redirect to a details page in a new tab
function redirectToDestinationPage(item) {
    window.location.href = 'details-page.html';
}

function renderMyWishlist(){
    let wishlisted = JSON.parse(localStorage.getItem('wishlist')) || [];
    console.log(wishlisted);
    if(wishlisted[0])
        createElementsFromArray(wishlisted,wishlistSection,'My Wishlist >');
}

var video = document.getElementById("advertisement-video");

    function playVideo() {
        video.play();
        video.muted = false;
        video.volume = 0.5;
    }

video.addEventListener('click',playVideo);

renderRecentViewed();
renderMyWishlist();

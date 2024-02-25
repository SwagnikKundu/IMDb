// DOM constant for wishlist section
const wishlistSection = document.querySelector('#wishlist-body');

// Function to render wishlist items
function renderMyWishlistList() {
    // Retrieve wishlist items from localStorage
    let wishlisted = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Log wishlist items for debugging purposes
    console.log(wishlisted);
    
    // Check if wishlist is not empty
    if (wishlisted[0])
        // Call function to create and display wishlist
        createWatchlist(wishlisted, wishlistSection);
}

// Function to create and display wishlist items
function createWatchlist(wishlistArray, parentElement) {
    // Clear existing content in the parent element
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }

    // Create the main container div for the wishlist
    const mainDiv = document.createElement('div');
    mainDiv.className = 'wishlist-main';

    // Iterate through each item in the wishlist array
    wishlistArray.forEach(item => {
        // Create elements for the item
        const div = document.createElement('div');
        const img = document.createElement('img');
        const infoDiv = document.createElement('div');
        const title = document.createElement('h3');
        const deleteDiv = document.createElement('div');

        // Assign classes to elements
        div.className = 'object';
        img.className = 'object-image';
        infoDiv.className = 'object-info';
        deleteDiv.classList.add('delete-icon');

        // Set image source based on item details or default image
        if (item.details && item.details.Poster && item.details.Poster !== "N/A") {
            img.src = item.details.Poster;
        } else {
            img.src = "images/img-not-found.jpg";
        }

        img.addEventListener('click', function() {
            redirectToDestinationPage(item);
        });

        // Set title text content
        title.textContent = item.Title;

        // Append title to infoDiv
        infoDiv.appendChild(title);

        // Create delete button and attach event listener
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash-alt';
        deleteDiv.appendChild(deleteIcon);
        deleteDiv.addEventListener('click', function() {
            // Handle delete functionality here, for example:
            removeFromWishlist(item);
            // After deleting, re-render the wishlist
            renderMyWishlistList();
        });
        infoDiv.appendChild(deleteDiv);

        // Append image, infoDiv, and delete button to the main div
        div.appendChild(img);
        div.appendChild(infoDiv);
        
        // Append the item div to the main container div
        mainDiv.appendChild(div);
    });

    // Append the main container div to the parent element
    parentElement.appendChild(mainDiv);
}

// Event listener to render wishlist on DOM content load
document.addEventListener('DOMContentLoaded', function() {
    renderMyWishlistList();    
});


// Function to redirect to a details page 
function redirectToDestinationPage(item) {
    window.location.href = `details-page.html?id=${item.imdbID}`;
}

// Function to remove item from wishlist
async function removeFromWishlist(item) {
    // Display a confirmation dialog before removing the item
    const confirmation = confirm("Are you sure you want to remove this item from your wishlist?");
    
    // If user confirms deletion, proceed with removing the item
    if (confirmation) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const existingIndex = wishlist.findIndex((wishlistItem) => wishlistItem.imdbID === item.imdbID);
        if (existingIndex !== -1) {
            wishlist.splice(existingIndex, 1);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }
}

let lastSelectedPenultimate = null;
let penultimateExpanded = false;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

let mainCategorySelected = false;

function filterCategories(category) {
    const penultimateLinks = document.getElementById('penultimate-links');
    const penultimateSidebar = document.querySelector('.penultimate-sidebar');
    const mainSidebar = document.querySelector('.main-sidebar');
    const initialMessage = document.getElementById('initial-message');
    const finalCategoryContainer = document.getElementById('final-category-container');
    const carouselContainer = document.getElementById('carousel-container'); // Get the carousel container

    // Hide initial message and carousel when a category is clicked
    initialMessage.style.display = 'none';
    carouselContainer.style.display = 'none';

    // Clear previous penultimate links and final categories
    penultimateLinks.innerHTML = '';
    finalCategoryContainer.innerHTML = '';

    // Get the main category group
    const categoryGroup = document.querySelector(`.category-group-container[data-category="${category}"]`);
    if (categoryGroup) {
        // Get penultimate categories
        const penultimateItems = [...categoryGroup.querySelectorAll('[data-penultimate]')];

        // Create buttons for each penultimate category
        penultimateItems.forEach((penultimate) => {
            const penultimateName = penultimate.dataset.penultimate;
            const capitalizedPenultimateName = capitalizeFirstLetter(penultimateName);

            const penultimateButton = document.createElement('button');
            penultimateButton.classList.add('penultimate-button');
            penultimateButton.textContent = capitalizedPenultimateName;
            penultimateButton.onclick = () => selectPenultimateCategory(penultimateName, category);

            penultimateLinks.appendChild(penultimateButton);
        });

        // Show the penultimate sidebar and slide the main sidebar away
        penultimateSidebar.classList.add('show');
        mainSidebar.style.transform = 'translateX(-250px)';
    }
}

// Select a penultimate category and display its children
function selectPenultimateCategory(penultimateName, parentName) {
    const finalCategoryContainer = document.getElementById('final-category-container');
    const allGroups = document.querySelectorAll('.category-group[data-penultimate]');

    // Hide all final categories
    allGroups.forEach(group => {
        group.style.display = 'none';
    });

    // Clear the final category container before populating it
    finalCategoryContainer.innerHTML = '';

    // Show final categories related to the selected penultimate category
    const selectedGroup = document.querySelector(`.category-group[data-penultimate="${penultimateName}"]`);
    if (selectedGroup) {
        const childItems = selectedGroup.querySelectorAll('.category-item');
        childItems.forEach(item => {
            finalCategoryContainer.appendChild(item.cloneNode(true));
        });
    }
}

// Add event listener for the "Back to Main Categories" button
document.getElementById('back-button').addEventListener('click', () => {
    const penultimateSidebar = document.querySelector('.penultimate-sidebar');
    const mainSidebar = document.querySelector('.main-sidebar');
    const initialMessage = document.getElementById('initial-message');
    const carouselContainer = document.getElementById('carousel-container'); // Get the carousel container

    // Show initial message and carousel when going back
    initialMessage.style.display = 'flex';
    carouselContainer.style.display = 'block';

    // Hide the penultimate sidebar by removing the 'show' class
    penultimateSidebar.classList.remove('show');

    // Reset the transform property of the main sidebar to move it back into view
    mainSidebar.style.transform = 'translateX(0)';
});

function togglePenultimateVisibility() {
    const hiddenItems = document.querySelectorAll('.hidden-penultimate');
    const toggleArrow = document.getElementById('toggle-penultimate');
    const penultimateContainer = document.getElementById('penultimate-container');

    // Apply a larger border-radius during the rotation
    toggleArrow.classList.add('rounded'); 

    if (penultimateExpanded) {
        hiddenItems.forEach(item => {
            item.style.opacity = '0';  // Fade out items
            item.classList.remove('visible');  // Remove the fade-in class
        });
        setTimeout(() => {
            hiddenItems.forEach(item => {
                item.style.display = 'none';  // Hide items after fade-out completes
            });
        }, 500);  // Wait for the fade-out animation to finish

        // Rotate back smoothly to 0 degrees, reset border-radius after rotation
        toggleArrow.style.transform = 'rotate(0deg) scale(1.1)';

        setTimeout(() => {
            toggleArrow.classList.remove('rounded');  // Revert to original roundness
        }, 500);  // Delay matches the duration of the rotation (0.5s)

        penultimateContainer.classList.remove('expanded'); 
        penultimateExpanded = false;
    } else {
        penultimateContainer.classList.add('expanded');  // Expand the container smoothly
        toggleArrow.style.transform = 'rotate(180deg) scale(1)';

        // Revert the border-radius back after the rotation is done
        setTimeout(() => {
            toggleArrow.classList.remove('rounded');  // Revert to original roundness
        }, 500);  // Delay matches the duration of the rotation (0.5s)

        // Display and animate the appearance of the hidden items in a staggered fashion
        hiddenItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.display = 'block';  // Make the item block-level
                item.classList.add('visible');  // Trigger the fade-in animation
                item.style.opacity = '1';  // Ensure it's fully visible
            }, index * 100);  // Delay each item by 100ms
        });
        penultimateExpanded = true;
    }
}

// Add the filterBySearch function that hides the carousel during search
function filterBySearch() {
    const searchInput = document.getElementById('search-input').value.toLowerCase().trim();
    const finalCategoryContainer = document.getElementById('final-category-container');
    const initialMessage = document.getElementById('initial-message');
    const categoryItems = document.querySelectorAll('.category-item'); // All category items
    const carouselContainer = document.getElementById('carousel-container'); // Get the carousel container

    // Clear the final category container
    finalCategoryContainer.innerHTML = '';

    if (searchInput) {
        // Hide the initial message and carousel when searching
        initialMessage.style.display = 'none';
        carouselContainer.style.display = 'none';

        // Display search results container
        finalCategoryContainer.style.display = 'grid';
        finalCategoryContainer.classList.add('search-results');

        // Use a Set to avoid duplicates
        const addedCategories = new Set();

        // Filter and show matching categories
        let matchesFound = false;
        categoryItems.forEach(item => {
            const itemName = item.querySelector('.category-name').textContent.toLowerCase().trim();
            if (itemName.includes(searchInput) && !addedCategories.has(itemName)) {
                finalCategoryContainer.appendChild(item.cloneNode(true));
                addedCategories.add(itemName); // Add to Set to prevent duplicates
                matchesFound = true;
            }
        });

        // If no matches found, display a message
        if (!matchesFound) {
            finalCategoryContainer.innerHTML = '<p>No matching categories found.</p>';
        }
    } else {
        // If the search input is cleared, restore the previous state
        finalCategoryContainer.classList.remove('search-results');
        finalCategoryContainer.innerHTML = ''; // Clear search results

        if (lastSelectedPenultimateCategory && lastSelectedCategoryGroup) {
            // If a category was previously selected, restore the penultimate and final categories
            lastSelectedCategoryGroup.style.display = 'block'; // Show the main category group
            selectPenultimateCategory(lastSelectedPenultimateCategory, lastSelectedCategoryGroup.dataset.category);
        } else {
            // If no category was selected, show the initial "Select a Category" message and carousel
            initialMessage.style.display = 'flex';
            carouselContainer.style.display = 'block';  // Show the carousel again
        }
    }
}

// Ensure that the "Clear Search" button functions properly
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');
    const minimizeSearch = document.getElementById('minimize-search');
    const clearSearch = document.getElementById('clear-search');

    if (searchButton && searchBar && searchInput && minimizeSearch && clearSearch) {
        searchButton.addEventListener('click', function() {
            searchBar.classList.add('expanded');
            searchBar.style.display = 'flex';
            searchButton.style.display = 'none';

            setTimeout(() => {
                searchInput.focus();
            }, 300);  // Adjust the delay time if necessary
        });

        minimizeSearch.addEventListener('click', function() {
            searchBar.classList.remove('expanded');
            searchBar.style.display = 'none';
            searchButton.style.display = 'flex';
        });

        searchInput.addEventListener('input', filterBySearch);

        // Clear the search input when "x" is clicked and trigger search restore
        clearSearch.addEventListener('click', function() {
            searchInput.value = '';  // Clear the input
            searchInput.dispatchEvent(new Event('input'));  // Trigger the input event to restore previous information
        });
    } else {
        console.error("One or more elements not found. Please check the IDs and structure of your HTML.");
    }
});

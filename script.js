
let lastSelectedCategory = null; 
let isSearchActive = false; 

function filterCategories(category) {
    const allGroups = document.querySelectorAll('.category-group-container');
    const initialMessage = document.getElementById('initial-message');

    // Hide "Select a Category" message and show the selected category
    if (category) {
        lastSelectedCategory = category; // Store the category selected before searching
        initialMessage.style.display = 'none';
        showCategory(category); // Show the selected category
    }

    // Hide all other categories
    allGroups.forEach(group => {
        if (group.dataset.category !== category) {
            group.style.display = 'none';
        }
    });
}

function showCategory(category) {
    const allGroups = document.querySelectorAll('.category-group-container');
    allGroups.forEach(group => {
        if (group.dataset.category === category) {
            group.style.display = 'block'; // Show the category that matches
        }
    });
}

function toggleSearchBar() {
    const searchButton = document.getElementById('search-button');
    const searchBar = document.getElementById('search-bar');

    if (searchBar.classList.contains('expanded')) {
        searchBar.classList.remove('expanded');
        searchBar.style.display = 'none';
        searchButton.style.display = 'flex';
    } else {
        searchBar.classList.add('expanded');
        searchBar.style.display = 'flex';
        searchButton.style.display = 'none';
    }
}
function filterBySearch() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const categoryGroups = document.querySelectorAll('.category-group-container');
    const initialMessage = document.getElementById('initial-message');
    isSearchActive = !!searchInput; // Update search active flag

    if (searchInput) {
        initialMessage.style.display = 'none'; // Hide the initial message during search
        categoryGroups.forEach(group => {
            let groupMatchFound = false;
            const penultimateGroups = group.querySelectorAll('.category-group');
            
            penultimateGroups.forEach(penultimateGroup => {
                let penultimateMatchFound = false;
                const childItems = penultimateGroup.querySelectorAll('.category-item');

                childItems.forEach(item => {
                    const itemName = item.textContent.toLowerCase();
                    if (itemName.includes(searchInput)) {
                        item.style.display = 'block';
                        penultimateMatchFound = true;
                    } else {
                        item.style.display = 'none';
                    }
                });

                if (penultimateMatchFound) {
                    penultimateGroup.style.display = 'block';
                    groupMatchFound = true;
                } else {
                    penultimateGroup.style.display = 'none';
                }
            });

            if (groupMatchFound) {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });
    } else {
        // Restore state when search input is cleared
        if (lastSelectedCategory) {
            showCategory(lastSelectedCategory); // Restore the last selected category
        } else {
            initialMessage.style.display = 'flex'; // Show "Select a Category" if no category selected
        }
        hideAllCategories(); // Hide all categories except the restored one
    }
}

function hideAllCategories() {
    const categoryGroups = document.querySelectorAll('.category-group-container');
    categoryGroups.forEach(group => {
        if (!isSearchActive && group.dataset.category === lastSelectedCategory) {
            group.style.display = 'block'; // Keep the last selected category visible if search is not active
        } else {
            group.style.display = 'none'; // Hide all other categories
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');
    const minimizeSearch = document.getElementById('minimize-search');

    if (searchButton && searchBar && searchInput && minimizeSearch) {
        searchButton.addEventListener('click', function() {
            searchBar.classList.add('expanded');
            searchBar.style.display = 'flex';
            searchButton.style.display = 'none';
        });

        minimizeSearch.addEventListener('click', function() {
            searchBar.classList.remove('expanded');
            searchBar.style.display = 'none';
            searchButton.style.display = 'flex';
        });

        searchInput.addEventListener('input', filterBySearch);
    } else {
        console.error("One or more elements not found. Please check the IDs and structure of your HTML.");
    }
});

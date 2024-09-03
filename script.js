
function filterCategories(category) {
    const allGroups = document.querySelectorAll('.category-group-container, .category-item');
    const initialMessage = document.getElementById('initial-message');

    // Show the "Select a Category" message when a category is selected from the sidebar
    if (category) {
        initialMessage.style.display = 'none';
    }

    // Toggle visibility of category groups based on selected category
    allGroups.forEach(group => {
        if (group.dataset.category === category) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
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

    if (searchInput) {
        initialMessage.style.display = 'none';
    } else {
        initialMessage.style.display = 'flex';
        hideAllCategories(); // Hide all categories if search is cleared
        return;
    }

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
}

function hideAllCategories() {
    const categoryGroups = document.querySelectorAll('.category-group-container');
    categoryGroups.forEach(group => {
        group.style.display = 'none';
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


let lastSelectedPenultimate = null;
let penultimateExpanded = false;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

let mainCategorySelected = false;

function filterCategories(category) {
    const penultimateContainer = document.getElementById('penultimate-container');
    const finalCategoryContainer = document.getElementById('final-category-container');
    const initialMessage = document.getElementById('initial-message');
    const allCategoryGroups = document.querySelectorAll('.category-group-container');
    const categoryGroup = document.querySelector(`.category-group-container[data-category="${category}"]`);

    // Hide all category groups
    allCategoryGroups.forEach(group => {
        group.style.display = 'none'; // Hide all categories
    });

    // Clear previous penultimate and final category content
    penultimateContainer.innerHTML = '';
    finalCategoryContainer.innerHTML = '';

    if (categoryGroup) {
        // Show the selected category group
        categoryGroup.style.display = 'block';

        // Show the penultimate container and hide the initial message
        penultimateContainer.style.display = 'grid';
        initialMessage.style.display = 'none';

        // Mark the main category as selected
        mainCategorySelected = category;

        // Collect and alphabetize penultimate categories
        const penultimateItems = [...categoryGroup.querySelectorAll('[data-penultimate]')];
        penultimateItems.sort((a, b) => {
            const nameA = capitalizeFirstLetter(a.dataset.penultimate);
            const nameB = capitalizeFirstLetter(b.dataset.penultimate);
            return nameA.localeCompare(nameB);
        });

        // Show only the first 8 penultimate items, hide the rest
        penultimateItems.forEach((penultimate, index) => {
            const penultimateName = penultimate.dataset.penultimate;
            const capitalizedPenultimateName = capitalizeFirstLetter(penultimateName);

            const penultimateButton = document.createElement('button');
            penultimateButton.classList.add('penultimate-button');
            penultimateButton.dataset.penultimate = penultimateName;
            penultimateButton.textContent = capitalizedPenultimateName;
            penultimateButton.onclick = () => selectPenultimateCategory(penultimateName, category);

            if (index < 4) {
                penultimateContainer.appendChild(penultimateButton);
            } else {
                penultimateButton.classList.add('hidden-penultimate');
                penultimateContainer.appendChild(penultimateButton);
            }
        });

        // Add the "arrows_min_2.png" toggle button at the bottom, centered
        if (penultimateItems.length > 8) {
            const toggleButton = document.createElement('img');
            toggleButton.src = 'arrows_min_2.png';
            toggleButton.id = 'toggle-penultimate';
            toggleButton.classList.add('toggle-arrow');
            toggleButton.onclick = togglePenultimateVisibility;
            penultimateContainer.appendChild(toggleButton);
        }
    }
}

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

function selectPenultimateCategory(penultimateName, parentName) {
    // Deselect the last selected penultimate category
    if (lastSelectedPenultimate) {
        lastSelectedPenultimate.classList.remove('active');
    }

    // Select the new penultimate category
    const selectedElement = document.querySelector(`.penultimate-button[data-penultimate="${penultimateName}"]`);
    selectedElement.classList.add('active');
    lastSelectedPenultimate = selectedElement;

    // Mark the penultimate category as selected
    lastSelectedPenultimateCategory = penultimateName;

    // Show final categories related to this penultimate category
    const allGroups = document.querySelectorAll('.category-group[data-penultimate]');
    allGroups.forEach(group => {
        group.style.display = (group.dataset.penultimate === penultimateName) ? 'block' : 'none';
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
    const searchInput = document.getElementById('search-input').value.toLowerCase().trim();
    const categoryGroups = document.querySelectorAll('.category-group-container');
    const penultimateContainer = document.getElementById('penultimate-container');
    const finalCategoryContainer = document.getElementById('final-category-container');
    const initialMessage = document.getElementById('initial-message');

    // Hide the penultimate and final categories containers when search starts
    penultimateContainer.style.display = 'none';
    finalCategoryContainer.style.display = 'none'; // Hide the final category grid
    finalCategoryContainer.innerHTML = ''; // Clear any previously displayed categories

    // Hide all the category-group-container elements (penultimate + final categories)
    categoryGroups.forEach(group => {
        group.style.display = 'none'; // Hide the group container during search
    });

    if (searchInput) {
        // Hide initial message and display the search results
        initialMessage.style.display = 'none';
        finalCategoryContainer.style.display = 'grid'; // Show search results in the grid format
        finalCategoryContainer.classList.add('search-results');

        // Iterate over all category groups and find matching final categories
        categoryGroups.forEach(group => {
            const penultimateGroups = group.querySelectorAll('.category-group');
            penultimateGroups.forEach(penultimateGroup => {
                const childItems = penultimateGroup.querySelectorAll('.category-item');
                childItems.forEach(item => {
                    const itemName = item.querySelector('.category-name').textContent.toLowerCase().trim();
                    if (itemName.includes(searchInput)) {
                        // Append matching items to the final category container (search results)
                        finalCategoryContainer.appendChild(item.cloneNode(true));
                    }
                });
            });
        });

        // If no results are found, show a message
        if (!finalCategoryContainer.hasChildNodes()) {
            finalCategoryContainer.innerHTML = '<p>No matching categories found.</p>';
        }
    } else {
        // Restore previous content when search is cleared (e.g., backspaced)
        finalCategoryContainer.innerHTML = ''; // Clear the search results
        finalCategoryContainer.classList.remove('search-results');

        // Restore the correct state based on previous selections
        if (mainCategorySelected && lastSelectedPenultimateCategory) {
            // If a main category and penultimate category were selected, restore them
            const categoryGroup = document.querySelector(`.category-group-container[data-category="${mainCategorySelected}"]`);
            categoryGroup.style.display = 'block'; // Show the main category group
            penultimateContainer.style.display = 'grid'; // Show penultimate options
            selectPenultimateCategory(lastSelectedPenultimateCategory, mainCategorySelected);
        } else if (mainCategorySelected) {
            // If only a main category was selected, restore it
            const categoryGroup = document.querySelector(`.category-group-container[data-category="${mainCategorySelected}"]`);
            categoryGroup.style.display = 'block'; // Show the main category group
            penultimateContainer.style.display = 'grid'; // Show penultimate options
        } else {
            // If no category was selected, show the initial message
            initialMessage.style.display = 'flex';
        }
    }
}

function hideAllCategories() {
    const categoryGroups = document.querySelectorAll('.category-group-container');
    categoryGroups.forEach(group => {
        group.style.display = 'none';
    });
}

let tooltipTimeout;
let isHovering = false; // Flag to track hover state

function showTooltip(event) {
    if (!isHovering) return; // Only show tooltip if hovering
    const tooltip = document.getElementById('tooltip');
    
    // Set tooltip position centered at the bottom of the cursor
    const tooltipX = event.pageX - (tooltip.offsetWidth / 2); // Center horizontally
    const tooltipY = event.pageY + 20; // Position slightly below the cursor

    tooltip.style.left = tooltipX + 'px';
    tooltip.style.top = tooltipY + 'px';

    // Show tooltip after 0.3s delay
    tooltipTimeout = setTimeout(() => {
        if (isHovering) { // Ensure tooltip only appears if still hovering
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        }
    }, 300); // 0.3 seconds delay
}

function hideTooltip() {
    clearTimeout(tooltipTimeout); // Clear any pending timeout
    const tooltip = document.getElementById('tooltip');
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = '0';
}

document.addEventListener('DOMContentLoaded', function() {
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.classList.add('tooltip');
    tooltip.textContent = 'Click to View More';
    document.body.appendChild(tooltip);

    // Use event delegation to handle dynamically added toggle-arrow elements
    document.addEventListener('mouseenter', function(event) {
        if (event.target && event.target.id === 'toggle-penultimate') {
            isHovering = true; // Set hover flag to true
            showTooltip(event);
        }
    }, true);

    document.addEventListener('mousemove', function(event) {
        if (event.target && event.target.id === 'toggle-penultimate') {
            showTooltip(event);
        }
    }, true);

    document.addEventListener('mouseleave', function(event) {
        if (event.target && event.target.id === 'toggle-penultimate') {
            isHovering = false; // Set hover flag to false
            hideTooltip();
        }
    }, true);
});

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

            // Delay focusing the input to allow the search bar to fully expand
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
    } else {
        console.error("One or more elements not found. Please check the IDs and structure of your HTML.");
    }
});
    

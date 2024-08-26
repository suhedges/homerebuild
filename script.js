
function filterCategories(category) {
    const allGroups = document.querySelectorAll('.category-group-container, .category-item');
    allGroups.forEach(group => {
        if (category === 'all' || group.dataset.category === category) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });
}
    
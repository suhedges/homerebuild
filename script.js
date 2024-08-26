
function filterCategories(category) {
    const allGroups = document.querySelectorAll('.category-group-container, .category-item');
    const initialMessage = document.getElementById('initial-message');

    if (category) {
        initialMessage.style.display = 'none';
    }

    allGroups.forEach(group => {
        if (group.dataset.category === category) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });
}
    

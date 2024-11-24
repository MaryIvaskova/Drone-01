export const FiltersHandler = (() => {
    const categoryFilter = document.getElementById("category-filter");
    const searchBar = document.getElementById("search-bar");

    function applyFilters(items) {
        const category = categoryFilter.value;
        const searchQuery = searchBar.value.toLowerCase();

        return items.filter(item => {
            const matchesCategory = category === "all" || item.category === category;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });
    }

    function onFilterChange(callback) {
        categoryFilter.addEventListener("change", callback);
        searchBar.addEventListener("input", callback);
    }

    return { applyFilters, onFilterChange };
})();
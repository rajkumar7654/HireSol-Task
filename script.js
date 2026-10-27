const API_URL = "https://dummyjson.com/products?limit=0";

const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const minPriceInput = document.querySelector("#min-price");
const maxPriceInput = document.querySelector("#max-price");
const sortSelect = document.querySelector("#sort");

const clearButton = document.querySelector("#clear-btn");
const emptyClearButton = document.querySelector("#empty-clear-btn");

const productGrid = document.querySelector("#product-grid");
const productCount = document.querySelector("#product-count");

const loading = document.querySelector("#loading");
const errorMessage = document.querySelector("#error");
const emptyState = document.querySelector("#empty-state");

let products = [];



//Get Products from API
async function getProducts() {

    try {

        loading.classList.remove("hidden");
        errorMessage.classList.add("hidden");

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        products = data.products;

        createCategoryOptions();

        renderProducts();

    } catch (error) {

        console.error(error);

        loading.classList.add("hidden");
        errorMessage.classList.remove("hidden");

    }
}



//Category Options
function createCategoryOptions() {

    const categories = [...new Set(
        products.map(product => product.category)
    )];

    categories.sort();

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = formatCategory(category);

        categorySelect.appendChild(option);

    });
}


//Format Category
function formatCategory(category) {

    return category
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


//Filter Products
function getFilteredProducts() {

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const selectedCategory = categorySelect.value;

    const minPrice = Number(minPriceInput.value);

    const maxPrice = Number(maxPriceInput.value);


    let filteredProducts = products.filter(product => {

        const matchesSearch = product.title.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        const matchesMinPrice = minPriceInput.value === "" || product.price >= minPrice;
        const matchesMaxPrice = maxPriceInput.value === "" ||product.price <= maxPrice;


        return (
            matchesSearch &&
            matchesCategory &&
            matchesMinPrice &&
            matchesMaxPrice
        );

    });


    return sortProducts(filteredProducts);
}


//Sort Products
function sortProducts(productList) {

    const sortValue = sortSelect.value;

    const sortedProducts = [...productList];

    if (sortValue === "price-low") {

        sortedProducts.sort((a, b) => a.price - b.price);

    }

    else if (sortValue === "price-high") {

        sortedProducts.sort((a, b) => b.price - a.price);

    }

    else if (sortValue === "rating-high") {

        sortedProducts.sort((a, b) => b.rating - a.rating);

    }

    else if (sortValue === "rating-low") {

        sortedProducts.sort((a, b) => a.rating - b.rating);

    }

    return sortedProducts;
}


//Render Products

function renderProducts() {

    const filteredProducts = getFilteredProducts();

    loading.classList.add("hidden");

    productGrid.innerHTML = "";

    productCount.textContent =`${filteredProducts.length} products`;


    /* Empty State */

    if (filteredProducts.length === 0) {

        emptyState.classList.remove("hidden");

        return;
    }

    emptyState.classList.add("hidden");


    /* Create Cards */

    filteredProducts.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <img
                class="product-image"
                src="${product.thumbnail}"
                alt="${product.title}"
                loading="lazy"
            >

            <div class="product-content">

                <span class="product-category">
                    ${formatCategory(product.category)}
                </span>

                <h3 class="product-title">
                    ${product.title}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <span class="product-price">
                        $${product.price.toFixed(2)}
                    </span>

                    <span class="product-rating">
                        ★ ${product.rating}
                    </span>

                </div>

            </div>
        `;

        productGrid.appendChild(card);

    });
}



//Clear Filters
function clearFilters() {

    searchInput.value = "";

    categorySelect.value = "all";

    minPriceInput.value = "";

    maxPriceInput.value = "";

    sortSelect.value = "default";

    renderProducts();
}


//Event Listeners
searchInput.addEventListener("input",renderProducts);

categorySelect.addEventListener("change",renderProducts);

minPriceInput.addEventListener("input",renderProducts);

maxPriceInput.addEventListener("input",renderProducts);

sortSelect.addEventListener("change",renderProducts);

clearButton.addEventListener("click",clearFilters);

emptyClearButton.addEventListener("click",clearFilters);



getProducts();
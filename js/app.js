document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('product-grid');

    const categoryTranslations = {
        "electronics": "Електроніка",
        "jewelery": "Прикраси",
        "men's clothing": "Чоловічий одяг",
        "women's clothing": "Жіночий одяг"
    };

    const cartSvg = `
        <svg class="cart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
    `;

    let categoriesList = [];
    let currentCategoryIndex = 0;

    // Оновлення стану активної вкладки
    function updateActiveTab() {
        const navItems = document.querySelectorAll('.nav-list .nav-item:not(.nav-arrow)');

        navItems.forEach((item, index) => {
            if (index === currentCategoryIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Отримання товарів
    async function fetchProducts(categoryName = null) {
        try {
            gridContainer.innerHTML = '<div class="loader">Завантаження товарів...</div>';

            let url = 'https://fakestoreapi.com/products/';
            if (categoryName) {
                url = `https://fakestoreapi.com/products/category/${categoryName}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Помилка мережі');

            const data = await response.json();
            const products = Array.isArray(data) ? data : [data];

            renderProducts(products);
        } catch (error) {
            gridContainer.innerHTML = `<div class="loader" style="color: red;">Помилка завантаження даних: ${error.message}</div>`;
        }
    }

    // Отримання списку категорій
    async function fetchCategories() {
        try {
            const response = await fetch('https://fakestoreapi.com/products/categories');
            if (!response.ok) throw new Error('Помилка мережі');

            const categories = await response.json();
            renderCategories(categories);
        } catch (error) {
            console.error('Помилка завантаження категорій:', error);
        }
    }

    // Рендер навігації
    function renderCategories(categories) {
        const navList = document.querySelector('.nav-list');
        navList.innerHTML = '';

        categoriesList = [null, ...categories];

        const allProductsItem = document.createElement('li');
        allProductsItem.className = 'nav-item active';
        allProductsItem.innerHTML = `<a href="#">Усі товари</a>`;
        allProductsItem.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategoryIndex = 0;
            updateActiveTab();
            fetchProducts();
        });
        navList.appendChild(allProductsItem);

        categories.forEach((category, index) => {
            const translatedName = categoryTranslations[category] || category;

            const li = document.createElement('li');
            li.className = 'nav-item';
            li.innerHTML = `<a href="#">${translatedName}</a>`;

            li.addEventListener('click', (e) => {
                e.preventDefault();
                currentCategoryIndex = index + 1;
                updateActiveTab();
                fetchProducts(category);
            });

            navList.appendChild(li);
        });

        const arrowItem = document.createElement('li');
        arrowItem.className = 'nav-item nav-arrow';
        arrowItem.innerHTML = `<a href="#">&gt;</a>`;

        arrowItem.addEventListener('click', (e) => {
            e.preventDefault();

            currentCategoryIndex = (currentCategoryIndex + 1) % categoriesList.length;
            updateActiveTab();

            const nextCategory = categoriesList[currentCategoryIndex];
            fetchProducts(nextCategory);
        });

        navList.appendChild(arrowItem);
    }

    // Рендер карток товарів
    function renderProducts(products) {
        gridContainer.innerHTML = '';

        products.forEach(product => {
            const mockPriceUAH = Math.round(product.price * 40);

            const card = document.createElement('article');
            card.className = 'product-card';

            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
                <h3 class="product-title" title="${product.title}">${product.title}</h3>
                <div class="product-bottom">
                    <span class="product-price">${mockPriceUAH} ГРН</span>
                    ${cartSvg}
                </div>
                <button class="btn-details">Детальніше</button>
            `;

            gridContainer.appendChild(card);
        });
    }

    // Ініціалізація
    fetchProducts();
    fetchCategories();
});
(() => {
    const PRODUCT_API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    const CAROUSEL_STORAGE_KEY = "productCarouselData";

    const GAP_SIZE = 10;  
    const ITEMS_PER_VIEW = 6.5;  
    const ITEMS_PER_VIEW_LARGER_TABLET = 4.5;
    const ITEMS_PER_VIEW_TABLET = 3.5;
    const ITEMS_PER_VIEW_MOBILE = 2.5;

    const init = async () => {
        const products = await fetchProductData();
        buildHTML(products);
        buildCSS();
        setEvents(products);
        restoreFavorites();
    };

    const fetchProductData = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem(CAROUSEL_STORAGE_KEY));
            if (storedData && Array.isArray(storedData.products)) {
                return storedData.products;
            }
        } catch (error) {
            console.warn("Error reading from localStorage:", error);
        }
    
        try {
            const response = await fetch(PRODUCT_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const products = await response.json();
    
            localStorage.setItem(CAROUSEL_STORAGE_KEY, JSON.stringify({ products }));
            return products;
        } catch (error) {
            console.error("Error fetching product data:", error);
            return []; 
        }
    };

    const buildHTML = (products) => {
        const carouselHTML = `
            <div class="wrapper-carousel">
                <p class="title">You Might Also Like</p>
                <div class="carousel-wrapper">
                    <button class="arrow-carousel left-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242">
                            <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path>
                        </svg>
                    </button>
                    <div class="carousel-track">
                        ${products.map(product => buildProductHTML(product)).join("")}
                    </div>
                    <button class="arrow-carousel right-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242">
                            <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        $(".product-detail").after(carouselHTML);
    };

    const buildProductHTML = (product) => {
        const formattedPrice = String(product.price).replace('.', ',');  
        return `
            <div class="carousel-item" data-id="${product.id}">
                <a href="${product.url}" target="_blank">
                    <img src="${product.img}" alt="${product.name}" />
                    <div class="card">
                        <p class="name">${product.name}</p>
                        <p class="price">${formattedPrice} TL</p>
                    </div>
                </a>
                <button class="favorite-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heart-icon">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
        `;
    };

    const buildCSS = () => {
        const css = `
            .wrapper-carousel {
                background-color: #FAF9F7;
                padding: 0 15rem 0;
                box-sizing: border-box;
            }

            .title {
                font-size: 32px;
                padding: 15px 0;
                text-align: left;
            }

            .carousel-wrapper {
                position: relative;
                overflow: hidden;
                display: flex;
                padding-bottom: 24px;
            }

            .arrow-carousel {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                transform-origin: center;
                width: 40px;
                height: 40px;
                background: #fff;
                color: rgb(51, 51, 51);
                border: none;
                border-radius: 50%;
                padding: 10px;
                cursor: pointer;
                z-index: 10;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .arrow-carousel.left-arrow {
                left: 10px;
            }

            .arrow-carousel.right-arrow {
                transform: translateY(-50%) rotate(180deg);
                right: 10px;
            }

            .carousel-track {
                display: flex;
                gap: ${GAP_SIZE}px;
                transition: transform 0.3s ease-in-out;
            }

            .carousel-item {
                background-color: #fff;
                flex: 0 0 calc((100% - (${GAP_SIZE}px * (${ITEMS_PER_VIEW} - 1))) / ${ITEMS_PER_VIEW});
                box-sizing: border-box;
                text-align: left;
                position: relative;
            }

            .carousel-item img {
                width: 100%;
                height: auto;
                margin-bottom: 5px;
            }

            .carousel-item a, .carousel-item a:hover {
                color: black;
                text-decoration: none;
            }

            .favorite-btn {
                width: 34px;
                height: 34px;
                background-color: #fff;
                border: solid .5px #b6b7b9;
                border-radius: 5px;
                font-size: 18px;
                color: gray;
                position: absolute;
                top: 9px;
                right: 15px;
                padding: 5px;
                box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .16);
                transition: all 0.3s ease;
            }

            .favorite-btn.favorited {
                border-color: #888;
            }

            .favorite-btn:hover {
                border-color: #888;
                box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
            }

            .favorite-btn.favorited .heart-icon {
                fill: #193db0;
                stroke: none;
            }

            .card {
                margin: 0 10px;
            }

            .name {
                font-size: 14px;
                height: 70px;
            }

            .price {
                font-size: 18px;
                color: #193db0;
                height: 50px;
            }
             /* Responsive Design */
            @media (max-width: 1024px) {
                .wrapper-carousel {
                    padding: 0 3rem;
                }
                .carousel-item {
                    flex: 0 0 calc((100% - (${GAP_SIZE}px * (${ITEMS_PER_VIEW_LARGER_TABLET} - 1))) / ${ITEMS_PER_VIEW_LARGER_TABLET});
                }
            }

            @media (max-width: 768px) {
                .wrapper-carousel {
                    padding: 0 2rem;
                }
                .carousel-item {
                    flex: 0 0 calc((100% - (${GAP_SIZE}px * (${ITEMS_PER_VIEW_TABLET} - 1))) / ${ITEMS_PER_VIEW_TABLET});
                }
            }

            @media (max-width: 480px) {
                .wrapper-carousel {
                    padding: 0 1rem;
                }
                .carousel-item {
                    flex: 0 0 calc((100% - (${GAP_SIZE}px * (${ITEMS_PER_VIEW_MOBILE} - 1))) / ${ITEMS_PER_VIEW_MOBILE}); 
                }
            }

        `;

        $("<style>").addClass("carousel-style").html(css).appendTo("head");
    };

    const setEvents = (products) => {
        let currentIndex = 0;
        const productCount = products.length;
        const $track = $(".carousel-track");
        const $leftArrow = $(".left-arrow");
        const $rightArrow = $(".right-arrow");

        const perView = getItemsPerView();

        const updateTrackPosition = () => {
            const offset = -(currentIndex * (100 / perView));
            $track.css("transform", `translateX(${offset}%)`);
        };

        $leftArrow.on("click", () => {
            if (currentIndex > 0) {
                currentIndex -= 1;
                updateTrackPosition();
            }
        });

        $rightArrow.on("click", () => {
            if (currentIndex < productCount - perView) {
                currentIndex += 1;
                updateTrackPosition();
            }
        });

        $(".favorite-btn").on("click", function () {
            const $button = $(this);
            const $item = $button.closest(".carousel-item");
            const productId = $item.data("id");

            $button.toggleClass("favorited");

            const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            if ($button.hasClass("favorited")) {
                favorites.push(productId);
            } else {
                const index = favorites.indexOf(productId);
                if (index > -1) {
                    favorites.splice(index, 1);
                }
            }

            localStorage.setItem("favorites", JSON.stringify(favorites));
        });
    };

    const restoreFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        favorites.forEach(productId => {
            $(`.carousel-item[data-id="${productId}"] .favorite-btn`).addClass("favorited");
        });
    };

    const getItemsPerView = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) {
            return ITEMS_PER_VIEW_MOBILE; 
        } else if (screenWidth <= 768) {
            return ITEMS_PER_VIEW_TABLET; 
        } else if (screenWidth <= 1024) {
            return ITEMS_PER_VIEW_LARGER_TABLET; 
        } else {
            return ITEMS_PER_VIEW; 
        }
    };

    init();
})();

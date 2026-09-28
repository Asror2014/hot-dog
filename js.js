/* =====================================================
   DANARCI
   Bitta sahifadagi barcha funksiyalar
===================================================== */


/* ================= PRODUCTS ================= */

const products = [

    {
        id: 1,
        name: "DANARCI Doner",
        price: 35000,
        category: "doner",
        image: "🌯",
        description: "Mazali go‘shtli doner"
    },

    {
        id: 2,
        name: "Maxsus Doner",
        price: 45000,
        category: "doner",
        image: "🌯",
        description: "DANARCI maxsus doneri"
    },

    {
        id: 3,
        name: "Tovuq Doner",
        price: 32000,
        category: "doner",
        image: "🍗",
        description: "Yumshoq tovuqli doner"
    },

    {
        id: 4,
        name: "DANARCI Lavash",
        price: 30000,
        category: "lavash",
        image: "🥙",
        description: "Yangi tayyorlangan lavash"
    },

    {
        id: 5,
        name: "Cheese Lavash",
        price: 38000,
        category: "lavash",
        image: "🥙",
        description: "Pishloqli mazali lavash"
    },

    {
        id: 6,
        name: "Chicken Burger",
        price: 30000,
        category: "burger",
        image: "🍔",
        description: "Tovuqli burger"
    },

    {
        id: 7,
        name: "Cheese Burger",
        price: 35000,
        category: "burger",
        image: "🍔",
        description: "Pishloqli burger"
    },

    {
        id: 8,
        name: "Kartoshka Fri",
        price: 18000,
        category: "fri",
        image: "🍟",
        description: "Qarsildoq kartoshka"
    },

    {
        id: 9,
        name: "Coca Cola",
        price: 10000,
        category: "drink",
        image: "🥤",
        description: "Sovuq Coca Cola"
    },

    {
        id: 10,
        name: "Fanta",
        price: 10000,
        category: "drink",
        image: "🥤",
        description: "Sovuq Fanta"
    },

    {
        id: 11,
        name: "Pepsi",
        price: 10000,
        category: "drink",
        image: "🥤",
        description: "Sovuq Pepsi"
    },

    {
        id: 12,
        name: "DANARCI Combo",
        price: 60000,
        category: "doner",
        image: "🍱",
        description: "Doner + fri + ichimlik"
    }

];


/* ================= STATE ================= */

let cart = JSON.parse(
    localStorage.getItem("danarci_cart")
) || [];

let selectedLocation =
    JSON.parse(
        localStorage.getItem("danarci_location")
    ) || null;


/* ================= FORMAT PRICE ================= */

function formatPrice(price) {

    return new Intl.NumberFormat("uz-UZ").format(price)
        + " so‘m";

}


/* ================= SAVE CART ================= */

function saveCart() {

    localStorage.setItem(
        "danarci_cart",
        JSON.stringify(cart)
    );

}


/* ================= CART COUNT ================= */

function updateCartCount() {

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const badge =
        document.getElementById("cartCount");

    if (badge) {
        badge.textContent = count;
    }

}


/* ================= PRODUCTS RENDER ================= */

function renderProducts(category = "all") {

    const container =
        document.getElementById("products");

    if (!container) return;

    const filtered = category === "all"
        ? products
        : products.filter(
            product => product.category === category
        );

    container.innerHTML = "";

    filtered.forEach(product => {

        const card = document.createElement("div");

        card.className = "product";

        card.innerHTML = `

            <div class="product-image">
                ${product.image}
            </div>

            <div class="product-info">

                <h3>${product.name}</h3>

                <p>
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <span class="price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-btn"
                        onclick="addToCart(${product.id})"
                    >
                        +
                    </button>

                </div>

            </div>

        `;

        container.appendChild(card);

    });

}


/* ================= ADD TO CART ================= */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) return;

    const existing =
        cart.find(
            item => item.id === productId
        );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id: product.id,
            quantity: 1
        });

    }

    saveCart();
    updateCartCount();
    renderCart();

    showToast(
        `${product.name} savatga qo‘shildi!`
    );

}


/* ================= CHANGE QUANTITY ================= */

function changeQuantity(productId, amount) {

    const item =
        cart.find(
            item => item.id === productId
        );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        cart = cart.filter(
            item => item.id !== productId
        );

    }

    saveCart();

    updateCartCount();
    renderCart();

}


/* ================= REMOVE ================= */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

    updateCartCount();
    renderCart();

}


/* ================= TOTAL ================= */

function getCartTotal() {

    return cart.reduce(
        (total, cartItem) => {

            const product =
                products.find(
                    item => item.id === cartItem.id
                );

            if (!product) return total;

            return total +
                product.price * cartItem.quantity;

        },
        0
    );

}


/* ================= CART RENDER ================= */

function renderCart() {

    const container =
        document.getElementById("cartItems");

    if (!container) return;

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <div>🛒</div>

                <h3>Savat bo‘sh</h3>

                <p>
                    Menyudan mahsulot tanlang.
                </p>

                <br>

                <a
                    href="#menu"
                    class="btn primary"
                >
                    Menyuga o'tish
                </a>

            </div>

        `;

        updateTotals();

        return;
    }


    container.innerHTML = "";

    cart.forEach(cartItem => {

        const product =
            products.find(
                item => item.id === cartItem.id
            );

        if (!product) return;

        const item =
            document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `

            <div class="cart-item-image">
                ${product.image}
            </div>

            <div class="cart-item-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${formatPrice(
                        product.price
                    )}
                </p>

            </div>

            <div class="quantity">

                <button
                    onclick="changeQuantity(
                        ${product.id},
                        -1
                    )"
                >
                    −
                </button>

                <strong>
                    ${cartItem.quantity}
                </strong>

                <button
                    onclick="changeQuantity(
                        ${product.id},
                        1
                    )"
                >
                    +
                </button>

            </div>

            <button
                class="remove-btn"
                onclick="removeFromCart(
                    ${product.id}
                )"
            >
                🗑️
            </button>

        `;

        container.appendChild(item);

    });

    updateTotals();

}


/* ================= TOTALS ================= */

function updateTotals() {

    const total = getCartTotal();

    const cartTotal =
        document.getElementById("cartTotal");

    const delivery =
        document.getElementById("deliveryPrice");

    const final =
        document.getElementById("finalTotal");


    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(total);

    }


    /*
       Hozircha bepul yetkazib berish.
       Keyinchalik masofaga qarab hisoblash mumkin.
    */

    const deliveryPrice = 0;

    if (delivery) {

        delivery.textContent =
            formatPrice(deliveryPrice);

    }

    if (final) {

        final.textContent =
            formatPrice(
                total + deliveryPrice
            );

    }

}


/* ================= CATEGORY ================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(".category");

        if (!button) return;

        document
            .querySelectorAll(".category")
            .forEach(btn =>
                btn.classList.remove("active")
            );

        button.classList.add("active");

        renderProducts(
            button.dataset.category
        );

    }
);


/* ================= MOBILE MENU ================= */

const menuBtn =
    document.getElementById("menuBtn");

const nav =
    document.getElementById("nav");

if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        () => {

            nav.classList.toggle("open");

        }
    );

}


document
    .querySelectorAll("nav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                nav.classList.remove("open");

            }
        );

    });


/* ================= MAP ================= */

let map = null;
let marker = null;


/*
   Bu koordinata faqat boshlang‘ich xarita nuqtasi.
   Keyin restoraningiz joylashuviga almashtirishingiz mumkin.
*/

const defaultLat = 39.6542;
const defaultLng = 66.9597;


function initMap() {

    const mapElement =
        document.getElementById("mapArea");

    if (!mapElement) return;

    if (typeof L === "undefined") {

        console.error(
            "Leaflet yuklanmadi."
        );

        return;

    }

    map = L.map("mapArea")
        .setView(
            [defaultLat, defaultLng],
            13
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                "&copy; OpenStreetMap"
        }
    ).addTo(map);


    map.on(
        "click",
        function(event) {

            setLocation(
                event.latlng.lat,
                event.latlng.lng
            );

        }
    );


    if (selectedLocation) {

        setLocation(
            selectedLocation.lat,
            selectedLocation.lng,
            false
        );

    }

}


/* ================= SET LOCATION ================= */

function setLocation(
    lat,
    lng,
    save = true
) {

    if (!map) return;

    if (marker) {

        marker.setLatLng(
            [lat, lng]
        );

    } else {

        marker =
            L.marker(
                [lat, lng]
            ).addTo(map);

    }

    map.setView(
        [lat, lng],
        15
    );


    selectedLocation = {
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6))
    };


    if (save) {

        localStorage.setItem(
            "danarci_location",
            JSON.stringify(
                selectedLocation
            )
        );

    }


    updateLocationText();

}


/* ================= LOCATION TEXT ================= */

function updateLocationText() {

    const coordinates =
        document.getElementById("coordinates");

    const locationText =
        document.getElementById("locationText");


    if (!selectedLocation) {

        if (coordinates) {

            coordinates.textContent =
                "Hali tanlanmagan";

        }

        if (locationText) {

            locationText.textContent =
                "Xarita orqali manzil tanlanmagan";

        }

        return;

    }


    const text =
        `${selectedLocation.lat}, ${selectedLocation.lng}`;


    if (coordinates) {

        coordinates.textContent = text;

    }

    if (locationText) {

        locationText.textContent =
            `Joy tanlandi: ${text}`;

    }

}


/* ================= MY LOCATION ================= */

const myLocation =
    document.getElementById("myLocation");

if (myLocation) {

    myLocation.addEventListener(
        "click",
        function() {

            if (!navigator.geolocation) {

                alert(
                    "Brauzeringiz joylashuvni qo‘llab-quvvatlamaydi."
                );

                return;

            }

            navigator.geolocation.getCurrentPosition(

                function(position) {

                    setLocation(
                        position.coords.latitude,
                        position.coords.longitude
                    );

                },

                function() {

                    alert(
                        "Joylashuvni olishga ruxsat berilmadi."
                    );

                }

            );

        }
    );

}


/* ================= CLEAR LOCATION ================= */

const clearLocation =
    document.getElementById("clearLocation");

if (clearLocation) {

    clearLocation.addEventListener(
        "click",
        function() {

            selectedLocation = null;

            localStorage.removeItem(
                "danarci_location"
            );

            if (marker && map) {

                map.removeLayer(marker);
                marker = null;

            }

            updateLocationText();

        }
    );

}


/* ================= ORDER ================= */

const orderForm =
    document.getElementById("orderForm");

if (orderForm) {

    orderForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "Avval menyudan mahsulot tanlang!"
                );

                location.hash = "menu";

                return;

            }


            const name =
                document
                    .getElementById("customerName")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("customerPhone")
                    .value
                    .trim();


            const address =
                document
                    .getElementById("customerAddress")
                    .value
                    .trim();


            const payment =
                document.querySelector(
                    'input[name="payment"]:checked'
                ).value;


            if (!name || !phone || !address) {

                alert(
                    "Iltimos, barcha ma'lumotlarni kiriting."
                );

                return;

            }


            const order = {

                id:
                    "DN-" +
                    Date.now(),

                date:
                    new Date().toLocaleString(
                        "uz-UZ"
                    ),

                customer: {

                    name,
                    phone,
                    address

                },

                location:
                    selectedLocation,

                payment,

                items: cart.map(item => {

                    const product =
                        products.find(
                            p =>
                                p.id === item.id
                        );

                    return {

                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: item.quantity,
                        image: product.image

                    };

                }),

                total:
                    getCartTotal()

            };


            localStorage.setItem(
                "danarci_order",
                JSON.stringify(order)
            );


            renderReceipt();


            alert(
                "Buyurtmangiz qabul qilindi! ✅"
            );


            location.hash = "receipt";

        }
    );

}


/* ================= RECEIPT ================= */

function renderReceipt() {

    const box =
        document.getElementById("receiptBox");

    if (!box) return;


    const order =
        JSON.parse(
            localStorage.getItem(
                "danarci_order"
            )
        );


    if (!order) return;


    let productsHTML = "";


    order.items.forEach(item => {

        const itemTotal =
            item.price * item.quantity;


        productsHTML += `

            <div class="receipt-row">

                <span>
                    ${item.image}
                    ${item.name}
                    × ${item.quantity}
                </span>

                <strong>
                    ${formatPrice(itemTotal)}
                </strong>

            </div>

        `;

    });


    const locationHTML =
        order.location

            ? `${order.location.lat},
               ${order.location.lng}`

            : "Tanlanmagan";


    box.innerHTML = `

        <div class="receipt-header">

            <h2>🍔 DANARCI</h2>

            <p>
                BUYURTMA CHEKI
            </p>

            <small>
                ${order.date}
            </small>

        </div>


        <div class="receipt-customer">

            <div class="receipt-row">

                <span>Buyurtma raqami</span>

                <strong>
                    ${order.id}
                </strong>

            </div>

            <div class="receipt-row">

                <span>Mijoz</span>

                <strong>
                    ${order.customer.name}
                </strong>

            </div>

            <div class="receipt-row">

                <span>Telefon</span>

                <strong>
                    ${order.customer.phone}
                </strong>

            </div>

            <div class="receipt-row">

                <span>Manzil</span>

                <strong>
                    ${order.customer.address}
                </strong>

            </div>

            <div class="receipt-row">

                <span>To‘lov</span>

                <strong>
                    ${order.payment}
                </strong>

            </div>

            <div class="receipt-row">

                <span>📍 Xarita</span>

                <strong>
                    ${locationHTML}
                </strong>

            </div>

        </div>


        <div class="receipt-products">

            ${productsHTML}

        </div>


        <div class="receipt-total">

            <span>JAMI</span>

            <strong>
                ${formatPrice(order.total)}
            </strong>

        </div>


        <div class="receipt-actions">

            <button
                class="btn primary"
                onclick="printReceipt()"
            >
                🖨️ Chop etish
            </button>

            <button
                class="btn secondary"
                onclick="newOrder()"
            >
                🔄 Yangi buyurtma
            </button>

        </div>

    `;

}


/* ================= PRINT ================= */

function printReceipt() {

    window.print();

}


/* ================= NEW ORDER ================= */

function newOrder() {

    localStorage.removeItem(
        "danarci_order"
    );

    cart = [];

    saveCart();

    updateCartCount();
    renderCart();

    location.hash = "menu";

}


/* ================= TOAST ================= */

function showToast(message) {

    const oldToast =
        document.querySelector(".toast");

    if (oldToast) {
        oldToast.remove();
    }


    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;


    Object.assign(
        toast.style,
        {

            position: "fixed",
            right: "20px",
            bottom: "20px",
            zIndex: "99999",

            padding: "15px 20px",

            background: "#222",
            color: "white",

            borderRadius: "12px",

            boxShadow:
                "0 10px 30px rgba(0,0,0,.2)",

            fontWeight: "bold"

        }
    );


    document.body.appendChild(toast);


    setTimeout(
        () => toast.remove(),
        2500
    );

}


/* ================= LANGUAGE ================= */

const translations = {

    uz: {

        menu: "Menyu",
        cart: "Savat",
        order: "Buyurtma",
        map: "Xarita",
        receipt: "Chek",
        about: "Biz haqimizda",
        contact: "Aloqa"

    },

    ru: {

        menu: "Меню",
        cart: "Корзина",
        order: "Заказ",
        map: "Карта",
        receipt: "Чек",
        about: "О нас",
        contact: "Контакты"

    }

};


function setLanguage(language) {

    localStorage.setItem(
        "danarci_language",
        language
    );

    document.documentElement.lang =
        language;


    const links =
        document.querySelectorAll(
            "nav a"
        );


    if (links.length >= 8) {

        if (language === "ru") {

            links[1].textContent =
                "Меню";

            links[2].childNodes[0].textContent =
                "Корзина ";

            links[3].textContent =
                "Заказ";

            links[4].textContent =
                "Карта";

            links[5].textContent =
                "Чек";

            links[6].textContent =
                "О нас";

            links[7].textContent =
                "Контакты";

        } else {

            links[1].textContent =
                "Menyu";

            links[2].childNodes[0].textContent =
                "Savat ";

            links[3].textContent =
                "Buyurtma";

            links[4].textContent =
                "Xarita";

            links[5].textContent =
                "Chek";

            links[6].textContent =
                "Biz haqimizda";

            links[7].textContent =
                "Aloqa";

        }

    }

}


const uzBtn =
    document.getElementById("uzBtn");

const ruBtn =
    document.getElementById("ruBtn");


if (uzBtn) {

    uzBtn.addEventListener(
        "click",
        () => setLanguage("uz")
    );

}

if (ruBtn) {

    ruBtn.addEventListener(
        "click",
        () => setLanguage("ru")
    );

}


/* ================= START ================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderProducts();
        renderCart();

        updateCartCount();
        updateLocationText();
        renderReceipt();

        initMap();

        const savedLanguage =
            localStorage.getItem(
                "danarci_language"
            ) || "uz";

        setLanguage(savedLanguage);

    }
);
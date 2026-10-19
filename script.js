// ==========================================
// AIRNEST A1 - JAVASCRIPT
// ==========================================


// ==========================================
// 1. DỮ LIỆU SẢN PHẨM
// ==========================================

// Đường dẫn dựa trên cấu trúc thư mục VS Code.
// Cần đổi tên ảnh đúng như hướng dẫn ở Bước 1.

const defaultProducts = [

    {
        id: 1,
        name: "Máy Lọc Không Khí AIRNEST A1 ",
        category: "may-loc-khong-khi",
        price: 3490000,
        img: "assets/images/products/may-loc-khong-khi/may-loc-1.jpg",
        desc: "Máy lọc không khí AIRNEST A1 ."
    },

    {
        id: 2,
        name: "Lõi Lọc AIRNEST A1",
        category: "may-loc-khong-khi",
        price: 890000,
        img: "assets/images/products/loi-loc-hepa/loi-loc-2.jpg",
        desc: "Máy lọc không khí thiết kế nhỏ gọn."
    },

    {
        id: 3,
        name: "Máy Lọc Không Khí AIRNEST A2",
        category: "may-loc-khong-khi",
        price: 1890000,
        img: "assets/images/products/may-loc-khong-khi/may-loc-3.jpg",
        desc: "Máy lọc không khí mini dành cho không gian nhỏ."
    },

    {
        id: 4,
        name: "Lõi Lọc AIRNEST A2",
        category: "loi-loc-hepa",
        price: 490000,
        img: "assets/images/products/loi-loc-hepa/loi-loc-1.jpg",
        desc: "Lõi lọc HEPA dành cho máy lọc AIRNEST A1."
    }

];


// ==========================================
// 2. LOCAL STORAGE
// ==========================================

function readStorage(key, fallback) {

    try {

        const value = localStorage.getItem(key);

        return value
            ? JSON.parse(value)
            : fallback;

    } catch (error) {

        return fallback;

    }

}


// Sản phẩm được lưu để giữ thay đổi từ Admin.

let products = readStorage(
    "airnest_products_v2",
    defaultProducts
);

let cart = readStorage(
    "airnest_cart",
    []
);

let favorites = readStorage(
    "airnest_favs",
    []
);

let orders = readStorage(
    "airnest_orders",
    []
);

let currentUser = readStorage(
    "airnest_user",
    null
);

let currentCat = "all";


// ==========================================
// 3. HÀM TIỆN ÍCH
// ==========================================

function formatVND(amount) {

    return Number(amount).toLocaleString("vi-VN") + "đ";

}


function saveProducts() {

    localStorage.setItem(
        "airnest_products_v2",
        JSON.stringify(products)
    );

}


function saveCart() {

    localStorage.setItem(
        "airnest_cart",
        JSON.stringify(cart)
    );

    updateNavCounts();

}


function saveFavorites() {

    localStorage.setItem(
        "airnest_favs",
        JSON.stringify(favorites)
    );

    updateNavCounts();

}


function saveOrders() {

    localStorage.setItem(
        "airnest_orders",
        JSON.stringify(orders)
    );

}


// Chống chèn HTML từ dữ liệu nhập.

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

}


// ==========================================
// 4. HÌNH ẢNH DỰ PHÒNG
// ==========================================

// Nếu không tìm thấy ảnh gốc,
// website sẽ hiển thị hình SVG đơn giản.

function getFallbackImage() {

    const svg = `

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="400"
            height="300"
            viewBox="0 0 400 300"
        >

            <rect
                width="400"
                height="300"
                fill="#eaf5f3"
            />

            <rect
                x="145"
                y="45"
                width="110"
                height="180"
                rx="30"
                fill="#ffffff"
                stroke="#0e8388"
                stroke-width="4"
            />

            <circle
                cx="200"
                cy="70"
                r="7"
                fill="#0e8388"
            />

            <path
                d="M165 105 V200
                   M185 105 V200
                   M205 105 V200
                   M225 105 V200"
                stroke="#bdd9d5"
                stroke-width="5"
            />

            <text
                x="200"
                y="265"
                font-size="22"
                font-family="Arial"
                text-anchor="middle"
                fill="#0e8388"
            >
                AIRNEST A1
            </text>

        </svg>

    `;

    return "data:image/svg+xml;charset=UTF-8,"
        + encodeURIComponent(svg);

}


function handleImageError(img) {

    img.onerror = null;

    img.src = getFallbackImage();

}


// ==========================================
// 5. CHUYỂN TRANG
// ==========================================

function showPage(pageId) {

    // Chỉ kiểm tra quyền ở giao diện demo.
    // Không thay thế được xác thực bằng backend.

    if (
        pageId === "admin" &&
        (!currentUser || !currentUser.isAdmin)
    ) {

        alert("Vui lòng đăng nhập Admin.");

        pageId = "login";

    }

    document.querySelectorAll(".page").forEach(page => {

        page.classList.remove("active");

    });

    const target = document.getElementById(
        "page-" + pageId
    );

    if (!target) return;

    target.classList.add("active");

    window.scrollTo(0, 0);

    switch (pageId) {

        case "home":
            renderFeaturedProducts();
            break;

        case "products":
            renderAllProducts();
            break;

        case "detail":
            break;

        case "cart":
            renderCart();
            break;

        case "favorites":
            renderFavorites();
            break;

        case "checkout":
            renderCheckout();
            break;

        case "admin":
            renderAdminDashboard();
            break;

    }

}


// ==========================================
// 6. TẠO THẺ SẢN PHẨM
// ==========================================

function createProductCard(p) {

    const isFavorite = favorites.includes(p.id);

    return `

        <div class="product-card">

            <img
                src="${escapeHTML(p.img)}"
                alt="${escapeHTML(p.name)}"
                onerror="handleImageError(this)"
            >

            <div class="product-info">

                <div class="product-title">
                    ${escapeHTML(p.name)}
                </div>

                <div class="product-price">
                    ${formatVND(p.price)}
                </div>

                <div class="product-actions">

                    <button
                        class="btn-primary"
                        onclick="addToCart(${p.id})"
                    >
                        Thêm giỏ
                    </button>

                    <button
                        class="btn-outline"
                        onclick="toggleFav(${p.id})"
                        title="Yêu thích"
                    >
                        ${isFavorite ? "❤️" : "🤍"}
                    </button>

                    <button
                        class="btn-outline"
                        onclick="showDetail(${p.id})"
                    >
                        Xem
                    </button>

                </div>

            </div>

        </div>

    `;

}


// ==========================================
// 7. TRANG CHỦ
// ==========================================

function renderFeaturedProducts() {

    const container = document.getElementById(
        "featured-products"
    );

    if (!container) return;

    container.innerHTML = products
        .slice(0, 4)
        .map(createProductCard)
        .join("");

}


// ==========================================
// 8. DANH SÁCH SẢN PHẨM
// ==========================================

function renderAllProducts() {

    filterProducts();

}


// ==========================================
// 9. TÌM KIẾM SẢN PHẨM
// ==========================================

function filterProducts() {

    const searchInput = document.getElementById(
        "search-input"
    );

    const query = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filtered = products.filter(p => {

        const matchCategory =
            currentCat === "all" ||
            p.category === currentCat;

        const matchSearch =
            p.name.toLowerCase().includes(query);

        return matchCategory && matchSearch;

    });

    const container = document.getElementById(
        "all-products"
    );

    if (!container) return;

    if (filtered.length === 0) {

        container.innerHTML = `
            <p class="text-muted">
                Không tìm thấy sản phẩm phù hợp.
            </p>
        `;

        return;

    }

    container.innerHTML = filtered
        .map(createProductCard)
        .join("");

}


// ==========================================
// 10. LỌC DANH MỤC
// ==========================================

function setCategory(category, button) {

    currentCat = category;

    document.querySelectorAll(".btn-cat").forEach(btn => {

        btn.classList.remove("active");

    });

    if (button) {

        button.classList.add("active");

    }

    filterProducts();

}


// ==========================================
// 11. CHI TIẾT SẢN PHẨM
// ==========================================

function showDetail(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    const isFavorite = favorites.includes(id);

    const container = document.getElementById(
        "product-detail-content"
    );

    container.innerHTML = `

        <img
            class="detail-image"
            src="${escapeHTML(product.img)}"
            alt="${escapeHTML(product.name)}"
            onerror="handleImageError(this)"
        >

        <div class="detail-info">

            <h2>
                ${escapeHTML(product.name)}
            </h2>

            <div class="detail-price">
                ${formatVND(product.price)}
            </div>

            <p>
                ${escapeHTML(product.desc)}
            </p>

            <div class="detail-actions">

                <button
                    class="btn-primary"
                    onclick="addToCart(${product.id})"
                >
                    Thêm Vào Giỏ Hàng
                </button>

                <button
                    class="btn-outline"
                    onclick="toggleFav(${product.id}); showDetail(${product.id})"
                >
                    ${isFavorite ? "❤️ Đã thích" : "🤍 Yêu thích"}
                </button>

            </div>

        </div>

    `;

    showPage("detail");

}


// ==========================================
// 12. THÊM VÀO GIỎ HÀNG
// ==========================================

function addToCart(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    const item = cart.find(i => i.id === id);

    if (item) {

        item.qty++;

    } else {

        cart.push({
            id: id,
            qty: 1
        });

    }

    saveCart();

    alert("Đã thêm sản phẩm vào giỏ hàng!");

}


// ==========================================
// 13. CẬP NHẬT SỐ LƯỢNG
// ==========================================

function updateCartQty(id, delta) {

    const item = cart.find(i => i.id === id);

    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {

        cart = cart.filter(i => i.id !== id);

    }

    saveCart();

    renderCart();

}


// ==========================================
// 14. XÓA KHỎI GIỎ
// ==========================================

function removeFromCart(id) {

    cart = cart.filter(i => i.id !== id);

    saveCart();

    renderCart();

}


// ==========================================
// 15. TÍNH TỔNG TIỀN
// ==========================================

function getCartTotal() {

    return cart.reduce((total, item) => {

        const product = products.find(
            p => p.id === item.id
        );

        if (!product) return total;

        return total + product.price * item.qty;

    }, 0);

}


// ==========================================
// 16. HIỂN THỊ GIỎ HÀNG
// ==========================================

function renderCart() {

    const container = document.getElementById(
        "cart-items-container"
    );

    const summary = document.getElementById(
        "cart-summary"
    );

    if (!container) return;

    const validItems = cart.filter(item =>
        products.some(p => p.id === item.id)
    );

    if (validItems.length === 0) {

        container.innerHTML = `
            <p>Giỏ hàng của bạn đang trống.</p>
        `;

        if (summary) {
            summary.style.display = "none";
        }

        return;

    }

    if (summary) {
        summary.style.display = "block";
    }

    let html = `

        <div class="table-responsive">

        <table class="data-table">

            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Thao tác</th>
                </tr>
            </thead>

            <tbody>

    `;

    validItems.forEach(item => {

        const product = products.find(
            p => p.id === item.id
        );

        const subtotal = product.price * item.qty;

        html += `

            <tr>

                <td>
                    ${escapeHTML(product.name)}
                </td>

                <td>
                    ${formatVND(product.price)}
                </td>

                <td>

                    <button
                        class="btn-outline"
                        onclick="updateCartQty(${product.id}, -1)"
                    >
                        -
                    </button>

                    ${item.qty}

                    <button
                        class="btn-outline"
                        onclick="updateCartQty(${product.id}, 1)"
                    >
                        +
                    </button>

                </td>

                <td>
                    ${formatVND(subtotal)}
                </td>

                <td>

                    <button
                        class="btn-danger"
                        onclick="removeFromCart(${product.id})"
                    >
                        Xóa
                    </button>

                </td>

            </tr>

        `;

    });

    html += "</tbody></table></div>";

    container.innerHTML = html;

    document.getElementById(
        "cart-total-price"
    ).textContent = formatVND(getCartTotal());

}


// ==========================================
// 17. YÊU THÍCH
// ==========================================

function toggleFav(id) {

    if (favorites.includes(id)) {

        favorites = favorites.filter(
            favId => favId !== id
        );

    } else {

        favorites.push(id);

    }

    saveFavorites();

    renderFeaturedProducts();

    filterProducts();

    renderFavorites();

}


// ==========================================
// 18. DANH SÁCH YÊU THÍCH
// ==========================================

function renderFavorites() {

    const container = document.getElementById(
        "favorite-products"
    );

    if (!container) return;

    const favoriteProducts = products.filter(
        p => favorites.includes(p.id)
    );

    if (favoriteProducts.length === 0) {

        container.innerHTML = `
            <p>Bạn chưa có sản phẩm yêu thích.</p>
        `;

        return;

    }

    container.innerHTML = favoriteProducts
        .map(createProductCard)
        .join("");

}


// ==========================================
// 19. CẬP NHẬT HEADER
// ==========================================

function updateNavCounts() {

    const cartCount = document.getElementById(
        "cart-count"
    );

    const favCount = document.getElementById(
        "fav-count"
    );

    const totalQty = cart.reduce(
        (sum, item) => sum + item.qty,
        0
    );

    if (cartCount) {

        cartCount.textContent = totalQty;

    }

    if (favCount) {

        favCount.textContent = favorites.length;

    }

}


// ==========================================
// 20. THANH TOÁN
// ==========================================

function renderCheckout() {

    const element = document.getElementById(
        "checkout-total"
    );

    if (element) {

        element.textContent = formatVND(
            getCartTotal()
        );

    }

}


// ==========================================
// 21. XỬ LÝ ĐẶT HÀNG
// ==========================================

function handleCheckout(event) {

    event.preventDefault();

    if (cart.length === 0) {

        alert("Giỏ hàng đang trống!");

        return;

    }

    const name = document.getElementById(
        "cust-name"
    ).value.trim();

    const phone = document.getElementById(
        "cust-phone"
    ).value.trim();

    const address = document.getElementById(
        "cust-address"
    ).value.trim();

    if (!name || !phone || !address) {

        alert("Vui lòng nhập đầy đủ thông tin.");

        return;

    }

    const newOrder = {

        id: "A1-" + Date.now(),

        name: name,

        phone: phone,

        address: address,

        total: getCartTotal(),

        items: cart.map(item => ({ ...item })),

        status: "Mới đặt",

        date: new Date().toISOString()

    };

    orders.push(newOrder);

    saveOrders();

    cart = [];

    saveCart();

    alert(
        "Đặt hàng thành công!\nMã đơn: " + newOrder.id
    );

    document.getElementById(
        "checkout-form"
    ).reset();

    showPage("home");

}


// ==========================================
// 22. ĐĂNG NHẬP DEMO
// ==========================================

// LƯU Ý:
// Đây không phải cơ chế đăng nhập an toàn.
// Cần backend để xác thực tài khoản thật.

function handleAuth(event) {

    event.preventDefault();

    const username = document.getElementById(
        "auth-username"
    ).value.trim();

    const password = document.getElementById(
        "auth-password"
    ).value;

    if (!username || !password) {

        alert("Vui lòng nhập tài khoản và mật khẩu.");

        return;

    }

    currentUser = {

        username: username,

        isAdmin: username.toLowerCase() === "admin"

    };

    localStorage.setItem(
        "airnest_user",
        JSON.stringify(currentUser)
    );

    updateUserNav();

    if (currentUser.isAdmin) {

        alert("Đã vào chế độ quản trị demo.");

        showPage("admin");

    } else {

        showPage("home");

    }

}


// ==========================================
// 23. HIỂN THỊ TÀI KHOẢN
// ==========================================

function updateUserNav() {

    const nav = document.getElementById(
        "user-nav"
    );

    if (!nav) return;

    nav.innerHTML = "";

    if (!currentUser) {

        const button = document.createElement("button");

        button.className = "btn-outline";

        button.textContent = "Đăng nhập";

        button.onclick = () => showPage("login");

        nav.appendChild(button);

        return;

    }

    const greeting = document.createElement("span");

    greeting.textContent = "Chào, " + currentUser.username;

    nav.appendChild(greeting);

    if (currentUser.isAdmin) {

        const adminButton = document.createElement("button");

        adminButton.className = "btn-outline";

        adminButton.textContent = "Quản trị";

        adminButton.onclick = () => showPage("admin");

        nav.appendChild(adminButton);

    }

    const logoutButton = document.createElement("button");

    logoutButton.className = "btn-outline";

    logoutButton.textContent = "Đăng xuất";

    logoutButton.onclick = logout;

    nav.appendChild(logoutButton);

}


// ==========================================
// 24. ĐĂNG XUẤT
// ==========================================

function logout() {

    currentUser = null;

    localStorage.removeItem(
        "airnest_user"
    );

    updateUserNav();

    showPage("home");

}


function logoutAdmin() {

    logout();

}


// ==========================================
// 25. DASHBOARD ADMIN
// ==========================================

function renderAdminDashboard() {

    if (!currentUser || !currentUser.isAdmin) {

        showPage("login");

        return;

    }

    document.getElementById(
        "stat-products-count"
    ).textContent = products.length;

    document.getElementById(
        "stat-orders-count"
    ).textContent = orders.length;

    const totalValue = orders.reduce(
        (sum, order) => sum + Number(order.total),
        0
    );

    document.getElementById(
        "stat-revenue"
    ).textContent = formatVND(totalValue);


    // HIỂN THỊ SẢN PHẨM

    const productList = document.getElementById(
        "admin-product-list"
    );

    if (productList) {

        productList.innerHTML = products.map(p => `

            <tr>

                <td>

                    <img
                        src="${escapeHTML(p.img)}"
                        alt="${escapeHTML(p.name)}"
                        onerror="handleImageError(this)"
                    >

                </td>

                <td>
                    ${escapeHTML(p.name)}
                </td>

                <td>
                    ${escapeHTML(p.category)}
                </td>

                <td>
                    ${formatVND(p.price)}
                </td>

                <td>

                    <button
                        class="btn-danger"
                        onclick="deleteProduct(${p.id})"
                    >
                        Xóa
                    </button>

                </td>

            </tr>

        `).join("");

    }


    // HIỂN THỊ ĐƠN HÀNG

    const orderList = document.getElementById(
        "admin-order-list"
    );

    if (orderList) {

        orderList.innerHTML = "";

        orders.forEach(order => {

            const row = document.createElement("tr");

            [
                order.id,
                order.name,
                order.phone,
                formatVND(order.total),
                order.status
            ].forEach(value => {

                const cell = document.createElement("td");

                cell.textContent = value;

                row.appendChild(cell);

            });

            const actionCell = document.createElement("td");

            const button = document.createElement("button");

            button.className = "btn-outline";

            button.textContent = "Cập nhật";

            button.onclick = () => {
                updateOrderStatus(order.id);
            };

            actionCell.appendChild(button);

            row.appendChild(actionCell);

            orderList.appendChild(row);

        });

    }

}


// ==========================================
// 26. XÓA SẢN PHẨM
// ==========================================

function deleteProduct(id) {

    if (!currentUser?.isAdmin) return;

    const confirmed = confirm(
        "Bạn có chắc muốn xóa sản phẩm này?"
    );

    if (!confirmed) return;

    products = products.filter(
        p => p.id !== id
    );

    saveProducts();

    renderAdminDashboard();

}


// ==========================================
// 27. THÊM SẢN PHẨM
// ==========================================

function showAddProductModal() {

    if (!currentUser?.isAdmin) return;

    const name = prompt(
        "Nhập tên sản phẩm:"
    );

    if (!name || !name.trim()) return;

    const category = prompt(
        "Nhập danh mục:\n" +
        "may-loc-khong-khi\n" +
        "loi-loc-hepa\n" +
        "phu-kien",
        "may-loc-khong-khi"
    );

    const allowedCategories = [
        "may-loc-khong-khi",
        "loi-loc-hepa",
        "phu-kien"
    ];

    if (!allowedCategories.includes(category)) {

        alert("Danh mục không hợp lệ.");

        return;

    }

    const price = Number(
        prompt("Nhập giá bán (VNĐ):")
    );

    if (!Number.isFinite(price) || price <= 0) {

        alert("Giá bán không hợp lệ.");

        return;

    }

    const image = prompt(
        "Nhập đường dẫn hình ảnh:",
        "assets/images/products/may-loc-khong-khi/may-loc-1.jpg"
    );

    const description = prompt(
        "Nhập mô tả sản phẩm:",
        "Sản phẩm AIRNEST A1"
    );

    const newProduct = {

        id: Date.now(),

        name: name.trim(),

        category: category,

        price: price,

        img: image || "",

        desc: description || ""

    };

    products.push(newProduct);

    saveProducts();

    renderAdminDashboard();

    alert("Đã thêm sản phẩm thành công!");

}


// ==========================================
// 28. CẬP NHẬT ĐƠN HÀNG
// ==========================================

function updateOrderStatus(orderId) {

    if (!currentUser?.isAdmin) return;

    const order = orders.find(
        o => o.id === orderId
    );

    if (!order) return;

    const newStatus = prompt(
        "Nhập trạng thái mới:\n" +
        "Mới đặt\n" +
        "Đang giao\n" +
        "Đã giao\n" +
        "Đã hủy",
        order.status
    );

    const allowedStatuses = [
        "Mới đặt",
        "Đang giao",
        "Đã giao",
        "Đã hủy"
    ];

    if (!allowedStatuses.includes(newStatus)) {

        if (newStatus !== null) {
            alert("Trạng thái không hợp lệ.");
        }

        return;

    }

    order.status = newStatus;

    saveOrders();

    renderAdminDashboard();

}


// ==========================================
// 29. KHỞI TẠO WEBSITE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateNavCounts();

        updateUserNav();

        renderFeaturedProducts();

    }
);
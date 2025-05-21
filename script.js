let products = [
  { id: 1, name: "派大星", price: 9999, stock: 5, category: "其他", img: "images/products/PDX.jpg", inCart: false, quantity: 0 },
  { id: 2, name: "帽T", price: 499, stock: 2, category: "衣服", img: "images/products/hoodie.jpg", inCart: false, quantity: 0 },
  { id: 3, name: "筆電", price: 14999, stock: 8, category: "3C產品", img: "images/products/laptop.jpg", inCart: false, quantity: 0 },
  { id: 4, name: "小說", price: 199, stock: 100, category: "書籍", img: "images/products/book.jpg", inCart: false, quantity: 0 },
  { id: 5, name: "棒球帽", price: 299, stock: 10, category: "帽子", img: "images/products/cap.jpg", inCart: false, quantity: 0 },
  { id: 6, name: "蚵仔", price: 9999, stock: 1, category: "其他", img: "images/products/pug.gif", inCart: false, quantity: 0 },
  { id: 7, name: "鞋子", price: 1399, stock: 2, category: "鞋子", img: "images/products/shoes.jpg", inCart: false, quantity: 0 },
  { id: 8, name: "Switch", price: 4999, stock: 2, category: "3C產品", img: "images/products/switch.jpg", inCart: false, quantity: 0 }
];

let currentPage = 1;
const itemsPerPage = 6;
let filteredProducts = products;

function updateCart() {
  const cartList = $('#cartList');
  const cartTotal = $('#cartTotal');
  cartList.empty();
  let total = 0;
  products.filter(p => p.inCart).forEach(p => {
    total += p.price * p.quantity;
    cartList.append(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${p.name} x ${p.quantity}
        <div>
          <button class="btn btn-sm btn-secondary me-1 decrease" data-id="${p.id}">-</button>
          <button class="btn btn-sm btn-secondary me-1 increase" data-id="${p.id}">+</button>
          <button class="btn btn-sm btn-danger remove-from-cart" data-id="${p.id}">移除</button>
        </div>
      </li>`);
  });
  cartTotal.text(`總金額：$${total}`);
}

function renderProducts(list) {
  $('#productList').empty();
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = list.slice(start, start + itemsPerPage);
  if (paginated.length === 0) {
    $('#productList').append('<p>找不到符合條件的商品</p>');
    return;
  }
  paginated.forEach(p => {
    const buttonHTML = p.inCart
      ? `<button class="btn btn-secondary btn-sm w-100" disabled>已加入 ${p.quantity} 件</button>`
      : `<button class="btn btn-outline-primary btn-sm w-100 add-to-cart" data-id="${p.id}">＋ 加入購物車</button>`;
    $('#productList').append(`
      <div class="col-md-4">
        <div class="product-card position-relative">
          <span class="tag">${p.category}</span>
          <img src="${p.img}" alt="${p.name}">
          <h5 class="mt-2">${p.name}</h5>
          <p>$${p.price}</p>
          <p>庫存：${p.stock}</p>
          ${buttonHTML}
        </div>
      </div>`);
  });
  $('#pageInfo').text(`第 ${currentPage} 頁 / 共 ${Math.ceil(list.length / itemsPerPage)} 頁`);
}

function filterProducts() {
  const min = Number($('#minPrice').val()) || 0;
  const max = Number($('#maxPrice').val()) || Infinity;
  const keyword = $('#searchInput').val().toLowerCase();
  const categories = $('#categoryFilters input:checked').map(function () { return this.value }).get();
  filteredProducts = products.filter(p => {
    return (
      p.price >= min && p.price <= max &&
      (categories.length === 0 || categories.includes(p.category)) &&
      p.name.toLowerCase().includes(keyword)
    );
  });
  currentPage = 1;
  sortAndRender();
}

function sortAndRender() {
  const sortType = $('#sortSelect').val();
  if (sortType === 'priceAsc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === 'priceDesc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  renderProducts(filteredProducts);
}

$(document).ready(function () {
  renderProducts(products);
  updateCart();

  $('#filterBtn').click(filterProducts);
  $('#searchInput').on('input', filterProducts);
  $('#sortSelect').change(sortAndRender);

  $('#productList').on('click', '.add-to-cart', function () {
    const id = $(this).data('id');
    const product = products.find(p => p.id === id);
    if (product) {
      product.inCart = true;
      product.quantity = 1;
      updateCart();
      renderProducts(filteredProducts);
    }
  });

  $('#cartList').on('click', '.increase', function () {
    const id = $(this).data('id');
    const product = products.find(p => p.id === id);
    if (product && product.quantity < product.stock) {
      product.quantity++;
      updateCart();
    }
  });

  $('#cartList').on('click', '.decrease', function () {
    const id = $(this).data('id');
    const product = products.find(p => p.id === id);
    if (product && product.quantity > 1) {
      product.quantity--;
      updateCart();
    }
  });

  $('#cartList').on('click', '.remove-from-cart', function () {
    const id = $(this).data('id');
    const product = products.find(p => p.id === id);
    if (product) {
      product.inCart = false;
      product.quantity = 0;
      updateCart();
      renderProducts(filteredProducts);
    }
  });

  $('#checkoutBtn').click(function () {
    alert('感謝您的購買！');
    products.forEach(p => {
      p.inCart = false;
      p.quantity = 0;
    });
    updateCart();
    renderProducts(filteredProducts);
    localStorage.clear();
  });

  $('#toggleCartBtn').click(function () {
    $('#cartBox').toggle();
  });

  $('#prevPage').click(function () {
    if (currentPage > 1) {
      currentPage--;
      renderProducts(filteredProducts);
    }
  });

  $('#nextPage').click(function () {
    if (currentPage < Math.ceil(filteredProducts.length / itemsPerPage)) {
      currentPage++;
      renderProducts(filteredProducts);
    }
  });

  $("#toggleDark").on("click", function () {
    $("body").toggleClass("dark-mode");
    const isDark = $("body").hasClass("dark-mode");

    // 按鈕文字切換
    $("#toggleDark").text(isDark ? "☀️ 日間" : "🌙 夜間");

    // Logo 與購物車圖片切換
    $("#siteLogo").attr("src", isDark ? "images/logo-white.png" : "images/logo.png");
    $("#cartIcon").attr("src", isDark ? "images/cart-white.png" : "images/cart.png");
  });
});


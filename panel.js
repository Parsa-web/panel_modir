document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelectorAll('.menu-item').forEach(menu => {
      menu.classList.remove('active');
    });

    this.classList.add('active');

    document.querySelectorAll('.page-content').forEach(page => {
      page.classList.remove('active');
    });

    const pageId = this.getAttribute('data-page');
    const pageContent = document.getElementById(pageId);

    if (!pageContent) {
      return;
    }

    pageContent.classList.add('active');
    const pageTitle = this.querySelector('span')?.textContent || '';
    const pageTitleElement = document.querySelector('.page-title');
    if (pageTitleElement && pageTitle) {
      pageTitleElement.textContent = pageTitle;
    }

    // همگام‌سازی hash برای پشتیبانی از بارگذاری مستقیم صفحه
    if (pageId) {
      window.location.hash = pageId;
    }

        if (pageId === 'comments') {
      setTimeout(() => {
        const activeFilter = document.querySelector('#comments .filter-btn.active');
        const filterCode = activeFilter ? (activeFilter.dataset.commentFilter || activeFilter.dataset.filter || 'all') : 'all';
        if (typeof renderComments === 'function') {
          renderComments(filterCode);
        }
      }, 100);
    }

    if (pageId === 'users') {
      loadUsers();
    }

    if (pageId === 'settings' && typeof initializeSettingsSection === 'function') {
      initializeSettingsSection({ force: true });
    }
  });
});

function setupMobileSidebarToggle() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const overlay = document.getElementById('sidebarOverlay');
  const sidebar = document.querySelector('.sidebar');
  if (!toggleBtn || !overlay || !sidebar) {
    return;
  }

  const closeSidebar = () => document.body.classList.remove('sidebar-open');
  const toggleSidebar = () => document.body.classList.toggle('sidebar-open');

  toggleBtn.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', closeSidebar);

  // بستن منو بعد از انتخاب آیتم در موبایل
  document.querySelectorAll('.menu-item').forEach(link => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 992px)').matches) {
        closeSidebar();
      }
    });
  });

  // در نمایش دسکتاپ، منو همیشه باز و ثابت است
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 992px)').matches) {
      closeSidebar();
    }
  });
}
document.addEventListener("DOMContentLoaded", function() {
        const addButton = document.getElementById("add");
        if (addButton) {
        addButton.addEventListener("click", function() {
            window.location.href = "ezafemahsul.html";
        });
    }
    
    const addUserButton = document.getElementById("addUser");
    if (addUserButton) {
        addUserButton.addEventListener("click", function() {
            window.location.href = "ezafekarbar.html";
        });
    }

    setupMobileSidebarToggle();
});

// --- توابع ساده برای localStorage ---
function getStorage(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- بارگذاری محصولات در صفحه مدیریت ---
let currentProductSearchTerm = "";

function loadProducts(searchTerm = currentProductSearchTerm) {
  currentProductSearchTerm = typeof searchTerm === "string" ? searchTerm.trim() : "";
  const normalizedTerm = currentProductSearchTerm.toLowerCase();
  const products = getStorage("products");
  const container = document.querySelector("#products .products-grid");
  const searchInput = document.getElementById("productSearch");

  if (!container) return;
  if (searchInput && searchInput.value !== currentProductSearchTerm) {
    searchInput.value = currentProductSearchTerm;
  }
  container.innerHTML = "";

  if (products.length === 0) {
    const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
    const emptyMsg = window.getTranslation ? window.getTranslation(lang, 'products.empty') : 'هیچ محصولی ثبت نشده است.';
    container.innerHTML = `<div class="empty">${emptyMsg}</div>`;
    return;
  }

  const filteredProducts = normalizedTerm
    ? products.filter(p => {
        const fields = [
          p.name || "",
          p.cat || "",
          p.desc || "",
          p.price !== undefined && p.price !== null ? String(p.price) : ""
        ];
        return fields.some(field =>
          String(field).toLowerCase().includes(normalizedTerm)
        );
      })
    : products;

  if (filteredProducts.length === 0) {
    const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
    const emptyResult = document.createElement("div");
    emptyResult.className = "empty";
    if (currentProductSearchTerm) {
      const msg = window.getTranslation ? window.getTranslation(lang, 'products.emptySearch') : `هیچ محصولی با عبارت «${currentProductSearchTerm}» یافت نشد.`;
      emptyResult.textContent = msg.replace('{term}', currentProductSearchTerm);
    } else {
      emptyResult.textContent = window.getTranslation ? window.getTranslation(lang, 'products.noProducts') : "محصولی برای نمایش وجود ندارد.";
    }
    container.appendChild(emptyResult);
    return;
  }

  const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
  filteredProducts.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    const priceValue = typeof p.price === "number" ? p.price : parseInt(p.price, 10) || 0;
    const description = p.desc ? `<p class="product-desc">${p.desc}</p>` : "";
    const categoryLabel = window.getTranslation ? window.getTranslation(lang, 'products.category') : 'دسته:';
    const editTitle = window.getTranslation ? window.getTranslation(lang, 'products.edit') : 'ویرایش محصول';
    const deleteTitle = window.getTranslation ? window.getTranslation(lang, 'products.delete') : 'حذف محصول';
    const currency = lang === 'en' ? 'Toman' : 'تومان';
    card.innerHTML = `
      <div class="product-image">
        ${p.img
          ? `<img src="${p.img}" alt="${p.name}">`
          : `<i class="fa-solid fa-image"></i>`}
      </div>
      <div class="product-info">
        <h4>${p.name}</h4>
        <p>${categoryLabel} ${p.cat}</p>
        ${description}
        <div class="product-price">${priceValue.toLocaleString("fa-IR")} ${currency}</div>
      </div>
      <div class="product-actions">
        <button class="btn-icon edit-product" data-id="${p.id}" title="${editTitle}">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-icon delete-product" data-id="${p.id}" title="${deleteTitle}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- بارگذاری کاربران در صفحه مدیریت ---
let currentUserSearchTerm = "";

function loadUsers(searchTerm = currentUserSearchTerm) {
  currentUserSearchTerm = typeof searchTerm === "string" ? searchTerm.trim() : "";
  const normalizedTerm = currentUserSearchTerm.toLowerCase();
  const users = getStorage("users");
  const container = document.querySelector("#users .users-list");
  const searchInput = document.getElementById("userSearch");

  if (!container) return;
  container.innerHTML = "";

  if (searchInput && searchInput.value !== currentUserSearchTerm) {
    searchInput.value = currentUserSearchTerm;
  }

  const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
  if (users.length === 0) {
    const emptyMsg = window.getTranslation ? window.getTranslation(currentLang, 'users.empty') : 'هیچ کاربری ثبت نشده است.';
    container.innerHTML = `<div class="empty" style="text-align: center; padding: 40px; color: #64748b;">${emptyMsg}</div>`;
    return;
  }

  const filteredUsers = normalizedTerm
    ? users.filter(user => {
        const fields = [
          user.name || "",
          user.role || "",
          user.email || "",
          user.phone || ""
        ];
        return fields.some(field => String(field).toLowerCase().includes(normalizedTerm));
      })
    : users;

  if (filteredUsers.length === 0) {
    let emptyMsg;
    if (currentUserSearchTerm) {
      const msg = window.getTranslation ? window.getTranslation(currentLang, 'users.emptySearch') : `هیچ کاربری با عبارت «${currentUserSearchTerm}» یافت نشد.`;
      emptyMsg = msg.replace('{term}', currentUserSearchTerm);
    } else {
      emptyMsg = window.getTranslation ? window.getTranslation(currentLang, 'users.noUsers') : "کاربری برای نمایش وجود ندارد.";
    }
    container.innerHTML = `<div class="empty" style="text-align: center; padding: 40px; color: #64748b;">${emptyMsg}</div>`;
    return;
  }
  filteredUsers.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";
    // ترجمه نقش کاربر
    let userRoleDisplay = user.role;
    if (window.getTranslation) {
      if (user.role === "مدیر" || user.role === "Admin") {
        userRoleDisplay = window.getTranslation(currentLang, 'user.role.admin');
      } else if (user.role === "مشتری" || user.role === "Customer") {
        userRoleDisplay = window.getTranslation(currentLang, 'user.role.customer');
      }
    }
    const roleClass = (user.role === "مدیر" || user.role === "Admin") ? "admin-role" : "";
    const roleLabel = window.getTranslation ? window.getTranslation(currentLang, 'users.role') : 'نقش';
    const editTitle = window.getTranslation ? window.getTranslation(currentLang, 'users.edit') : 'ویرایش کاربر';
    const deleteTitle = window.getTranslation ? window.getTranslation(currentLang, 'users.delete') : 'حذف کاربر';
    card.innerHTML = `
      <div class="user-avatar-small">
        <i class="fa-solid fa-user"></i>
      </div>
      <div class="user-details">
        <h4>${user.name}</h4>
        <span class="user-role ${roleClass}">${userRoleDisplay}</span>
      </div>
      <div class="user-stats">
        <div class="stat-item">
          <span class="stat-label">${roleLabel}</span>
          <span class="stat-value">${userRoleDisplay}</span>
        </div>
      </div>
      <div class="user-actions">
        <button class="btn-icon edit-user" data-id="${user.id}" title="${editTitle}">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-icon delete-user" data-id="${user.id}" title="${deleteTitle}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// تابع برای فعال کردن صفحه بر اساس hash
function activatePageFromHash() {
  const hash = window.location.hash.substring(1); // حذف # از ابتدای hash
  if (hash) {
    const menuItem = document.querySelector(`.menu-item[data-page="${hash}"]`);
    if (menuItem) {
      // حذف active از همه منوها
      document.querySelectorAll('.menu-item').forEach(menu => {
        menu.classList.remove('active');
      });
      
      // حذف active از همه صفحات
      document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
      });
      
      // فعال کردن منو و صفحه مربوطه
      menuItem.classList.add('active');
      const pageContent = document.getElementById(hash);
      if (pageContent) {
        pageContent.classList.add('active');
        const pageTitle = menuItem.querySelector('span').textContent;
        const titleElement = document.querySelector('.page-title');
        if (titleElement) {
          titleElement.textContent = pageTitle;
        }
        
        // اگر صفحه products است، محصولات را بارگذاری کن
        if (hash === 'products') {
          loadProducts();
        }
        
        // اگر صفحه نظرات است، نظرات را بارگذاری کن
        if (hash === 'comments') {
          setTimeout(() => {
            const activeFilter = document.querySelector("#comments .filter-btn.active");
            const filterCode = activeFilter ? (activeFilter.dataset.commentFilter || activeFilter.dataset.filter || "all") : "all";
            if (typeof renderComments === 'function') {
              renderComments(filterCode);
            }
          }, 100);
        }
        
        // اگر صفحه users است، کاربران را بارگذاری کن
        if (hash === 'users') {
          loadUsers();
        }
        
        // اگر صفحه orders است، وضعیت‌ها را به‌روزرسانی کن
        if (hash === 'orders') {
          setTimeout(() => {
            const ordersTable = document.querySelector("#orders .modern-table tbody");
            if (ordersTable) {
              const rows = ordersTable.querySelectorAll("tr");
              rows.forEach(row => {
                const statusBadge = row.querySelector(".status-badge");
                if (statusBadge) {
                  updateOrderRow(row);
                }
              });
            }
          }, 100);
        }

        if (hash === 'settings' && typeof initializeSettingsSection === 'function') {
          initializeSettingsSection({ force: true });
        }
      }
    }
  }
}

// تابع برای به‌روزرسانی تمام محتوا هنگام تغییر زبان
function refreshAllContentOnLanguageChange() {
  // بارگذاری مجدد محصولات
  if (document.getElementById('products')) {
    loadProducts();
  }
  // بارگذاری مجدد کاربران
  if (document.getElementById('users')) {
    loadUsers();
  }
  // بارگذاری مجدد نظرات
  if (document.getElementById('comments')) {
    const activeFilter = document.querySelector("#comments .filter-btn.active");
    const filterCode = activeFilter ? (activeFilter.dataset.commentFilter || activeFilter.dataset.filter || "all") : "all";
    if (typeof renderComments === 'function') {
      renderComments(filterCode);
    }
  }
  // به‌روزرسانی اعلان‌ها
  if (typeof renderNotifications === 'function') {
    renderNotifications();
  }
  // به‌روزرسانی عنوان صفحه
  if (typeof updatePageTitleFromMenu === 'function') {
    updatePageTitleFromMenu();
  }
  // به‌روزرسانی وضعیت‌های سفارش
  const ordersTable = document.querySelector("#orders .modern-table tbody");
  if (ordersTable) {
    const rows = ordersTable.querySelectorAll("tr");
    rows.forEach(row => {
      const statusBadge = row.querySelector(".status-badge");
      if (statusBadge) {
        const statusCode = statusBadge.getAttribute('data-status-code');
        if (statusCode) {
          updateOrderRow(row);
        }
      }
    });
    // به‌روزرسانی فیلتر
    const activeFilterBtn = document.querySelector("#orders .filter-btn.active");
    if (activeFilterBtn) {
      applyOrderFilter(activeFilterBtn.textContent.trim());
    }
  }
  
  // به‌روزرسانی مودال سفارش (اگر باز است)
  const orderModal = document.getElementById("orderModal");
  if (orderModal && orderModal.classList.contains("open")) {
    const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
    // اعمال ترجمه‌ها
    if (window.applyTranslations) {
      window.applyTranslations(lang);
    }
    // به‌روزرسانی وضعیت در مودال
    const statusEl = document.getElementById("orderModalStatus");
    if (statusEl && statusEl.textContent !== "-") {
      const statusCode = statusEl.getAttribute('data-status-code');
      if (statusCode && window.getTranslation) {
        let statusText = statusEl.textContent;
        if (statusCode === 'delivered') {
          statusText = window.getTranslation(lang, 'status.delivered');
        } else if (statusCode === 'processing') {
          statusText = window.getTranslation(lang, 'status.processing');
        } else if (statusCode === 'pending') {
          statusText = window.getTranslation(lang, 'status.pending');
        } else if (statusCode === 'canceled') {
          statusText = window.getTranslation(lang, 'status.canceled');
        }
        statusEl.textContent = statusText;
      }
    }
    // به‌روزرسانی یادداشت‌ها و پرداخت اگر خالی هستند
    const notesEl = document.getElementById("orderModalNotes");
    if (notesEl) {
      const notesKey = notesEl.getAttribute('data-i18n-key');
      if (notesKey && window.getTranslation && (!notesEl.textContent || notesEl.textContent.trim() === '' || notesEl.textContent.includes("برای مشاهده"))) {
        notesEl.textContent = window.getTranslation(lang, notesKey);
      }
    }
    const paymentEl = document.getElementById("orderModalPayment");
    if (paymentEl) {
      const paymentKey = paymentEl.getAttribute('data-i18n-key');
      if (paymentKey && window.getTranslation && (!paymentEl.textContent || paymentEl.textContent.trim() === '' || paymentEl.textContent === '-')) {
        paymentEl.textContent = window.getTranslation(lang, paymentKey);
      }
    }
    const productsListEl = document.getElementById("orderModalProductsList");
    if (productsListEl) {
      const emptyItem = productsListEl.querySelector('li');
      if (emptyItem && emptyItem.textContent === '—') {
        const emptyKey = emptyItem.getAttribute('data-i18n-key');
        if (emptyKey && window.getTranslation) {
          emptyItem.textContent = window.getTranslation(lang, emptyKey);
        }
      }
    }
  }
}

// در دسترس قرار دادن تابع به صورت سراسری
window.refreshAllContentOnLanguageChange = refreshAllContentOnLanguageChange;

// اجرا وقتی صفحه لود می‌شود
document.addEventListener("DOMContentLoaded", function() {
  loadProducts();
  activatePageFromHash();
  setupNotificationCenter();
  
  // گوش دادن به تغییرات زبان
  if (window.addEventListener) {
    const originalSyncLanguage = window.syncLanguage;
    if (originalSyncLanguage) {
      // Override syncLanguage to refresh content
      window.syncLanguage = function(lang) {
        originalSyncLanguage(lang);
        setTimeout(refreshAllContentOnLanguageChange, 100);
      };
    }
  }
});

// اجرا وقتی hash تغییر می‌کند
window.addEventListener("hashchange", activatePageFromHash);
document.addEventListener("DOMContentLoaded", function() {
  const ordersTable = document.querySelector("#orders .modern-table tbody");
  const rows = ordersTable ? Array.from(ordersTable.querySelectorAll("tr")) : [];
  const filterButtons = document.querySelectorAll("#orders .filter-btn");
  const statusClassMap = {
    "تحویل شده": "success",
    "Delivered": "success",
    "در انتظار": "warning",
    "Pending": "warning",
    "در حال پردازش": "pending",
    "Processing": "pending",
    "لغو شده": "danger",
    "Canceled": "danger"
  };
  let currentOrderFilter = "همه";

  function setBadgeAppearance(statusBadge, statusText) {
    const statusClass = statusClassMap[statusText] || "";
    statusBadge.className = statusClass ? `status-badge ${statusClass}` : "status-badge";
  }

  function applyOrderFilter(filter = currentOrderFilter) {
    currentOrderFilter = filter;
    const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
    const allText = window.getTranslation ? window.getTranslation(lang, 'filter.all') : "همه";
    
    rows.forEach(row => {
      const statusBadge = row.querySelector(".status-badge");
      const statusCode = statusBadge ? statusBadge.getAttribute('data-status-code') : '';
      const statusText = statusBadge ? statusBadge.textContent.trim() : "";
      
      // تطبیق فیلتر با وضعیت
      let shouldShow = false;
      if (filter === allText || filter === "همه" || filter === "All") {
        shouldShow = true;
      } else {
        // تطبیق بر اساس متن یا کد وضعیت
        const filterLower = filter.toLowerCase();
        const statusLower = statusText.toLowerCase();
        if (filterLower === statusLower || 
            (filter === "در انتظار" || filter === "Pending") && (statusCode === 'pending' || statusText.includes("انتظار") || statusText.includes("Pending")) ||
            (filter === "در حال پردازش" || filter === "Processing") && (statusCode === 'processing' || statusText.includes("پردازش") || statusText.includes("Processing")) ||
            (filter === "تحویل شده" || filter === "Delivered") && (statusCode === 'delivered' || statusText.includes("تحویل") || statusText.includes("Delivered")) ||
            (filter === "لغو شده" || filter === "Canceled") && (statusCode === 'canceled' || statusText.includes("لغو") || statusText.includes("Canceled"))) {
          shouldShow = true;
        }
      }
      
      row.style.display = shouldShow ? "" : "none";
    });
  }

  function changeOrderStatus(row, statusCode) {
    const statusBadge = row.querySelector(".status-badge");
    if (!statusBadge) {
      return;
    }

    const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
    let statusText = '';
    let finalStatusCode = statusCode;
    
    // اگر statusCode یک کد است (delivered, processing, etc)
    if (statusCode === 'delivered' || statusCode === 'processing' || statusCode === 'pending' || statusCode === 'canceled') {
      finalStatusCode = statusCode;
    } else {
      // تبدیل متن به کد
      if (statusCode === "تحویل شده" || statusCode === "Delivered") {
        finalStatusCode = 'delivered';
      } else if (statusCode === "در حال پردازش" || statusCode === "Processing") {
        finalStatusCode = 'processing';
      } else if (statusCode === "در انتظار" || statusCode === "Pending") {
        finalStatusCode = 'pending';
      } else if (statusCode === "لغو شده" || statusCode === "Canceled") {
        finalStatusCode = 'canceled';
      }
    }
    
    // ترجمه وضعیت
    if (window.getTranslation) {
      if (finalStatusCode === 'delivered') {
        statusText = window.getTranslation(lang, 'status.delivered');
      } else if (finalStatusCode === 'processing') {
        statusText = window.getTranslation(lang, 'status.processing');
      } else if (finalStatusCode === 'pending') {
        statusText = window.getTranslation(lang, 'status.pending');
      } else if (finalStatusCode === 'canceled') {
        statusText = window.getTranslation(lang, 'status.canceled');
      }
    } else {
      statusText = statusCode;
    }

    statusBadge.textContent = statusText;
    statusBadge.setAttribute('data-status-code', finalStatusCode);
    row.dataset.status = finalStatusCode;
    updateOrderRow(row, statusText);
    applyOrderFilter();
  }

  function createActionButton(className, label, onClick) {
    const button = document.createElement("button");
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
  }

  // بروزرسانی رنگ وضعیت و دکمه‌ها
  function updateOrderRow(row, statusOverride) {
    const statusBadge = row.querySelector(".status-badge");
    const actionsCell = row.querySelector("td:last-child");
    if (!statusBadge || !actionsCell) {
      return;
    }

    const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
    let statusText = statusOverride || statusBadge.textContent.trim();
    const statusCode = statusBadge.getAttribute('data-status-code') || '';
    
    // اگر statusOverride داده نشده، وضعیت را از کد وضعیت ترجمه کن
    if (!statusOverride && statusCode) {
      if (window.getTranslation) {
        if (statusCode === 'delivered') {
          statusText = window.getTranslation(lang, 'status.delivered');
        } else if (statusCode === 'processing') {
          statusText = window.getTranslation(lang, 'status.processing');
        } else if (statusCode === 'pending') {
          statusText = window.getTranslation(lang, 'status.pending');
        } else if (statusCode === 'canceled') {
          statusText = window.getTranslation(lang, 'status.canceled');
        }
      }
    }
    
    // به‌روزرسانی متن وضعیت
    statusBadge.textContent = statusText;
    setBadgeAppearance(statusBadge, statusText);
    if (statusCode) {
      row.dataset.status = statusCode;
    }

    let actionsWrapper = actionsCell.querySelector(".order-actions");

    if (!actionsWrapper) {
      actionsWrapper = document.createElement("div");
      actionsWrapper.className = "order-actions";
      actionsCell.appendChild(actionsWrapper);
    }

    actionsWrapper.innerHTML = "";

    const viewBtn = document.createElement("button");
    viewBtn.className = "btn-icon";
    viewBtn.innerHTML = `<i class="fa-solid fa-eye"></i>`;
    actionsWrapper.appendChild(viewBtn);

    // بررسی وضعیت برای نمایش دکمه‌ها
    const currentStatusCode = statusCode || (statusText.includes("پردازش") || statusText.includes("Processing") ? 'processing' : 
                                             statusText.includes("تحویل") || statusText.includes("Delivered") ? 'delivered' :
                                             statusText.includes("انتظار") || statusText.includes("Pending") ? 'pending' : 'canceled');
    
    if (currentStatusCode === 'processing') {
      const approveLabel = window.getTranslation ? window.getTranslation(lang, 'orders.approve') : "تأیید سفارش";
      const approveBtn = createActionButton("order-action-btn btn-success", approveLabel, function() {
        changeOrderStatus(row, 'delivered');
      });

      const cancelLabel = window.getTranslation ? window.getTranslation(lang, 'orders.cancel') : "لغو سفارش";
      const cancelBtn = createActionButton("order-action-btn btn-danger", cancelLabel, function() {
        changeOrderStatus(row, 'canceled');
      });

      actionsWrapper.appendChild(approveBtn);
      actionsWrapper.appendChild(cancelBtn);
    }
  }

  // به‌روزرسانی تمام ردیف‌ها با ترجمه‌های فعلی
  setTimeout(() => {
    rows.forEach(row => updateOrderRow(row));
  }, 100);

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filterText = btn.textContent.trim();
      applyOrderFilter(filterText);
    });
  });

  // اعمال فیلتر اولیه با ترجمه
  const initialLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
  const initialFilter = window.getTranslation ? window.getTranslation(initialLang, 'filter.all') : "همه";
  applyOrderFilter(initialFilter);
  setupOrderModal();
});

function refreshProducts() {
  loadProducts();
}

function deleteProduct(productId) {
  const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
  let products = getStorage("products");
  const product = products.find(item => item.id === productId);
  if (!product) {
    alert(window.getTranslation ? window.getTranslation(lang, 'products.notFound') : "محصول یافت نشد.");
    return;
  }
  const confirmMsg = window.getTranslation ? window.getTranslation(lang, 'products.deleteConfirm') : `آیا از حذف «${product.name}» مطمئن هستید؟`;
  const confirmed = confirm(confirmMsg.replace('{name}', product.name));
  if (!confirmed) {
    return;
  }
  products = products.filter(item => item.id !== productId);
  setStorage("products", products);
  refreshProducts();
  alert(window.getTranslation ? window.getTranslation(lang, 'products.deleteSuccess') : "محصول با موفقیت حذف شد.");
}

function editProduct(productId) {
  const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
  const products = getStorage("products");
  const product = products.find(item => item.id === productId);
  if (!product) {
    alert(window.getTranslation ? window.getTranslation(lang, 'products.notFound') : "محصول یافت نشد.");
    return;
  }

  const nameLabel = lang === 'en' ? 'Enter new product name:' : 'نام جدید محصول را وارد کنید:';
  const namePrompt = prompt(nameLabel, product.name);
  if (namePrompt === null) {
    return;
  }
  const trimmedName = namePrompt.trim();
  if (!trimmedName) {
    alert(window.getTranslation ? window.getTranslation(lang, 'products.nameRequired') : "نام محصول نمی‌تواند خالی باشد.");
    return;
  }

  const priceLabel = lang === 'en' ? 'Enter new price (Toman):' : 'قیمت جدید (تومان) را وارد کنید:';
  const pricePrompt = prompt(priceLabel, product.price);
  if (pricePrompt === null) {
    return;
  }
  const numericPrice = parseInt(String(pricePrompt).replace(/[,٫]/g, ""), 10);
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    alert(window.getTranslation ? window.getTranslation(lang, 'products.priceInvalid') : "قیمت وارد شده معتبر نیست.");
    return;
  }

  const categoryLabel = lang === 'en' ? 'Enter new product category:' : 'دسته جدید محصول را وارد کنید:';
  const categoryPrompt = prompt(categoryLabel, product.cat);
  if (categoryPrompt === null) {
    return;
  }
  const trimmedCategory = categoryPrompt.trim();
  if (!trimmedCategory) {
    alert(window.getTranslation ? window.getTranslation(lang, 'products.categoryRequired') : "دسته محصول نمی‌تواند خالی باشد.");
    return;
  }

  const descLabel = lang === 'en' ? 'Short product description (optional):' : 'توضیح کوتاه محصول (اختیاری):';
  const descPrompt = prompt(descLabel, product.desc || "");
  if (descPrompt === null) {
    return;
  }

  product.name = trimmedName;
  product.price = numericPrice;
  product.cat = trimmedCategory;
  product.desc = descPrompt.trim();

  setStorage("products", products);
  refreshProducts();
  alert(window.getTranslation ? window.getTranslation(lang, 'products.editSuccess') : "تغییرات محصول ذخیره شد.");
}

document.addEventListener("DOMContentLoaded", function() {
  const container = document.querySelector("#products .products-grid");
  if (!container) return;

  container.addEventListener("click", function(event) {
    const editBtn = event.target.closest(".edit-product");
    const deleteBtn = event.target.closest(".delete-product");
    if (editBtn) {
      const productId = parseInt(editBtn.dataset.id, 10);
      editProduct(productId);
    } else if (deleteBtn) {
      const productId = parseInt(deleteBtn.dataset.id, 10);
      deleteProduct(productId);
    }
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("productSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", function() {
    loadProducts(this.value);
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const userSearchInput = document.getElementById("userSearch");
  if (!userSearchInput) return;

  userSearchInput.addEventListener("input", function() {
    loadUsers(this.value);
  });
});

// --- مدیریت کاربران ---
function refreshUsers() {
  loadUsers();
}

function deleteUser(userId) {
  const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
  let users = getStorage("users");
  const user = users.find(item => item.id === userId);
  if (!user) {
    alert(window.getTranslation ? window.getTranslation(lang, 'users.notFound') : "کاربر یافت نشد.");
    return;
  }
  const confirmMsg = window.getTranslation ? window.getTranslation(lang, 'users.deleteConfirm') : `آیا از حذف «${user.name}» مطمئن هستید؟`;
  const confirmed = confirm(confirmMsg.replace('{name}', user.name));
  if (!confirmed) {
    return;
  }
  users = users.filter(item => item.id !== userId);
  setStorage("users", users);
  refreshUsers();
  alert(window.getTranslation ? window.getTranslation(lang, 'users.deleteSuccess') : "کاربر با موفقیت حذف شد.");
}

function editUser(userId) {
  const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
  const users = getStorage("users");
  const user = users.find(item => item.id === userId);
  if (!user) {
    alert(window.getTranslation ? window.getTranslation(lang, 'users.notFound') : "کاربر یافت نشد.");
    return;
  }

  const nameLabel = lang === 'en' ? 'Enter new user name:' : 'نام جدید کاربر را وارد کنید:';
  const namePrompt = prompt(nameLabel, user.name);
  if (namePrompt === null) {
    return;
  }
  const trimmedName = namePrompt.trim();
  if (!trimmedName) {
    alert(window.getTranslation ? window.getTranslation(lang, 'users.nameRequired') : "نام کاربر نمی‌تواند خالی باشد.");
    return;
  }

  const roleLabel = lang === 'en' ? 'Enter new user role (Admin or Customer):' : 'نقش جدید کاربر را وارد کنید (مدیر یا مشتری):';
  const rolePrompt = prompt(roleLabel, user.role);
  if (rolePrompt === null) {
    return;
  }
  const trimmedRole = rolePrompt.trim();
  const validRoles = lang === 'en' ? ['Admin', 'Customer'] : ['مدیر', 'مشتری'];
  if (!validRoles.includes(trimmedRole)) {
    alert(window.getTranslation ? window.getTranslation(lang, 'users.roleInvalid') : "نقش کاربر باید «مدیر» یا «مشتری» باشد.");
    return;
  }

  user.name = trimmedName;
  user.role = trimmedRole;

  setStorage("users", users);
  refreshUsers();
  alert(window.getTranslation ? window.getTranslation(lang, 'users.editSuccess') : "تغییرات کاربر ذخیره شد.");
}

document.addEventListener("DOMContentLoaded", function() {
  const usersContainer = document.querySelector("#users .users-list");
  if (!usersContainer) return;

  usersContainer.addEventListener("click", function(event) {
    const editBtn = event.target.closest(".edit-user");
    const deleteBtn = event.target.closest(".delete-user");
    if (editBtn) {
      const userId = parseInt(editBtn.dataset.id, 10);
      editUser(userId);
    } else if (deleteBtn) {
      const userId = parseInt(deleteBtn.dataset.id, 10);
      deleteUser(userId);
    }
  });
});

// --- مدیریت اعلان‌ها ---
function setupNotificationCenter() {
  const button = document.getElementById("notificationButton");
  const panel = document.getElementById("notificationsPanel");
  const markAllBtn = document.getElementById("markAllNotifications");

  if (!button || !panel) {
    return;
  }

  initializeNotificationsData();
  updateNotificationBadge();

  button.addEventListener("click", function(event) {
    event.stopPropagation();
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) {
      renderNotifications();
    }
  });

  document.addEventListener("click", function(event) {
    if (!panel.contains(event.target) && !button.contains(event.target)) {
      panel.classList.remove("open");
    }
  });

  if (markAllBtn) {
    markAllBtn.addEventListener("click", function(event) {
      event.preventDefault();
      markAllNotificationsAsRead();
    });
  }

  panel.addEventListener("click", handleNotificationActionClick);
}

function initializeNotificationsData() {
  let notifications = getStorage("notifications");
  if (!Array.isArray(notifications) || notifications.length === 0) {
    const timestamp = Date.now();
    notifications = [
      {
        id: timestamp,
        title: "سفارش جدید ثبت شد",
        message: "سفارش #12346 توسط کاربر جدید ایجاد شد.",
        time: "۵ دقیقه پیش",
        read: false
      },
      {
        id: timestamp - 1,
        title: "نظر جدید",
        message: "کاربر «زهرا احمدی» برای محصول موس گیمینگ نظر ثبت کرد.",
        time: "۱ ساعت پیش",
        read: false
      },
      {
        id: timestamp - 2,
        title: "کاربر جدید",
        message: "کاربر «سعید رستمی» به سیستم اضافه شد.",
        time: "دیروز",
        read: true
      }
    ];
    setStorage("notifications", notifications);
  }
}

function renderNotifications() {
  const listElement = document.getElementById("notificationsList");
  const emptyElement = document.getElementById("notificationsEmpty");
  const notifications = getStorage("notifications");

  if (!listElement || !emptyElement) {
    return;
  }

  listElement.innerHTML = "";

  if (!Array.isArray(notifications) || notifications.length === 0) {
    emptyElement.style.display = "block";
    return;
  }

  emptyElement.style.display = "none";

  const sorted = [...notifications].sort((a, b) => Number(a.read) - Number(b.read));

  const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
  sorted.forEach(notification => {
    const item = document.createElement("li");
    item.className = `notification-item${notification.read ? "" : " unread"}`;
    const actionText = notification.read 
      ? (window.getTranslation ? window.getTranslation(lang, 'notifications.markUnread') : "علامت‌گذاری خوانده نشده")
      : (window.getTranslation ? window.getTranslation(lang, 'notifications.markRead') : "علامت‌گذاری خوانده شد");
    item.innerHTML = `
      <div class="notification-title">${notification.title}</div>
      <div class="notification-message">${notification.message}</div>
      <div class="notification-footer">
        <span class="notification-time"><i class="fa-regular fa-clock"></i>${notification.time}</span>
        <button class="notification-action" data-id="${notification.id}">
          ${actionText}
        </button>
      </div>
    `;
    listElement.appendChild(item);
  });
}

function updateNotificationBadge() {
  const badge = document.getElementById("notificationBadge");
  const notifications = getStorage("notifications");
  if (!badge) {
    return;
  }

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter(notification => !notification.read).length
    : 0;

  badge.textContent = unreadCount;
  badge.style.display = unreadCount > 0 ? "flex" : "none";
}

function markAllNotificationsAsRead() {
  let notifications = getStorage("notifications");
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return;
  }

  notifications = notifications.map(notification => ({
    ...notification,
    read: true
  }));

  setStorage("notifications", notifications);
  renderNotifications();
  updateNotificationBadge();
}

function handleNotificationActionClick(event) {
  const actionButton = event.target.closest(".notification-action");
  if (!actionButton) {
    return;
  }

  event.preventDefault();
  const notificationId = parseInt(actionButton.dataset.id, 10);
  if (Number.isNaN(notificationId)) {
    return;
  }

  toggleNotificationRead(notificationId);
}

function toggleNotificationRead(notificationId) {
  const notifications = getStorage("notifications");
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return;
  }

  const target = notifications.find(notification => notification.id === notificationId);
  if (!target) {
    return;
  }

  target.read = !target.read;
  setStorage("notifications", notifications);
  renderNotifications();
  updateNotificationBadge();
}

function setupOrderModal() {
  const modal = document.getElementById("orderModal");
  const closeBtn = document.getElementById("closeOrderModal");
  const numberEl = document.getElementById("orderModalNumber");
  const customerEl = document.getElementById("orderModalCustomer");
  const productsEl = document.getElementById("orderModalProducts");
  const totalEl = document.getElementById("orderModalTotal");
  const statusEl = document.getElementById("orderModalStatus");
  const notesEl = document.getElementById("orderModalNotes");
  const productsListEl = document.getElementById("orderModalProductsList");
  const paymentEl = document.getElementById("orderModalPayment");
  const ordersTableBody = document.querySelector("#orders .modern-table tbody");

  if (!modal || !numberEl || !customerEl || !productsEl || !totalEl || !statusEl || !notesEl || !productsListEl || !paymentEl || !ordersTableBody) {
    return;
  }

  const body = document.body;

  function openModal() {
    // اعمال ترجمه‌ها قبل از باز کردن مودال
    const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
    if (window.applyTranslations) {
      window.applyTranslations(lang);
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
  }

  if (ordersTableBody.dataset.modalBound !== "true") {
    ordersTableBody.dataset.modalBound = "true";
    ordersTableBody.addEventListener("click", event => {
      const button = event.target.closest(".order-actions .btn-icon");
      if (!button) {
        return;
      }

      const row = button.closest("tr");
      if (!row) {
        return;
      }

      const cells = row.querySelectorAll("td");
      const statusBadge = row.querySelector(".status-badge");
      const modalLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
      const notesDefault = window.getTranslation ? window.getTranslation(modalLang, 'orderModal.notesEmpty') : "اطلاعات بیشتری برای این سفارش ثبت نشده است.";
      const notesText = row.dataset.notes ? row.dataset.notes.trim() : notesDefault;

      numberEl.textContent = cells[0] ? cells[0].textContent.trim() : "-";
      customerEl.textContent = cells[1] ? cells[1].textContent.trim() : "-";
      productsEl.textContent = cells[2] ? cells[2].textContent.trim() : "-";
      totalEl.textContent = cells[3] ? cells[3].textContent.trim() : "-";

      if (statusBadge) {
        // ترجمه وضعیت
        const statusCode = statusBadge.getAttribute('data-status-code');
        let statusText = statusBadge.textContent.trim();
        if (statusCode && window.getTranslation) {
          if (statusCode === 'delivered') {
            statusText = window.getTranslation(modalLang, 'status.delivered');
          } else if (statusCode === 'processing') {
            statusText = window.getTranslation(modalLang, 'status.processing');
          } else if (statusCode === 'pending') {
            statusText = window.getTranslation(modalLang, 'status.pending');
          } else if (statusCode === 'canceled') {
            statusText = window.getTranslation(modalLang, 'status.canceled');
          }
        }
        statusEl.textContent = statusText;
        statusEl.className = statusBadge.className;
        statusEl.setAttribute('data-status-code', statusCode || '');
      } else {
        statusEl.textContent = "-";
        statusEl.className = "status-badge";
      }

      // به‌روزرسانی یادداشت‌ها - اگر یادداشت پیش‌فرض است، ترجمه کن
      if (!row.dataset.notes || row.dataset.notes.trim() === '') {
        const notesDefaultKey = document.getElementById('orderModalNotes')?.getAttribute('data-i18n-key');
        if (notesDefaultKey && window.getTranslation) {
          notesEl.textContent = window.getTranslation(modalLang, notesDefaultKey);
        } else {
          notesEl.textContent = notesText;
        }
      } else {
        notesEl.textContent = notesText;
      }
      const productsData = row.dataset.products || "";
      const productItems = productsData
        .split("|")
        .map(item => item.trim())
        .filter(item => item.length > 0);
      productsListEl.innerHTML = "";
      if (productItems.length === 0) {
        const emptyItem = document.createElement("li");
        const emptyText = window.getTranslation ? window.getTranslation(modalLang, 'orderModal.productsEmpty') : "—";
        emptyItem.textContent = emptyText;
        productsListEl.appendChild(emptyItem);
      } else {
        productItems.forEach(item => {
          const li = document.createElement("li");
          li.textContent = item;
          productsListEl.appendChild(li);
        });
      }

      const paymentEmpty = window.getTranslation ? window.getTranslation(modalLang, 'orderModal.paymentEmpty') : "مشخص نشده است.";
      
      // اگر payment خالی است، ترجمه را اعمال کن
      if (!row.dataset.payment || row.dataset.payment.trim() === '') {
        const paymentKey = paymentEl.getAttribute('data-i18n-key');
        if (paymentKey && window.getTranslation) {
          paymentEl.textContent = window.getTranslation(modalLang, paymentKey);
        } else {
          paymentEl.textContent = paymentEmpty;
        }
      } else {
        paymentEl.textContent = row.dataset.payment.trim();
      }

      openModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
}

// --- مدیریت نظرات ---
// تابع برای بارگذاری نظرات از localStorage یا ایجاد داده‌های نمونه
function initializeComments() {
  let comments = getStorage("comments");
  
  // اگر نظری وجود نداشت، داده‌های نمونه ایجاد کن
  if (comments.length === 0) {
    comments = [
      {
        id: 1,
        user: "علی محمدی",
        date: "1403/01/15",
        rating: 5,
        text: "محصول عالی بود، کیفیت خوبی داشت. پیشنهاد می‌کنم.",
        product: "لپ‌تاپ اپل",
        status: "pending" // pending, approved, rejected
      },
      {
        id: 2,
        user: "فاطمه رضایی",
        date: "1403/01/14",
        rating: 4,
        text: "خوب بود ولی می‌تونست بهتر باشه.",
        product: "گوشی موبایل سامسونگ",
        status: "pending"
      },
      {
        id: 3,
        user: "محمد کریمی",
        date: "1403/01/13",
        rating: 5,
        text: "بسیار راضی بودم. کیفیت عالی و قیمت مناسب.",
        product: "هدفون سونی",
        status: "approved"
      },
      {
        id: 4,
        user: "زهرا احمدی",
        date: "1403/01/12",
        rating: 3,
        text: "متوسط بود.",
        product: "موس گیمینگ",
        status: "rejected"
      }
    ];
    setStorage("comments", comments);
  }
  
  return comments;
}

// تابع برای نمایش نظرات
function renderComments(filterStatus = "all") {
  const comments = getStorage("comments");
  const container = document.getElementById("commentsList");
  
  if (!container) return;
  
  container.innerHTML = "";
  
  // فیلتر کردن نظرات
  const filteredComments = comments.filter(comment => {
    if (filterStatus === "all") return true;
    if (filterStatus === "approved") return comment.status === "approved";
    if (filterStatus === "pending") return comment.status === "pending";
    return true;
  });
  
  const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
  if (filteredComments.length === 0) {
    const emptyMsg = window.getTranslation ? window.getTranslation(lang, 'comments.empty') : 'نظری یافت نشد.';
    container.innerHTML = `<div style="text-align: center; padding: 40px; color: #64748b;">${emptyMsg}</div>`;
    return;
  }
  
  filteredComments.forEach(comment => {
    const card = document.createElement("div");
    card.className = "comment-card";
    card.dataset.commentId = comment.id;
    card.dataset.status = comment.status;
    
    const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
    // نمایش وضعیت
    let statusBadge = "";
    if (comment.status === "approved") {
      const statusText = window.getTranslation ? window.getTranslation(lang, 'status.approved') : 'تأیید شده';
      statusBadge = `<span class="status-badge success" style="margin-left: 12px;">${statusText}</span>`;
    } else if (comment.status === "rejected") {
      const statusText = window.getTranslation ? window.getTranslation(lang, 'status.rejected') : 'رد شده';
      statusBadge = `<span class="status-badge danger" style="margin-left: 12px;">${statusText}</span>`;
    } else {
      const statusText = window.getTranslation ? window.getTranslation(lang, 'filter.pendingApproval') : 'در انتظار تأیید';
      statusBadge = `<span class="status-badge pending" style="margin-left: 12px;">${statusText}</span>`;
    }
    
    // ایجاد ستاره‌ها
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= comment.rating) {
        starsHTML += '<i class="fa-solid fa-star"></i>';
      } else {
        starsHTML += '<i class="fa-regular fa-star"></i>';
      }
    }
    
    // دکمه‌های عملیات (فقط برای نظرات در انتظار تأیید)
    const approveText = window.getTranslation ? window.getTranslation(lang, 'comments.approve') : 'تأیید';
    const rejectText = window.getTranslation ? window.getTranslation(lang, 'comments.reject') : 'رد';
    let actionsHTML = "";
    if (comment.status === "pending") {
      actionsHTML = `
        <button class="btn-success approve-comment" data-id="${comment.id}">${approveText}</button>
        <button class="btn-danger reject-comment" data-id="${comment.id}">${rejectText}</button>
      `;
    } else if (comment.status === "approved") {
      actionsHTML = `
        <button class="btn-danger reject-comment" data-id="${comment.id}">${rejectText}</button>
      `;
    } else {
      actionsHTML = `
        <button class="btn-success approve-comment" data-id="${comment.id}">${approveText}</button>
      `;
    }
    
    const productLabel = window.getTranslation ? window.getTranslation(lang, 'comments.product') : 'محصول:';
    card.innerHTML = `
      <div class="comment-header">
        <div class="comment-user">
          <div class="user-avatar-small">
            <i class="fa-solid fa-user"></i>
          </div>
          <div>
            <h4>${comment.user} ${statusBadge}</h4>
            <span class="comment-date">${comment.date}</span>
          </div>
        </div>
        <div class="comment-rating">
          ${starsHTML}
        </div>
      </div>
      <div class="comment-body">
        <p>${comment.text}</p>
        <span class="comment-product">${productLabel} ${comment.product}</span>
      </div>
      <div class="comment-actions">
        ${actionsHTML}
      </div>
    `;
    
    container.appendChild(card);
  });
  
  // اضافه کردن event listener برای دکمه‌های تأیید و رد
  attachCommentEventListeners();
}

// تابع برای اضافه کردن event listener به دکمه‌های نظرات
function attachCommentEventListeners() {
  // دکمه‌های تأیید
  document.querySelectorAll(".approve-comment").forEach(btn => {
    btn.addEventListener("click", function() {
      const commentId = parseInt(this.dataset.id);
      approveComment(commentId);
    });
  });
  
  // دکمه‌های رد
  document.querySelectorAll(".reject-comment").forEach(btn => {
    btn.addEventListener("click", function() {
      const commentId = parseInt(this.dataset.id);
      rejectComment(commentId);
    });
  });
}

// تابع برای تأیید نظر
function getActiveCommentFilterCode() {
  const activeFilter = document.querySelector("#comments .filter-btn.active");
  const filterCode = activeFilter ? activeFilter.dataset.filter : "all";
  if (filterCode === "approved") return "approved";
  if (filterCode === "pending") return "pending";
  return "all";
}

function archiveHandledComment(comment) {
  if (!comment) {
    return;
  }
  const handled = getStorage("handledComments");
  const normalizedHandled = Array.isArray(handled) ? handled : [];
  normalizedHandled.push({
    ...comment,
    handledAt: new Date().toISOString()
  });
  setStorage("handledComments", normalizedHandled);
}

function finalizeCommentStatus(commentId, newStatus) {
  const comments = getStorage("comments");
  if (!Array.isArray(comments) || comments.length === 0) {
    return null;
  }
  const index = comments.findIndex(c => c.id === commentId);
  if (index === -1) {
    return null;
  }
  const updatedComment = {
    ...comments[index],
    status: newStatus
  };
  comments[index] = updatedComment;
  setStorage("comments", comments);
  return updatedComment;
}

function approveComment(commentId) {
  const handledComment = finalizeCommentStatus(commentId, "approved");
  if (handledComment) {
    archiveHandledComment(handledComment);
    renderComments(getActiveCommentFilterCode());
  }
}

// تابع برای رد نظر
function rejectComment(commentId) {
  const handledComment = finalizeCommentStatus(commentId, "rejected");
  if (handledComment) {
    archiveHandledComment(handledComment);
    renderComments(getActiveCommentFilterCode());
  }
}

// مدیریت فیلترهای نظرات
document.addEventListener("DOMContentLoaded", function() {
  // مقداردهی اولیه نظرات
  initializeComments();
  
  // اگر بخش نظرات وجود دارد، نظرات را بارگذاری کن
  const commentsList = document.getElementById("commentsList");
  if (commentsList) {
    // بررسی اینکه آیا بخش نظرات فعال است یا نه
    const commentsPage = document.getElementById("comments");
    if (commentsPage && commentsPage.classList.contains("active")) {
      renderComments("all");
    }
  }
  
  // مدیریت فیلترها
  const filterButtons = document.querySelectorAll("#comments .filter-btn");
  
  filterButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      // حذف active از همه دکمه‌ها
      filterButtons.forEach(b => b.classList.remove("active"));
      // اضافه کردن active به دکمه کلیک شده
      this.classList.add("active");
      
      const filterCode = this.dataset.commentFilter || this.dataset.filter || "all";
      renderComments(filterCode);
    });
  });
  
});
(function () {
  'use strict';

  const STORAGE_KEY = 'panelSettings';
  const defaultSettings = Object.freeze({
    shopName: 'پارسا فروشگاه',
    adminEmail: 'admin@parsa-shop.ir',
    adminPhone: '021-12345678',
    notifyOrders: true,
    notifyComments: true,
    notifyUsers: false,
    colorTheme: 'light',
    language: 'fa'
  });

  const i18nMessages = {
    fa: {
      'app.title': 'پنل مدیریت - {name}',
      'nav.dashboard': 'داشبورد',
      'nav.products': 'مدیریت محصول',
      'nav.orders': 'مدیریت سفارش',
      'nav.users': 'مدیریت کاربران',
      'nav.comments': 'مدیریت نظرات',
      'nav.settings': 'تنظیمات',
      'stats.products': 'تعداد محصولات',
      'stats.orders': 'سفارشات فعال',
      'stats.users': 'کاربران ثبت‌نام شده',
      'stats.revenue': 'درآمد این ماه',
      'card.latestOrders': 'آخرین سفارشات',
      'action.viewAll': 'مشاهده همه',
      'card.productsList': 'لیست محصولات',
      'action.addProduct': 'افزودن محصول جدید',
      'placeholder.searchProducts': 'جستجو در محصولات...',
      'card.ordersManage': 'مدیریت سفارشات',
      'filter.all': 'همه',
      'filter.pending': 'در انتظار',
      'filter.processing': 'در حال پردازش',
      'filter.delivered': 'تحویل شده',
      'filter.canceled': 'لغو شده',
      'filter.approved': 'تأیید شده',
      'filter.pendingApproval': 'در انتظار تأیید',
      'table.orderId': 'شماره سفارش',
      'table.customer': 'مشتری',
      'table.products': 'محصولات',
      'table.total': 'مبلغ کل',
      'table.amount': 'مبلغ',
      'table.status': 'وضعیت',
      'table.actions': 'عملیات',
      'table.date': 'تاریخ',
      'card.usersManage': 'مدیریت کاربران',
      'action.addUser': 'افزودن کاربر جدید',
      'placeholder.searchUsers': 'جستجو در کاربران...',
      'card.commentsManage': 'مدیریت نظرات',
      'settings.title': 'تنظیمات سیستم',
      'settings.general': 'تنظیمات عمومی',
      'settings.notifications': 'تنظیمات اعلان‌ها',
      'settings.appearance': 'ظاهر و نمایش',
      'label.shopName': 'نام فروشگاه',
      'label.adminEmail': 'ایمیل مدیریت',
      'label.adminPhone': 'شماره تماس',
      'label.notifyOrders': 'اعلان ایمیل برای سفارشات جدید',
      'label.notifyComments': 'اعلان برای نظرات جدید',
      'label.notifyUsers': 'اعلان برای کاربران جدید',
      'label.colorTheme': 'تم رنگی',
      'label.language': 'زبان',
      'theme.light': 'روشن',
      'theme.dark': 'تیره',
      'theme.auto': 'خودکار',
      'language.fa': 'فارسی',
      'language.en': 'English',
      'action.save': 'ذخیره تغییرات',
      'action.reset': 'بازنشانی',
      'validation.shopNameRequired': 'نام فروشگاه نمی‌تواند خالی باشد.',
      'validation.emailInvalid': 'ایمیل مدیریت معتبر نیست.',
      'validation.phoneRequired': 'شماره تماس مدیریت را وارد کنید.',
      'feedback.saveSuccess': 'تنظیمات با موفقیت ذخیره شد.',
      'feedback.saveError': 'ذخیره تنظیمات با خطا مواجه شد.',
      'feedback.resetConfirm': 'آیا از بازنشانی تنظیمات به حالت اولیه مطمئن هستید؟',
      'feedback.resetSuccess': 'تنظیمات به حالت اولیه بازگردانده شد.',
      'user.role.admin': 'مدیر سیستم',
      'user.role.customer': 'مشتری',
      'users.ordersLabel': 'سفارشات',
      'status.delivered': 'تحویل شده',
      'status.processing': 'در حال پردازش',
      'status.pending': 'در انتظار',
      'status.canceled': 'لغو شده',
      'status.approved': 'تأیید شده',
      'status.rejected': 'رد شده',
      'notifications.title': 'اعلان‌های اخیر',
      'notifications.markAll': 'علامت‌گذاری همه',
      'notifications.empty': 'اعلانی وجود ندارد.',
      'notifications.markRead': 'علامت‌گذاری خوانده شد',
      'notifications.markUnread': 'علامت‌گذاری خوانده نشده',
      'orderModal.title': 'جزئیات سفارش',
      'orderModal.close': 'بستن پنجره',
      'orderModal.number': 'شماره سفارش',
      'orderModal.customer': 'نام مشتری',
      'orderModal.productsCount': 'تعداد محصولات',
      'orderModal.total': 'مبلغ کل',
      'orderModal.status': 'وضعیت',
      'orderModal.notesDefault': 'برای مشاهده جزئیات بیشتر، سفارش را از بخش مدیریت انتخاب کنید.',
      'orderModal.productsHeading': 'محصولات خریداری شده',
      'orderModal.productsEmpty': '—',
      'orderModal.paymentHeading': 'روش پرداخت',
      'orderModal.paymentEmpty': 'مشخص نشده است.',
      'orderModal.notesEmpty': 'اطلاعات بیشتری برای این سفارش ثبت نشده است.',
      'products.empty': 'هیچ محصولی ثبت نشده است.',
      'products.emptySearch': 'هیچ محصولی با عبارت «{term}» یافت نشد.',
      'products.noProducts': 'محصولی برای نمایش وجود ندارد.',
      'products.category': 'دسته:',
      'products.edit': 'ویرایش محصول',
      'products.delete': 'حذف محصول',
      'products.deleteConfirm': 'آیا از حذف «{name}» مطمئن هستید؟',
      'products.deleteSuccess': 'محصول با موفقیت حذف شد.',
      'products.notFound': 'محصول یافت نشد.',
      'products.editSuccess': 'تغییرات محصول ذخیره شد.',
      'products.nameRequired': 'نام محصول نمی‌تواند خالی باشد.',
      'products.priceInvalid': 'قیمت وارد شده معتبر نیست.',
      'products.categoryRequired': 'دسته محصول نمی‌تواند خالی باشد.',
      'users.empty': 'هیچ کاربری ثبت نشده است.',
      'users.emptySearch': 'هیچ کاربری با عبارت «{term}» یافت نشد.',
      'users.noUsers': 'کاربری برای نمایش وجود ندارد.',
      'users.role': 'نقش',
      'users.edit': 'ویرایش کاربر',
      'users.delete': 'حذف کاربر',
      'users.deleteConfirm': 'آیا از حذف «{name}» مطمئن هستید؟',
      'users.deleteSuccess': 'کاربر با موفقیت حذف شد.',
      'users.notFound': 'کاربر یافت نشد.',
      'users.editSuccess': 'تغییرات کاربر ذخیره شد.',
      'users.nameRequired': 'نام کاربر نمی‌تواند خالی باشد.',
      'users.roleInvalid': 'نقش کاربر باید «مدیر» یا «مشتری» باشد.',
      'comments.empty': 'نظری یافت نشد.',
      'comments.approve': 'تأیید',
      'comments.reject': 'رد',
      'comments.product': 'محصول:',
      'orders.approve': 'تأیید سفارش',
      'orders.cancel': 'لغو سفارش',
      'addProduct.title': 'افزودن محصول تازه به فروشگاه',
      'addProduct.badge': 'محصول جدید',
      'addProduct.description': 'اطلاعات محصول را با دقت وارد کنید تا تجربه خرید مشتریان بهتر شود. تصویر جذاب، قیمت دقیق و دسته‌بندی مناسب به دیده‌شدن سریع‌تر محصول کمک می‌کند.',
      'addProduct.uploadTitle': 'آپلود تصویر محصول',
      'addProduct.uploadDesc': 'تصویر واضح و باکیفیت جذابیت محصول را چند برابر می‌کند. فرمت‌های رایج مانند JPG یا PNG پشتیبانی می‌شود.',
      'addProduct.selectImage': 'انتخاب تصویر از دستگاه',
      'addProduct.imagePreview': 'پیش‌نمایش تصویر محصول',
      'addProduct.tip1': 'نسبت تصویر پیشنهادی ۱:۱ یا ۴:۳ است.',
      'addProduct.tip2': 'حداکثر حجم فایل پیشنهادی ۲ مگابایت.',
      'addProduct.name': 'نام محصول',
      'addProduct.namePlaceholder': 'مثال: چراغ مطالعه رومیزی مدل Aurora',
      'addProduct.price': 'قیمت (تومان)',
      'addProduct.pricePlaceholder': 'مثال: 1150000',
      'addProduct.category': 'دسته محصول',
      'addProduct.categorySelect': 'انتخاب دسته...',
      'addProduct.category1': 'الکترونیک',
      'addProduct.category2': 'خانه و آشپزخانه',
      'addProduct.category3': 'کتاب و نوشت‌افزار',
      'addProduct.category4': 'پوشاک',
      'addProduct.category5': 'زیبایی و سلامت',
      'addProduct.category6': 'ورزش و سفر',
      'addProduct.category7': 'سایر',
      'addProduct.description': 'توضیح کوتاه (اختیاری)',
      'addProduct.descriptionPlaceholder': 'ویژگی شاخص محصول را در یک جمله بنویسید',
      'addProduct.submit': 'ثبت محصول',
      'addProduct.submitNote': 'پس از ثبت، محصول در لیست مدیریت محصولات نمایش داده می‌شود.',
      'addProduct.fillAll': 'لطفاً همه فیلدها را پر کنید',
      'addProduct.success': '✅ محصول با موفقیت اضافه شد',
      'addUser.title': 'افزودن کاربر جدید به فروشگاه',
      'addUser.badge': 'کاربر جدید',
      'addUser.description': 'اطلاعات کاربر را با دقت وارد کنید تا تجربه خرید مشتریان بهتر شود.',
      'addUser.name': 'نام کاربر',
      'addUser.namePlaceholder': 'مثال: علی محمدی',
      'addUser.role': 'نقش کاربر',
      'addUser.roleSelect': 'انتخاب نقش...',
      'addUser.roleAdmin': 'مدیر',
      'addUser.roleCustomer': 'مشتری',
      'addUser.submit': 'ثبت کاربر',
      'addUser.submitNote': 'پس از ثبت، کاربر در لیست کاربران نمایش داده می‌شود.',
      'addUser.fillAll': 'لطفاً همه فیلدها را پر کنید',
      'addUser.exists': '⚠️ کاربری با این نام قبلاً ثبت شده است',
      'addUser.success': '✅ کاربر با موفقیت اضافه شد'
    },
    en: {
      'app.title': '{name} Admin Panel',
      'nav.dashboard': 'Dashboard',
      'nav.products': 'Products',
      'nav.orders': 'Orders',
      'nav.users': 'Users',
      'nav.comments': 'Comments',
      'nav.settings': 'Settings',
      'stats.products': 'Products Count',
      'stats.orders': 'Active Orders',
      'stats.users': 'Registered Users',
      'stats.revenue': 'Revenue This Month',
      'card.latestOrders': 'Latest Orders',
      'action.viewAll': 'View all',
      'card.productsList': 'Products list',
      'action.addProduct': 'Add new product',
      'placeholder.searchProducts': 'Search products...',
      'card.ordersManage': 'Order management',
      'filter.all': 'All',
      'filter.pending': 'Pending',
      'filter.processing': 'Processing',
      'filter.delivered': 'Delivered',
      'filter.canceled': 'Canceled',
      'filter.approved': 'Approved',
      'filter.pendingApproval': 'Pending approval',
      'table.orderId': 'Order ID',
      'table.customer': 'Customer',
      'table.products': 'Products',
      'table.total': 'Total amount',
      'table.amount': 'Amount',
      'table.status': 'Status',
      'table.actions': 'Actions',
      'table.date': 'Date',
      'card.usersManage': 'User management',
      'action.addUser': 'Add new user',
      'placeholder.searchUsers': 'Search users...',
      'card.commentsManage': 'Comments management',
      'settings.title': 'System settings',
      'settings.general': 'General settings',
      'settings.notifications': 'Notifications',
      'settings.appearance': 'Appearance',
      'label.shopName': 'Store name',
      'label.adminEmail': 'Admin email',
      'label.adminPhone': 'Phone number',
      'label.notifyOrders': 'Email notification for new orders',
      'label.notifyComments': 'Notification for new comments',
      'label.notifyUsers': 'Notification for new users',
      'label.colorTheme': 'Color theme',
      'label.language': 'Language',
      'theme.light': 'Light',
      'theme.dark': 'Dark',
      'theme.auto': 'Auto',
      'language.fa': 'Persian',
      'language.en': 'English',
      'action.save': 'Save changes',
      'action.reset': 'Reset',
      'validation.shopNameRequired': 'Store name is required.',
      'validation.emailInvalid': 'Admin email is not valid.',
      'validation.phoneRequired': 'Please enter admin phone number.',
      'feedback.saveSuccess': 'Settings have been saved successfully.',
      'feedback.saveError': 'Saving settings failed.',
      'feedback.resetConfirm': 'Are you sure you want to reset settings to defaults?',
      'feedback.resetSuccess': 'Settings have been reset to defaults.',
      'user.role.admin': 'System Admin',
      'user.role.customer': 'Customer',
      'users.ordersLabel': 'Orders',
      'status.delivered': 'Delivered',
      'status.processing': 'Processing',
      'status.pending': 'Pending',
      'status.canceled': 'Canceled',
      'status.approved': 'Approved',
      'status.rejected': 'Rejected',
      'notifications.title': 'Recent Notifications',
      'notifications.markAll': 'Mark all as read',
      'notifications.empty': 'No notifications.',
      'notifications.markRead': 'Mark as read',
      'notifications.markUnread': 'Mark as unread',
      'orderModal.title': 'Order Details',
      'orderModal.close': 'Close window',
      'orderModal.number': 'Order Number',
      'orderModal.customer': 'Customer Name',
      'orderModal.productsCount': 'Products Count',
      'orderModal.total': 'Total Amount',
      'orderModal.status': 'Status',
      'orderModal.notesDefault': 'To view more details, select the order from the management section.',
      'orderModal.productsHeading': 'Purchased Products',
      'orderModal.productsEmpty': '—',
      'orderModal.paymentHeading': 'Payment Method',
      'orderModal.paymentEmpty': 'Not specified.',
      'orderModal.notesEmpty': 'No additional information has been recorded for this order.',
      'products.empty': 'No products have been registered.',
      'products.emptySearch': 'No products found with the term «{term}».',
      'products.noProducts': 'No products to display.',
      'products.category': 'Category:',
      'products.edit': 'Edit product',
      'products.delete': 'Delete product',
      'products.deleteConfirm': 'Are you sure you want to delete «{name}»?',
      'products.deleteSuccess': 'Product deleted successfully.',
      'products.notFound': 'Product not found.',
      'products.editSuccess': 'Product changes saved.',
      'products.nameRequired': 'Product name cannot be empty.',
      'products.priceInvalid': 'The entered price is not valid.',
      'products.categoryRequired': 'Product category cannot be empty.',
      'users.empty': 'No users have been registered.',
      'users.emptySearch': 'No users found with the term «{term}».',
      'users.noUsers': 'No users to display.',
      'users.role': 'Role',
      'users.edit': 'Edit user',
      'users.delete': 'Delete user',
      'users.deleteConfirm': 'Are you sure you want to delete «{name}»?',
      'users.deleteSuccess': 'User deleted successfully.',
      'users.notFound': 'User not found.',
      'users.editSuccess': 'User changes saved.',
      'users.nameRequired': 'User name cannot be empty.',
      'users.roleInvalid': 'User role must be "Admin" or "Customer".',
      'comments.empty': 'No comments found.',
      'comments.approve': 'Approve',
      'comments.reject': 'Reject',
      'comments.product': 'Product:',
      'orders.approve': 'Approve Order',
      'orders.cancel': 'Cancel Order',
      'addProduct.title': 'Add New Product to Store',
      'addProduct.badge': 'New Product',
      'addProduct.description': 'Enter product information carefully to improve customer shopping experience. Attractive image, accurate price and proper categorization help the product to be seen faster.',
      'addProduct.uploadTitle': 'Upload Product Image',
      'addProduct.uploadDesc': 'Clear and high-quality image multiplies product appeal. Common formats such as JPG or PNG are supported.',
      'addProduct.selectImage': 'Select Image from Device',
      'addProduct.imagePreview': 'Product Image Preview',
      'addProduct.tip1': 'Suggested image ratio is 1:1 or 4:3.',
      'addProduct.tip2': 'Maximum suggested file size is 2 megabytes.',
      'addProduct.name': 'Product Name',
      'addProduct.namePlaceholder': 'Example: Aurora Desktop Study Lamp',
      'addProduct.price': 'Price (Toman)',
      'addProduct.pricePlaceholder': 'Example: 1150000',
      'addProduct.category': 'Product Category',
      'addProduct.categorySelect': 'Select category...',
      'addProduct.category1': 'Electronics',
      'addProduct.category2': 'Home & Kitchen',
      'addProduct.category3': 'Books & Stationery',
      'addProduct.category4': 'Clothing',
      'addProduct.category5': 'Beauty & Health',
      'addProduct.category6': 'Sports & Travel',
      'addProduct.category7': 'Other',
      'addProduct.description': 'Short Description (Optional)',
      'addProduct.descriptionPlaceholder': 'Write the product\'s key feature in one sentence',
      'addProduct.submit': 'Register Product',
      'addProduct.submitNote': 'After registration, the product will be displayed in the product management list.',
      'addProduct.fillAll': 'Please fill in all fields',
      'addProduct.success': '✅ Product added successfully',
      'addUser.title': 'Add New User to Store',
      'addUser.badge': 'New User',
      'addUser.description': 'Enter user information carefully to improve customer shopping experience.',
      'addUser.name': 'User Name',
      'addUser.namePlaceholder': 'Example: Ali Mohammadi',
      'addUser.role': 'User Role',
      'addUser.roleSelect': 'Select role...',
      'addUser.roleAdmin': 'Admin',
      'addUser.roleCustomer': 'Customer',
      'addUser.submit': 'Register User',
      'addUser.submitNote': 'After registration, the user will be displayed in the users list.',
      'addUser.fillAll': 'Please fill in all fields',
      'addUser.exists': '⚠️ A user with this name has already been registered',
      'addUser.success': '✅ User added successfully'
    }
  };

  let controls = null;
  let isInitialized = false;
  let currentSettings = null;
  let isDirty = false;
  let feedbackTimer = null;
  let themeMediaQuery = null;
  let currentLanguage = defaultSettings.language;

  function queryControls() {
    if (controls) {
      return controls;
    }

    const section = document.getElementById('settings');
    if (!section) {
      return null;
    }

    controls = {
      section,
      shopNameInput: document.getElementById('settingsShopName'),
      adminEmailInput: document.getElementById('settingsAdminEmail'),
      adminPhoneInput: document.getElementById('settingsAdminPhone'),
      notifyOrdersCheckbox: document.getElementById('notifyOrdersCheckbox'),
      notifyCommentsCheckbox: document.getElementById('notifyCommentsCheckbox'),
      notifyUsersCheckbox: document.getElementById('notifyUsersCheckbox'),
      themeSelect: document.getElementById('colorThemeSelect'),
      languageSelect: document.getElementById('languageSelect'),
      saveButton: document.getElementById('saveSettingsBtn'),
      resetButton: document.getElementById('resetSettingsBtn'),
      feedback: document.getElementById('settingsFeedback')
    };

    return controls;
  }

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      console.warn('Settings parse error:', error);
      return null;
    }
  }

  function getStoredSettings() {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY));
    if (stored && typeof stored === 'object') {
      return { ...defaultSettings, ...stored };
    }
    return { ...defaultSettings };
  }

  function persistSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw new Error('امکان ذخیره تنظیمات وجود ندارد.');
    }
  }

  function applySettingsToForm(settings) {
    const refs = queryControls();
    if (!refs) {
      return;
    }

    refs.shopNameInput.value = settings.shopName || defaultSettings.shopName;
    refs.adminEmailInput.value = settings.adminEmail || defaultSettings.adminEmail;
    refs.adminPhoneInput.value = settings.adminPhone || defaultSettings.adminPhone;
    refs.notifyOrdersCheckbox.checked = Boolean(settings.notifyOrders);
    refs.notifyCommentsCheckbox.checked = Boolean(settings.notifyComments);
    refs.notifyUsersCheckbox.checked = Boolean(settings.notifyUsers);
    refs.themeSelect.value = normalizeTheme(settings.colorTheme);
    refs.languageSelect.value = ['fa', 'en'].includes(settings.language) ? settings.language : defaultSettings.language;

    currentSettings = { ...settings };
    applySettingsToUI(currentSettings);
    setDirtyState(false);
    clearFeedback();
  }

  function collectSettingsFromForm() {
    const refs = queryControls();
    if (!refs) {
      return { ...defaultSettings };
    }

    return {
      shopName: refs.shopNameInput.value.trim(),
      adminEmail: refs.adminEmailInput.value.trim(),
      adminPhone: refs.adminPhoneInput.value.trim(),
      notifyOrders: refs.notifyOrdersCheckbox.checked,
      notifyComments: refs.notifyCommentsCheckbox.checked,
      notifyUsers: refs.notifyUsersCheckbox.checked,
      colorTheme: normalizeTheme(refs.themeSelect.value),
      language: ['fa', 'en'].includes(refs.languageSelect.value) ? refs.languageSelect.value : defaultSettings.language
    };
  }

  function normalizeTheme(theme) {
    if (theme === 'dark' || theme === 'auto') {
      return theme;
    }
    return 'light';
  }

  function validateSettings(settings) {
    if (!settings.shopName) {
      return getTranslation(currentLanguage, 'validation.shopNameRequired');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(settings.adminEmail)) {
      return getTranslation(currentLanguage, 'validation.emailInvalid');
    }

    if (!settings.adminPhone) {
      return getTranslation(currentLanguage, 'validation.phoneRequired');
    }

    return '';
  }

  function setDirtyState(state) {
    const refs = queryControls();
    if (!refs) {
      return;
    }

    isDirty = state;
    if (refs.saveButton) {
      refs.saveButton.disabled = !state;
      refs.saveButton.setAttribute('aria-disabled', String(!state));
    }
  }

  function markDirty() {
    if (!isDirty) {
      setDirtyState(true);
    }
  }

  function showFeedback(message, type = 'success') {
    const refs = queryControls();
    if (!refs || !refs.feedback) {
      return;
    }

    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
    }

    refs.feedback.textContent = message;
    refs.feedback.classList.remove('success', 'error');
    refs.feedback.classList.add(type === 'error' ? 'error' : 'success');

    feedbackTimer = window.setTimeout(() => {
      clearFeedback();
    }, 4500);
  }

  function clearFeedback() {
    const refs = queryControls();
    if (!refs || !refs.feedback) {
      return;
    }
    refs.feedback.textContent = '';
    refs.feedback.classList.remove('success', 'error');
  }

  function syncColorTheme(theme) {
    const root = document.documentElement;
    if (!root) {
      return;
    }

    const normalizedTheme = normalizeTheme(theme);
    if (normalizedTheme === 'auto' && window.matchMedia) {
      if (!themeMediaQuery) {
        themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        themeMediaQuery.addEventListener('change', handleSystemThemeChange);
      }
      root.dataset.theme = themeMediaQuery.matches ? 'dark' : 'light';
    } else {
      if (themeMediaQuery) {
        themeMediaQuery.removeEventListener('change', handleSystemThemeChange);
        themeMediaQuery = null;
      }
      root.dataset.theme = normalizedTheme;
    }
  }

  function handleSystemThemeChange(event) {
    const refs = queryControls();
    if (refs?.themeSelect?.value === 'auto') {
      document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
    }
  }

  function syncLanguage(language) {
    currentLanguage = ['fa', 'en'].includes(language) ? language : defaultSettings.language;
    document.documentElement.lang = currentLanguage;
    const dir = currentLanguage === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    if (document.body) {
      document.body.dir = dir;
    }
    applyTranslations(currentLanguage);
    updatePageTitleFromMenu();
    // به‌روزرسانی نام فروشگاه (اگر تنظیمات ذخیره شده وجود دارد)
    if (currentSettings && currentSettings.shopName) {
      updateShopNameDisplays(currentSettings.shopName);
      updateDocumentTitle(currentSettings.shopName);
    }
    // اطلاع‌رسانی به سایر بخش‌ها برای به‌روزرسانی
    if (window.refreshAllContentOnLanguageChange) {
      setTimeout(window.refreshAllContentOnLanguageChange, 100);
    }
  }
  
  window.syncLanguage = syncLanguage;

  function updatePageTitleFromMenu() {
    const pageTitleElement = document.querySelector('.page-title');
    const activeMenu = document.querySelector('.menu-item.active span');
    if (pageTitleElement && activeMenu) {
      pageTitleElement.textContent = activeMenu.textContent.trim();
    }
  }

  function getTranslation(language, key) {
    const catalog = i18nMessages[language] || i18nMessages.fa;
    return catalog[key] || i18nMessages.fa[key] || '';
  }

  function applyTranslations(language) {
    const catalog = i18nMessages[language] || i18nMessages.fa;
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
      const key = element.getAttribute('data-i18n-key');
      if (!key || !(key in catalog)) {
        return;
      }
      const attr = element.getAttribute('data-i18n-attr');
      if (attr) {
        element.setAttribute(attr, catalog[key]);
      } else {
        element.textContent = catalog[key];
      }
    });
  }

  function updateShopNameDisplays(value) {
    const displayValue = value && value.trim() ? value.trim() : defaultSettings.shopName;
    document.querySelectorAll('[data-binding="shop-name"]').forEach(node => {
      node.textContent = displayValue;
    });
  }

  function updateDocumentTitle(name) {
    const displayValue = name && name.trim() ? name.trim() : defaultSettings.shopName;
    const template = getTranslation(currentLanguage, 'app.title') || 'Admin Panel - {name}';
    document.title = template.replace('{name}', displayValue);
  }

  function applySettingsToUI(settings) {
    updateShopNameDisplays(settings.shopName);
    syncColorTheme(settings.colorTheme);
    syncLanguage(settings.language);
    updateDocumentTitle(settings.shopName);
  }

  function handleSave(event) {
    if (event) {
      event.preventDefault();
    }

    const settings = collectSettingsFromForm();
    const validationMessage = validateSettings(settings);
    if (validationMessage) {
      showFeedback(validationMessage, 'error');
      return;
    }

    try {
      persistSettings(settings);
      currentSettings = { ...settings };
      applySettingsToUI(currentSettings);
      setDirtyState(false);
      showFeedback(getTranslation(currentLanguage, 'feedback.saveSuccess'), 'success');
    } catch (error) {
      const fallback = getTranslation(currentLanguage, 'feedback.saveError');
      showFeedback(error.message || fallback, 'error');
    }
  }

  function handleReset() {
    const message = getTranslation(currentLanguage, 'feedback.resetConfirm');
    if (!confirm(message)) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    applySettingsToForm({ ...defaultSettings });
    showFeedback(getTranslation(currentLanguage, 'feedback.resetSuccess'), 'success');
  }

  function registerEvents() {
    const refs = queryControls();
    if (!refs) {
      return;
    }

    const textInputs = [
      refs.shopNameInput,
      refs.adminEmailInput,
      refs.adminPhoneInput
    ];

    // فقط وضعیت "تغییر کرده" را علامت می‌زنیم؛ اعمال واقعی بعد از ذخیره
    textInputs.forEach(input => {
      if (!input) return;
      input.addEventListener('input', markDirty);
    });

    [
      refs.notifyOrdersCheckbox,
      refs.notifyCommentsCheckbox,
      refs.notifyUsersCheckbox,
      refs.themeSelect,
      refs.languageSelect
    ].forEach(control => {
      if (!control) return;
      control.addEventListener('change', () => {
        // تم یا زبان در همین لحظه روی UI اعمال نمی‌شوند؛
        // فقط بعد از ذخیره در handleSave → applySettingsToUI اعمال می‌گردند
        markDirty();
      });
    });

    if (refs.saveButton) {
      refs.saveButton.addEventListener('click', handleSave);
    }
    if (refs.resetButton) {
      refs.resetButton.addEventListener('click', handleReset);
    }
  }

  function initializeSettingsSection(options = {}) {
    const refs = queryControls();
    if (!refs) {
      return;
    }

    if (!isInitialized) {
      registerEvents();
      isInitialized = true;
    }

    if (!currentSettings || options.force) {
      const stored = getStoredSettings();
      applySettingsToForm(stored);
    }
  }

  function handleStorageSync(event) {
    if (event.key === STORAGE_KEY && !isDirty) {
      const freshSettings = getStoredSettings();
      applySettingsToForm(freshSettings);
    }
  }

  window.initializeSettingsSection = initializeSettingsSection;
  window.getTranslation = getTranslation;
  window.applyTranslations = applyTranslations;
  window.getCurrentLanguage = function() { return currentLanguage; };

  document.addEventListener('DOMContentLoaded', () => {
    initializeSettingsSection();
    window.addEventListener('storage', handleStorageSync);
    // اعمال زبان فعلی در بارگذاری صفحه
    const stored = getStoredSettings();
    if (stored.language) {
      syncLanguage(stored.language);
    }
  });
})();


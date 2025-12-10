// --- ذخیره‌سازی ساده در localStorage ---
function getStorage(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- المان‌ها ---
const userForm = document.getElementById("userForm");
const userNameInput = document.getElementById("uname");
const userRoleInput = document.getElementById("urole");

// --- افزودن کاربر ---
userForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = userNameInput.value.trim();
  const role = userRoleInput.value.trim();

  const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
  // اعتبارسنجی فیلدها
  if (!name || !role) {
    const msg = window.getTranslation ? window.getTranslation(lang, 'addUser.fillAll') : "لطفاً همه فیلدها را پر کنید";
    alert(msg);
    return;
  }

  // دریافت لیست کاربران موجود
  const users = getStorage("users");
  
  // بررسی اینکه آیا کاربر با همین نام وجود دارد
  const existingUser = users.find(user => user.name === name);
  if (existingUser) {
    const msg = window.getTranslation ? window.getTranslation(lang, 'addUser.exists') : "⚠️ کاربری با این نام قبلاً ثبت شده است";
    alert(msg);
    return;
  }

  // ایجاد شناسه یکتا برای کاربر
  const id = Date.now();

  // ایجاد شیء کاربر جدید
  const newUser = {
    id: id,
    name: name,
    role: role
  };

  // افزودن کاربر به لیست
  users.push(newUser);
  
  // ذخیره در localStorage
  setStorage("users", users);
  
  const successMsg = window.getTranslation ? window.getTranslation(lang, 'addUser.success') : "✅ کاربر با موفقیت اضافه شد";
  alert(successMsg);
  
  // هدایت به صفحه پنل - بخش کاربران
  window.location.href = "index.html#users";
});


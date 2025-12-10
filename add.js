// --- ذخیره‌سازی ساده در localStorage ---
function getStorage(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- منتظر لود شدن DOM ---
document.addEventListener("DOMContentLoaded", function() {
  // --- المان‌ها ---
  const imageInput = document.getElementById("pimage");
  const preview = document.getElementById("preview");
  const productForm = document.getElementById("productForm");

  // بررسی وجود المان‌ها
  if (!imageInput || !preview || !productForm) {
    console.error("عناصر فرم پیدا نشدند!");
    return;
  }

  // --- پیش‌نمایش تصویر ---
  imageInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // --- افزودن محصول ---
  productForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("pname").value.trim();
    const price = parseInt(document.getElementById("pprice").value.trim());
    const cat = document.getElementById("pcat").value.trim();
    const desc = document.getElementById("pdesc") ? document.getElementById("pdesc").value.trim() : "";

    const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'fa';
    if (!name || !price || !cat) {
      const msg = window.getTranslation ? window.getTranslation(lang, 'addProduct.fillAll') : "لطفاً همه فیلدها را پر کنید";
      alert(msg);
      return;
    }

    const products = getStorage("products");
    const id = Date.now();

    if (imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = e.target.result;
        products.push({ id, name, price, cat, desc, img });
        setStorage("products", products);
        const successMsg = window.getTranslation ? window.getTranslation(lang, 'addProduct.success') : "✅ محصول با موفقیت اضافه شد";
        alert(successMsg);
        window.location.href = "index.html#products";
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      products.push({ id, name, price, cat, desc, img: "" });
      setStorage("products", products);
      const successMsg = window.getTranslation ? window.getTranslation(lang, 'addProduct.success') : "✅ محصول با موفقیت اضافه شد";
      alert(successMsg);
      window.location.href = "index.html#products";
    }
  });
});

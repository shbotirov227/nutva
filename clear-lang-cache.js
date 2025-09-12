// Browser konsolida ishlatish uchun script
// Agar website default tilini rus tilidan o'zbek tiliga o'zgartirish kerak bo'lsa

// 1. LocalStorage ni tozalash
localStorage.removeItem('lang');
localStorage.setItem('lang', 'uz');

// 2. Cookie ni tozalash 
document.cookie = "lang=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
document.cookie = "lang=uz; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";

// 3. Page reload
window.location.reload();

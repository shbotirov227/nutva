# Website Default Language Fix

## Problem

Website default til `/ru` bo'lib qolgan edi va uni `/uz` qilish kerak edi.

## Solution Applied

### 1. Middleware.ts

- Fallback language to "uz" forced
- Cookie respect qilish lekin default "uz"

### 2. Next.config.ts

- Browser language detection olib tashlandi
- Root URL middleware da handle qilinadi

### 3. LangContext.tsx

- Default til "uz" ga majburlandi
- LocalStorage va Cookie sync qilish

### 4. I18n configuration

- Fallback "uz" ga o'rnatildi

## Manual Fix (Agar hali ham rus tili default bo'lsa)

Browser konsolida quyidagi kodni ishlatish:

```javascript
// LocalStorage ni tozalash
localStorage.removeItem("lang");
localStorage.setItem("lang", "uz");

// Cookie ni tozalash
document.cookie = "lang=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
document.cookie = "lang=uz; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";

// Page reload
window.location.reload();
```

Yoki brauzer DevTools > Application > Storage da `lang` key'ni o'chirib, qayta sahifani yuklash.

## Test Results

- Root URL (`/`) -> `/uz` ga redirect
- Cookie'da boshqa til bo'lsa ham respect qiladi
- Default fallback har doim uzbek tili

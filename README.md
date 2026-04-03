# 🎰 PuzzleChain - Mystery Box Backend

منصة صناديق الألغاز مع نظام نقاط متكامل.

## 🚀 الميزات

- **نظام الصناديق** - فتح صناديق للحصول على جوائز
- **نقاط الشراء** - شراء منتجات واكسب نقاط (5% من السعر)
- **نقاط الصندوق** - استخدام النقاط لفتح الصناديق مجاناً
- **نظام الهدايا** - إرسال نقاط كهدية للآخرين
- **الخدمات** - مجموعات وقنوات وبوتات مدفوعة بالنقاط
- **API Keys** - مفاتيح API للمطورين
- **Provably Fair RNG** - نظام عشوائي عادل

## 📁 الهيكل

```
backend/
├── models/           # نماذج البيانات
│   ├── user.model.js
│   ├── Box.model.js
│   ├── Prize.model.js
│   ├── BoxOpening.model.js
│   ├── Product.model.js
│   ├── Order.model.js
│   ├── Service.model.js
│   ├── GiftTransaction.model.js
│   ├── ApiKey.model.js
│   ├── Coupon.model.js
│   └── pointsTransaction.model.js
│
├── services/         # الخدمات
│   ├── rewards.service.js
│   └── gift.service.js
│
├── routes/           # مسارات API
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── box.routes.js
│   ├── prize.routes.js
│   ├── product.routes.js
│   ├── order.routes.js
│   ├── points.routes.js
│   ├── gift.routes.js
│   ├── service.routes.js
│   └── apiKey.routes.js
│
├── middleware/       # البرمجيات الوسيطة
│   ├── auth.middleware.js
│   ├── rateLimiter.middleware.js
│   └── apiKey.middleware.js
│
├── server.js         # نقطة الدخول
└── .env.example     # متغيرات البيئة
```

## 🛠️ التثبيت والتشغيل

```bash
# استنساخ المشروع
git clone https://github.com/mrabt3475-cpu/mystery-box-backend.git
cd mystery-box-backend

# تثبيت المتطلبات
npm install

# إنشاء ملف البيئة
cp backend/.env.example backend/.env

# تشغيل السيرفر
npm run dev
```

## 🔐 مسارات API

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/api/auth/register` | تسجيل مستخدم جديد |
| POST | `/api/auth/login` | تسجيل الدخول |
| GET | `/api/boxes` | جلب جميع الصناديق |
| POST | `/api/boxes/:id/open` | فتح صندوق |
| GET | `/api/products` | جلب المنتجات |
| POST | `/api/products/order` | طلب منتج |
| GET | `/api/points` | جلب الرصيد |
| POST | `/api/gifts/send` | إرسال هدية |
| GET | `/api/services` | جلب الخدمات |
| POST | `/api/services/:id/join` | الانضمام لخدمة |

## 🔒 الأمان

- JWT Authentication
- Rate Limiting
- Helmet Security
- Input Sanitization
- Password Hashing (bcryptjs)

## 📝 الترخيص

MIT License

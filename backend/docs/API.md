# PuzzleChain Developer API

## نظرة عامة

واجهة برمجة التطبيقات (API) للمطورين позволя لك بناء تطبيقات خارجية تتفاعل مع نظام PuzzleChain.

## المصادقة

### الحصول على مفتاح API

1. أنشئ حساب مطور من لوحة التحكم
2. أنشئ مفتاح API جديد
3. استخدم المفتاح في كل طلب

### استخدام المفتاح

أضف المفتاح إلى ترويسة الطلب:
```
X-API-Key: key_xxxxx:sk_xxxxx
```

## الصلاحيات المتاحة

| الصلاحية | الوصف |
|----------|-------|
| `read:products` | قراءة المنتجات |
| `read:boxes` | قراءة الصناديق |
| `read:orders` | قراءة الطلبات |
| `read:user` | قراءة بيانات المستخدم |
| `read:stats` | قراءة الإحصائيات |
| `write:open-box` | فتح صندوق (يتطلب نقاط) |
| `write:create-order` | إنشاء طلب |
| `write:claim-reward` | استلام مكافأة |
| `admin:full` | إدارة كاملة |

## نقاط النهاية

### المنتجات
```bash
GET /api/v1/products
GET /api/v1/products/:id
```

### الصناديق
```bash
GET /api/v1/boxes
GET /api/v1/boxes/:id
POST /api/v1/boxes/:id/open
```

### المستخدمين
```bash
GET /api/v1/user/:id
GET /api/v1/user/:id/stats
```

### الطلبات
```bash
GET /api/v1/orders?userId=xxx
POST /api/v1/orders
```

## حدود الطلبات

| الخطة | الحد |
|-------|------|
| Free | 100 طلب/ساعة |
| Basic | 1,000 طلب/ساعة |
| Pro | 10,000 طلب/ساعة |
| Enterprise | 100,000 طلب/ساعة |

## Webhooks

### الأحداث المتاحة

- `box.opened` - عند فتح صندوق
- `box.won` - عند الفوز
- `order.created` - عند إنشاء طلب
- `order.shipped` - عند الشحن
- `reward.claimed` - عند استلام مكافأة

### توقيع Webhook

تحقق من التوقيع:
```javascript
const crypto = require('crypto');

function verifySignature(secret, payload, signature) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === expected;
}
```

## أكواد الحالة

| الكود | المعنى |
|-------|--------|
| 200 | نجاح |
| 400 | خطأ في الطلب |
| 401 | غير مصادق |
| 403 | غير مصرح |
| 429 | تجاوز الحد |
| 500 | خطأ في الخادم |

## مثال - JavaScript

```javascript
const apiKey = 'key_xxxxx:sk_xxxxx';

// قراءة المنتجات
const response = await fetch('/api/v1/products', {
  headers: {
    'X-API-Key': apiKey
  }
});

const products = await response.json();
```

## مثال - Python

```python
import requests

api_key = "key_xxxxx:sk_xxxxx"

response = requests.get(
    "https://api.puzzlechain.com/v1/products",
    headers={"X-API-Key": api_key}
)

products = response.json()
```

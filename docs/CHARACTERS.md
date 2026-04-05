# 🎭 نظام الشخصيات - Character System

## نظرة عامة

نظام الشخصيات يتيح للمستخدمين اختيار شخصية تمثلهم في المنصة مع تحريكات متعددة.

---

## 📋 الشخصيات المتاحة

| الشخصية | الوصف | المهارة | اللون |
|---------|-------|---------|-------|
| 🗡️ **المحارب** | محارب شجاع يقود المعارك | قوة عالية | `#ef4444` (أحمر) |
| 🔮 **الساحر** | ساحر قوي يتحكم بالعناصر | سحر قوي | `#8b5cf6` (بنفسجي) |
| 🏹 **الرامي** | ماهر في الرمي من بعيد | دقة عالية | `#22c55e` (أخضر) |
| 🥷 **النينجا** | محترف في الاخفاء والقتال | سرعة خيالية | `#1e293b` (داكن) |
| 🤖 **الروبوت** | آلة حربية متقدمة | تكنولوجيا | `#64748b` (رمادي) |
| 👽 **الكائن الفضائي** | من كوكب بعيد | قدرات خارقة | `#06b6d4` (سماوي) |
| 🐉 **التنين** | تنين أسطوري | نار قوية | `#f59e0b` (ذهبي) |
| 🦄 **الوحيد قرن** | مخلوق أسطوري نادر | حماية | `#ec4899` (وردي) |
| 👻 **الشبح** | روح تائبة | اخفاء تام | `#a855f7` (بنفسجي فاتح) |
| 🏴‍☠️ **القرصان** | سيد البحار | ثروة | `#f97316` (برتقالي) |
| 🧙‍♂️ **الساحر الكبير** | حكيم قديم | حكمة | `#6366f1` (نيلي) |
| 🐺 **المستذئب** | ذئب بشري | قوة بدنية | `#78350f` (بني) |

---

## 🎬 أنواع التحريك

### 1. **Idle** - السكون
```jsx
<Character character="warrior" animation="idle" />
```
حركة خفيفة متكررة للشخصية في حالة السكون

### 2. **Attack** - الهجوم
```jsx
<Character character="ninja" animation="attack" />
```
حركة هجوم قوية

### 3. **Defend** - الدفاع
```jsx
<Character character="knight" animation="defend" />
```
حركة دفاعية مع درع

### 4. **Victory** - الانتصار
```jsx
<Character character="dragon" animation="victory" />
```
احتفال بالانتصار

### 5. **Defeat** - الهزيمة
```jsx
<Character character="robot" animation="defeat" />
```
حركة الحزن/الإحباط

### 6. **Walk** - المشي
```jsx
<Character character="pirate" animation="walk" />
```
حركة المشي

### 7. **Jump** - القفز
```jsx
<Character character="unicorn" animation="jump" />
```
حركة القفز

---

## 💻 الاستخدام في الكود

### استيراد المكونات
```jsx
import { Character, CharacterSelector, CharacterAvatar } from './components/Characters';
```

### عرض شخصية بسيطة
```jsx
<Character 
  character="warrior" 
  animation="idle" 
  size="large" 
  showName={true}
/>
```

### محدد الشخصيات
```jsx
<CharacterSelector 
  selected="ninja"
  onSelect={(char) => setCharacter(char)}
  showStats={true}
/>
```

### صورة شخصية صغيرة (أفاتار)
```jsx
<CharacterAvatar 
  character="wizard"
  size={48}
  showBorder={true}
  borderColor="gold"
/>
```

---

## 🎨 المميزات

### 1. **تخصيص الحجم**
```jsx
size="small"   // 48px
size="medium"  // 80px  
size="large"   // 120px
size="xlarge"  // 200px
```

### 2. **تخصيص الحدود**
```jsx
showBorder={true}
borderColor="gold"    // ذهبي
borderColor="silver"  // فضي
borderColor="bronze"  // برونزي
borderColor="mythic"  // ميثي
```

### 3. **تأثيرات بصرية**
```jsx
showGlow={true}        // توهج
showParticles={true}   // جزيئات
showShadow={true}      // ظل
```

### 4. **مستوى الندرة**
```jsx
rarity="common"      // عادي
rarity="uncommon"    // غير عادي
rarity="rare"        // نادر
rarity="epic"        // أسطوري
rarity="legendary"   // خرافي
rarity="mythic"      // ميثي
```

---

## 🎮 أمثلة عملية

### بطاقة الشخصية
```jsx
const CharacterCard = ({ character, onSelect }) => (
  <div className="character-card">
    <CharacterAvatar 
      character={character.id} 
      size={80}
      showBorder={true}
      borderColor={character.rarityColor}
    />
    <h3>{character.name}</h3>
    <p>{character.description}</p>
    <div className="character-stats">
      <span>⚔️ {character.power}</span>
      <span>🛡️ {character.defense}</span>
      <span>⚡ {character.speed}</span>
    </div>
    <button onClick={() => onSelect(character.id)}>
      اختيار
    </button>
  </div>
);
```

### عرض الشخصية في الصفحة الرئيسية
```jsx
const Dashboard = () => {
  const [selectedCharacter, setSelectedCharacter] = useState('warrior');
  
  return (
    <div className="dashboard">
      <Character 
        character={selectedCharacter}
        animation="idle"
        size="xlarge"
        showGlow={true}
        showParticles={true}
      />
      <CharacterSelector 
        selected={selectedCharacter}
        onSelect={setSelectedCharacter}
      />
    </div>
  );
};
```

---

## 🎯 الحالات (States)

```jsx
// حالة التحميل
<Character character="robot" isLoading={true} />

// حالة الخطأ
<Character character="alien" hasError={true} />

// حالة التفاعل
<Character character="ninja" isInteractive={true} onClick={() => {}} />

// حالة التحديد
<Character character="wizard" isSelected={true} />

// حالة القفل
<Character character="dragon" isLocked={true} />
```

---

## 🎨 CSS Variables

```css
:root {
  --character-size-small: 48px;
  --character-size-medium: 80px;
  --character-size-large: 120px;
  --character-size-xlarge: 200px;
  
  --character-glow-warrior: 0 0 20px rgba(239, 68, 68, 0.5);
  --character-glow-wizard: 0 0 20px rgba(139, 92, 246, 0.5);
  --character-glow-dragon: 0 0 20px rgba(245, 158, 11, 0.5);
  
  --character-border-gold: 3px solid #fbbf24;
  --character-border-silver: 3px solid #94a3b8;
  --character-border-mythic: 3px linear-gradient(45deg, #f59e0b, #ec4899, #8b5cf6);
}
```

---

## 🔄 التحديثات المستقبلية

- [ ] إضافة المزيد من الشخصيات
- [ ] نظام تخصيص الألوان
- [ ] مؤثرات صوتية لكل شخصية
- [ ] قصص تفاعلية للشخصيات
- [ ] نظام المستويات للشخصيات
- [ ] بطاقات جمع الشخصيات (Trading Cards)

---

## ⚠️ ملاحظات

1. **الأداء**: الشخصيات تستخدم SVG محسّن لضمان أداء سريع
2. **التجاوب**: تعمل على جميع أحجام الشاشات
3. **إمكانية الوصول**: تدعم لوحة المفاتيح وقارئات الشاشة
4. **التخزين**: يتم حفظ الشخصية المختارة في localStorage

---

## 📞 الدعم

للأسئلة أو المشاكل، راجع:
- ملف `Character.jsx` للمكونات
- ملف `Character.css` للأنماط
- قسم التحريكات للمؤثرات

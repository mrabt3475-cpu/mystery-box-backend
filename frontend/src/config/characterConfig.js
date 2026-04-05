/**
 * 🎭 Character Configuration
 * 
 * إعدادات الشخصيات - تخصيص واستيراد
 */

// ========================
// 📋 Character Data
// ========================

export const CHARACTERS = {
  // عادي (Common) - 40%
  archer: {
    id: 'archer',
    name: 'الرامي',
    nameEn: 'Archer',
    description: 'ماهر في الرمي من بعيد بدقة عالية',
    descriptionEn: 'Skilled in long-range shooting with high accuracy',
    icon: '🏹',
    rarity: 'common',
    color: '#22c55e',
    stats: { power: 65, defense: 45, speed: 80 },
    skills: ['رمي سريع', 'دقة عالية'],
    unlockLevel: 1,
    price: 0,
    available: true
  },
  
  pirate: {
    id: 'pirate',
    name: 'القرصان',
    nameEn: 'Pirate',
    description: 'سيد البحار يبحث عن الكنوز',
    descriptionEn: 'Sea captain searching for treasures',
    icon: '🏴‍☠️',
    rarity: 'common',
    color: '#f97316',
    stats: { power: 70, defense: 50, speed: 65 },
    skills: ['إبحار', 'قتال'],
    unlockLevel: 1,
    price: 0,
    available: true
  },

  // غير عادي (Uncommon) - 30%
  robot: {
    id: 'robot',
    name: 'الروبوت',
    nameEn: 'Robot',
    description: 'آلة حربية متقدمة تقنياً',
    descriptionEn: 'Technologically advanced war machine',
    icon: '🤖',
    rarity: 'uncommon',
    color: '#64748b',
    stats: { power: 80, defense: 75, speed: 50 },
    skills: ['تكنولوجيا', 'دقة'],
    unlockLevel: 3,
    price: 500,
    available: true
  },
  
  ghost: {
    id: 'ghost',
    name: 'الشبح',
    nameEn: 'Ghost',
    description: 'روح تائبة لها قدرات خارقة',
    descriptionEn: 'Wandering spirit with supernatural powers',
    icon: '👻',
    rarity: 'uncommon',
    color: '#a855f7',
    stats: { power: 60, defense: 40, speed: 90 },
    skills: ['اخفاء', 'خوارق'],
    unlockLevel: 5,
    price: 750,
    available: true
  },

  // نادر (Rare) - 15%
  warrior: {
    id: 'warrior',
    name: 'المحارب',
    nameEn: 'Warrior',
    description: 'محارب شجاع يقود المعارك',
    descriptionEn: 'Brave warrior leading the battles',
    icon: '🗡️',
    rarity: 'rare',
    color: '#ef4444',
    stats: { power: 85, defense: 70, speed: 60 },
    skills: ['قوة', 'قيادة'],
    unlockLevel: 7,
    price: 1500,
    available: true
  },
  
  wizard: {
    id: 'wizard',
    name: 'الساحر',
    nameEn: 'Wizard',
    description: 'ساحر يتحكم بالعناصر الأربعة',
    descriptionEn: 'Wizard controlling the four elements',
    icon: '🔮',
    rarity: 'rare',
    color: '#8b5cf6',
    stats: { power: 90, defense: 55, speed: 70 },
    skills: ['سحر', 'عناصر'],
    unlockLevel: 10,
    price: 2000,
    available: true
  },
  
  werewolf: {
    id: 'werewolf',
    name: 'المستذئب',
    nameEn: 'Werewolf',
    description: 'ذئب بشري بقوة خارقة',
    descriptionEn: 'Human wolf with supernatural strength',
    icon: '🐺',
    rarity: 'rare',
    color: '#78350f',
    stats: { power: 88, defense: 65, speed: 85 },
    skills: ['قوة بدنية', 'سرعة'],
    unlockLevel: 12,
    price: 2500,
    available: true
  },

  // أسطوري (Epic) - 10%
  ninja: {
    id: 'ninja',
    name: 'النينجا',
    nameEn: 'Ninja',
    description: 'محترف في الاخفاء والقتال الخفي',
    descriptionEn: 'Master of stealth and covert combat',
    icon: '🥷',
    rarity: 'epic',
    color: '#1e293b',
    stats: { power: 75, defense: 60, speed: 100 },
    skills: ['اخفاء تام', 'قتال سريع'],
    unlockLevel: 15,
    price: 5000,
    available: true
  },
  
  unicorn: {
    id: 'unicorn',
    name: 'الوحيد قرن',
    nameEn: 'Unicorn',
    description: 'مخلوق أسطوري نادر بجميع الألوان',
    descriptionEn: 'Rare mythical creature in all colors',
    icon: '🦄',
    rarity: 'epic',
    color: '#ec4899',
    stats: { power: 70, defense: 90, speed: 75 },
    skills: ['حماية', 'سحر'],
    unlockLevel: 18,
    price: 6000,
    available: true
  },

  // خرافي (Legendary) - 4%
  dragon: {
    id: 'dragon',
    name: 'التنين',
    nameEn: 'Dragon',
    description: 'تنين أسطوري يتحكم بالنار',
    descriptionEn: 'Legendary dragon controlling fire',
    icon: '🐉',
    rarity: 'legendary',
    color: '#f59e0b',
    stats: { power: 100, defense: 85, speed: 70 },
    skills: ['نار', 'طيران'],
    unlockLevel: 25,
    price: 15000,
    available: true
  },
  
  grandWizard: {
    id: 'grandWizard',
    name: 'الساحر الكبير',
    nameEn: 'Grand Wizard',
    description: 'حكيم قديم يحفظ أسرار الكون',
    descriptionEn: 'Ancient sage keeping cosmic secrets',
    icon: '🧙‍♂️',
    rarity: 'legendary',
    color: '#6366f1',
    stats: { power: 95, defense: 70, speed: 65 },
    skills: ['حكمة', 'سحر قديم'],
    unlockLevel: 30,
    price: 20000,
    available: true
  },

  // ميثي (Mythic) - 1%
  alien: {
    id: 'alien',
    name: 'الكائن الفضائي',
    nameEn: 'Alien',
    description: 'كائن من كوكب آخر بقدرات خارقة',
    descriptionEn: 'Being from another planet with supernatural abilities',
    icon: '👽',
    rarity: 'mythic',
    color: '#06b6d4',
    stats: { power: 98, defense: 80, speed: 95 },
    skills: ['تخاطر', 'تحكم'],
    unlockLevel: 50,
    price: 50000,
    available: true
  }
};

// ========================
// 🎯 Rarity Configuration
// ========================

export const RARITY_CONFIG = {
  common: {
    name: 'عادي',
    nameEn: 'Common',
    color: '#9ca3af',
    bgColor: '#f3f4f6',
    probability: 40,
    minLevel: 1,
    glowColor: 'rgba(156, 163, 175, 0.5)'
  },
  uncommon: {
    name: 'غير عادي',
    nameEn: 'Uncommon',
    color: '#22c55e',
    bgColor: '#dcfce7',
    probability: 30,
    minLevel: 3,
    glowColor: 'rgba(34, 197, 94, 0.5)'
  },
  rare: {
    name: 'نادر',
    nameEn: 'Rare',
    color: '#3b82f6',
    bgColor: '#dbeafe',
    probability: 15,
    minLevel: 7,
    glowColor: 'rgba(59, 130, 246, 0.5)'
  },
  epic: {
    name: 'أسطوري',
    nameEn: 'Epic',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    probability: 10,
    minLevel: 15,
    glowColor: 'rgba(139, 92, 246, 0.5)'
  },
  legendary: {
    name: 'خرافي',
    nameEn: 'Legendary',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    probability: 4,
    minLevel: 25,
    glowColor: 'rgba(245, 158, 11, 0.5)'
  },
  mythic: {
    name: 'ميثي',
    nameEn: 'Mythic',
    color: '#ec4899',
    bgColor: '#fce7f3',
    probability: 1,
    minLevel: 50,
    glowColor: 'rgba(236, 72, 153, 0.5)'
  }
};

// ========================
// ⚙️ Import Settings
// ========================

export const CHARACTER_IMPORT_SETTINGS = {
  // تفعيل/إلغاء تفعيل نظام الشخصيات
  enabled: true,
  
  // الشخصية الافتراضية للمستخدم الجديد
  defaultCharacter: 'archer',
  
  // تفعيل نظام الندرة
  enableRarity: true,
  
  // تفعيل الشراء
  enablePurchase: true,
  
  // تفعيل المستويات
  enableLevelUnlock: true,
  
  // تفعيل الإحصائيات
  enableStats: true,
  
  // تفعيل المؤثرات
  enableEffects: true,
  
  // تفعيل الأفاتار
  enableAvatar: true,
  
  // الحد الأقصى للشخصيات
  maxCharacters: 12,
  
  // تفعيل الشخصية المخفية
  enableHiddenCharacters: false,
  
  // مدة التحريك الافتراضية (ms)
  defaultAnimationDuration: 2000,
  
  // تفعيل التخزين المحلي
  localStorageKey: 'user_character',
  
  // تفعيل المزامنة مع الخادم
  syncWithServer: true
};

// ========================
// 🎬 Animation Settings
// ========================

export const CHARACTER_ANIMATION_SETTINGS = {
  idle: {
    duration: 2000,
    repeat: Infinity,
    easing: 'ease-in-out'
  },
  attack: {
    duration: 500,
    repeat: 1,
    easing: 'ease-out'
  },
  defend: {
    duration: 800,
    repeat: 1,
    easing: 'ease-in-out'
  },
  victory: {
    duration: 1500,
    repeat: 1,
    easing: 'ease-out'
  },
  defeat: {
    duration: 1000,
    repeat: 1,
    easing: 'ease-in'
  },
  walk: {
    duration: 1000,
    repeat: Infinity,
    easing: 'linear'
  },
  jump: {
    duration: 600,
    repeat: 1,
    easing: 'ease-out'
  }
};

// ========================
// 🛠️ Helper Functions
// ========================

export const getCharacter = (id) => CHARACTERS[id];

export const getCharacterByRarity = (rarity) => 
  Object.values(CHARACTERS).filter(c => c.rarity === rarity);

export const getUnlockedCharacters = (userLevel) => 
  Object.values(CHARACTERS).filter(c => c.unlockLevel <= userLevel);

export const getRarityConfig = (rarity) => RARITY_CONFIG[rarity];

export const calculateCharacterPrice = (characterId, basePrice = null) => {
  const character = CHARACTERS[characterId];
  if (!character) return 0;
  
  const price = basePrice || character.price;
  const rarityMultiplier = {
    common: 1,
    uncommon: 1.5,
    rare: 2,
    epic: 3,
    legendary: 5,
    mythic: 10
  };
  
  return Math.floor(price * (rarityMultiplier[character.rarity] || 1));
};

export const isCharacterAvailable = (characterId, userLevel, ownedCharacters = []) => {
  const character = CHARACTERS[characterId];
  if (!character) return false;
  
  // إذا كان المستخدم يملكها
  if (ownedCharacters.includes(characterId)) return true;
  
  // التحقق من المستوى
  if (userLevel < character.unlockLevel) return false;
  
  return character.available;
};

export const getRandomCharacter = (userLevel, ownedCharacters = []) => {
  const available = getUnlockedCharacters(userLevel).filter(
    c => !ownedCharacters.includes(c.id) && c.available
  );
  
  if (available.length === 0) return null;
  
  // اختيار عشوائي حسب الاحتمالات
  const totalWeight = available.reduce((sum, c) => 
    sum + RARITY_CONFIG[c.rarity].probability, 0
  );
  
  let random = Math.random() * totalWeight;
  
  for (const character of available) {
    const weight = RARITY_CONFIG[character.rarity].probability;
    random -= weight;
    if (random <= 0) return character;
  }
  
  return available[available.length - 1];
};

export default {
  CHARACTERS,
  RARITY_CONFIG,
  CHARACTER_IMPORT_SETTINGS,
  CHARACTER_ANIMATION_SETTINGS,
  getCharacter,
  getCharacterByRarity,
  getUnlockedCharacters,
  getRarityConfig,
  calculateCharacterPrice,
  isCharacterAvailable,
  getRandomCharacter
};
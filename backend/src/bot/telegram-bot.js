import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Telegram Bot
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });


// MongoDB Models
const UserSchema = new mongoose.Schema({
  telegramId: String,
  username: String,
  name: String,
  wallet: { balance: Number, points: Number },
  role: { type: String, default: 'user' },
  referralCode: String,
  referredBy: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// ====================
// Bot Commands
// ====================

// /start command
bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  const params = match[1];
  
  // Check if it's auth request
  if (params === 'AUTH') {
    await handleAuthRequest(chatId, user);
    return;
  }
  
  // Check if it's referral
  if (params && params.startsWith('REF')) {
    await handleReferral(chatId, user, params);
    return;
  }
  
  // Regular start
  await showMainMenu(chatId, user);
});

// /help
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  
  await bot.sendMessage(chatId, `
📖 *مساعدة PuzzleChain Bot*

*الأوامر:*
/start - بدء البوت
/help - المساعدة
/boxes - عرض الصناديق
/wallet - محفظتي
/profile - ملفي
/balance - الرصيد

*الأزرار:*
استخدم الأزرار أدناه للتنقل
  `, { parse_mode: 'Markdown', reply_markup: getMainKeyboard() });
});

// /boxes
bot.onText(/\/boxes/, async (msg) => {
  const chatId = msg.chat.id;
  await showBoxes(chatId);
});

// /wallet
bot.onText(/\/wallet/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  await showWallet(chatId, userId);
});

// /profile
bot.onText(/\/profile/, async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  await showProfile(chatId, user);
});

// /balance
bot.onText(/\/balance/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  await showBalance(chatId, userId);
});

// ====================
// Callback Queries
// ====================


bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const user = query.from;
  
  await bot.answerCallbackQuery(query.id);
  
  switch(data) {
    case 'boxes':
      await showBoxes(chatId);
      break;
    case 'wallet':
      await showWallet(chatId, user.id);
      break;
    case 'profile':
      await showProfile(chatId, user);
      break;
    case 'auth':
      await handleAuthRequest(chatId, user);
      break;
    case 'unlink':
      await unlinkAccount(chatId, user.id);
      break;
    default:
      if (data.startsWith('open_')) {
        await openBox(chatId, user, data.replace('open_', ''));
      }
  }
});

// ====================
// Handler Functions
// ====================


async function handleAuthRequest(chatId, user) {
  // Generate auth token
  const authToken = Buffer.from(JSON.stringify({
    telegramId: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    authDate: Date.now()
  })).toString('base64');
  
  // Store in localStorage for frontend to pick up
  // Note: This won't work directly in bot, need webhook
  
  await bot.sendMessage(chatId, `
🔐 *تحقق من الهوية*

تم التحقق من حسابك!

الرجاء العودة للموقع لتسجيل الدخول
  `, { parse_mode: 'Markdown' });
  
  // Send auth data to backend
  try {
    await fetch(`${process.env.API_URL}/api/v1/telegram/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        initData: `auth_date=${Date.now()}&user=${encodeURIComponent(JSON.stringify({
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name
        }))}&hash=dummy`
      })
    });
  } catch (e) {
    console.error('Auth error:', e);
  }
}

async function handleReferral(chatId, user, refCode) {
  await bot.sendMessage(chatId, `
🎁 *صديقك دعاك!*

عند تسجيلك ستحصل على نقاط إضافية!

[سجل الآن](${process.env.CLIENT_URL}/register?ref=${refCode})
  `, { parse_mode: 'Markdown' });
}

async function showMainMenu(chatId, user) {
  const welcome = `
🎁 *مرحباً ${user.first_name}!*

أهلاً بك في PuzzleChain!

اختر مما يلي:
  `;
  
  await bot.sendMessage(chatId, welcome, {
    parse_mode: 'Markdown',
    reply_markup: getMainKeyboard()
  });
}

async function showBoxes(chatId) {
  const boxes = [
    { name: '⭐ Starter Box', price: 9.99, prize: '🎯' },
    { name: '🎁 Mystery Box', price: 19.99, prize: '🎁' },
    { name: '💎 Premium Box', price: 29.99, prize: '💎' },
    { name: '👑 VIP Box', price: 49.99, prize: '👑' }
  ];
  
  let message = '🎁 *الصناديق المتاحة:*\n\n';
  
  boxes.forEach((box, i) => {
    message += `${i + 1}. *${box.name}* - $${box.price}\n`;
  });
  
  const keyboard = {
    inline_keyboard: boxes.map((box, i) => 
      [{ text: `فتح ${box.name} - $${box.price}`, callback_data: `open_${i}` }]
    )
  };
  
  await bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
}

async function showWallet(chatId, userId) {
  // Get user from DB
  const user = await User.findOne({ telegramId: String(userId) });
  
  const balance = user?.wallet?.balance || 0;
  const points = user?.wallet?.points || 0;
  
  await bot.sendMessage(chatId, `
💰 *محفظتك*

الرصيد: $${balance.toFixed(2)}
النقاط: ${points}

[إضافة رصيد](${process.env.CLIENT_URL}/wallet)
  `, { 
    parse_mode: 'Markdown',
    reply_markup: getMainKeyboard()
  });
}

async function showProfile(chatId, user) {
  const dbUser = await User.findOne({ telegramId: String(user.id) });
  
  await bot.sendMessage(chatId, `
👤 *ملفك الشخصي*

الاسم: ${user.first_name} ${user.last_name || ''}
المعرف: @${user.username || 'غير محدد'}

*الإحصائيات:*
- الرصيد: $${(dbUser?.wallet?.balance || 0).toFixed(2)}
- النقاط: ${dbUser?.wallet?.points || 0}
- التسجيل: ${dbUser?.createdAt?.toLocaleDateString() || 'اليوم'}
  `, { 
    parse_mode: 'Markdown',
    reply_markup: getMainKeyboard()
  });
}

async function showBalance(chatId, userId) {
  const user = await User.findOne({ telegramId: String(userId) });
  
  await bot.sendMessage(chatId, `
💵 *الرصيد:* $${(user?.wallet?.balance || 0).toFixed(2)}
🪙 *النقاط:* ${user?.wallet?.points || 0}
  `, { parse_mode: 'Markdown' });
}

async function openBox(chatId, user, boxIndex) {
  const boxes = [
    { name: 'Starter Box', price: 9.99 },
    { name: 'Mystery Box', price: 19.99 },
    { name: 'Premium Box', price: 29.99 },
    { name: 'VIP Box', price: 49.99 }
  ];
  
  const box = boxes[parseInt(boxIndex)];
  
  await bot.sendMessage(chatId, `
🎁 جاري فتح ${box.name}...
💵 السعر: $${box.price}
  `);
  
  // Simulate opening
  setTimeout(async () => {
    const prizes = ['🎮', '💎', '🎧', '🏆', '💰', '🎫'];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    
    await bot.sendMessage(chatId, `
🎉 *تهانينا!*

فزت بـ: ${prize}

[عرض الصناديق الأخرى](${process.env.CLIENT_URL}/boxes)
    `, { parse_mode: 'Markdown' });
  }, 1500);
}

async function unlinkAccount(chatId, userId) {
  await User.findOneAndUpdate(
    { telegramId: String(userId) },
    { $set: { telegramId: null } }
  );
  
  await bot.sendMessage(chatId, '✅ تم فصل الحساب بنجاح');
}

// ====================
// Keyboard Helpers
// ====================


function getMainKeyboard() {
  return {
    keyboard: [
      ['🎁 الصناديق', '💰 المحفظة'],
      ['👤 ملفي', '🔗 ربط الحساب']
    ],
    resize_keyboard: true
  };
}

// ====================
// Server & Database
// ====================

const app = require('express')();
app.use(require('express').json());


app.get('/', (req, res) => {
  res.send('🤖 PuzzleChain Bot is running!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', bot: 'running' });
});

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`✅ Bot server running on port ${PORT}`);
    });
  })
  .catch(err => console.error(err));

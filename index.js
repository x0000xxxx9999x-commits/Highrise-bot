const { Highrise } = require('highrise.bot');

const bot = new Highrise();

// عند اتصال البوت بنجاح
bot.once('Ready', (metadata) => {
    console.log(`✅ البوت متصل! معرف المستخدم: ${metadata.userId}`);
});

// عند دخول مستخدم جديد إلى الغرفة
bot.on('UserJoined', async (user) => {
    console.log(`👤 ${user.username} دخل الغرفة.`);
    await bot.message.send(`مرحباً بك @${user.username} في غرفة BLACK MARKET! 🕶️`);
});

// عند استقبال رسالة في الدردشة
bot.on('Chat', async (user, message) => {
    if (message === '!ping') {
        await bot.message.send(`Pong! @${user.username}`);
    }
    if (message === '!hello') {
        await bot.message.send(`أهلاً بك @${user.username}!`);
    }
    if (message === '!help') {
        await bot.message.send(`الأوامر المتاحة:\n!ping - للتحقق من الاتصال\n!hello - لتحية البوت\n!help - لعرض هذه القائمة`);
    }
});

// تسجيل الدخول باستخدام التوكن ومعرف الغرفة من متغيرات البيئة
bot.login(process.env.HIGHRISE_TOKEN, process.env.HIGHRISE_ROOM_ID);

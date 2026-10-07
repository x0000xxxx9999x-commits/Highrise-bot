const { Highrise } = require('highrise.bot');
const bot = new Highrise();

// بيانات
const jokes = [
    'واحد دخل المطعم قال للويتر: عندكم دجاج؟ قال: لا. قال: ليش المطعم مفتوح؟ قال: نخبر الناس! 😂',
    'واحد راح للدكتور قال: كل ما أشرب شاي أحس بألم في عيني! قال: شيل الملعقة من الكوب! 😂',
    'سألوا واحد: ليش تمشي ورا البنت؟ قال: من زود الأدب! 😂',
    'واحد قال لصاحبه: أمس حلمت إني شربت بحر! قال: شلون؟ قال: بسرعة! 😂'
];

const riddles = [
    { q: 'شي يمشي وما عنده رجلين؟', a: 'الماء' },
    { q: 'شي كل ما أخذت منه كبر؟', a: 'الحفرة' },
    { q: 'عنده أسنان وما يعض؟', a: 'المشط' },
    { q: 'يدخل الماء ولا يبتل؟', a: 'الضوء' },
    { q: 'كلما زاد نقص؟', a: 'العمر' }
];

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// عند الاتصال
bot.once('Ready', () => {
    console.log('✅ البوت متصل!');
});

// ترحيب (الاسم الصحيح)
bot.on('UserJoined', async (user) => {
    console.log('👤 دخل:', user.username);
    try {
        await bot.message.send(`مرحباً بك @${user.username} في غرفة BLACK MARKET! 🕶️`);
    } catch (e) {
        console.log('خطأ ترحيب:', e.message);
    }
});

// استقبال الرسائل
bot.on('Chat', async (user, message) => {
    try {
        console.log(`📨 رسالة: ${user.username}: ${message}`);

        const username = user.username;
        const text = String(message).trim();
        const args = text.split(' ');
        const cmd = args[0];

        // مساعدة
        if (cmd === '!مساعدة' || cmd === '!help') {
            await bot.message.send(`📜 الأوامر:\n🎲 !نرد\n🪙 !عملة\n✊ !حجر\n🎯 !خمن\n🧩 !لغز\n😂 !نكتة`);
            return;
        }

        // نرد
        if (cmd === '!نرد') {
            const n = Math.floor(Math.random() * 6) + 1;
            await bot.message.send(`🎲 @${username} رمى النرد: ${n}`);
            return;
        }

        // عملة
        if (cmd === '!عملة') {
            const r = Math.random() < 0.5 ? 'صورة 👑' : 'كتابة 📝';
            await bot.message.send(`🪙 @${username}: ${r}`);
            return;
        }

        // لغز
        if (cmd === '!لغز') {
            const r = rand(riddles);
            await bot.message.send(`🧩 @${username} ${r.q}\nالجواب: ${r.a}`);
            return;
        }

        // نكتة
        if (cmd === '!نكتة') {
            await bot.message.send(`😂 @${username} ${rand(jokes)}`);
            return;
        }

        // حجر ورقة مقص
        if (cmd === '!حجر') {
            const botChoice = rand(['حجر', 'ورقة', 'مقص']);
            await bot.message.send(`✊ @${username} اختر: حجر / ورقة / مقص`);
            return;
        }

        // خمن (بسيط)
        if (cmd === '!خمن') {
            const n = Math.floor(Math.random() * 50) + 1;
            await bot.message.send(`🎯 @${username} خمنت رقم بين 1 و 50: **${n}**`);
            return;
        }

        // ردود تلقائية
        const lower = text.toLowerCase();
        if (['هلا', 'مرحبا', 'سلام', 'اهلا', 'أهلا'].includes(lower)) {
            await bot.message.send(`👋 أهلاً @${username}!`);
            return;
        }
        if (lower.includes('شكرا')) {
            await bot.message.send(`🤍 على الرحب @${username}!`);
            return;
        }
        if (lower.includes('شلونك') || lower.includes('كيفك')) {
            await bot.message.send(`😊 بخير دامك موجود @${username}!`);
            return;
        }

    } catch (e) {
        console.log('❌ خطأ:', e.message);
    }
});

bot.login(process.env.HIGHRISE_TOKEN, process.env.HIGHRISE_ROOM_ID);
console.log('🚀 البوت يشتغل...');

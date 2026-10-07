const { Highrise } = require('highrise.bot');

const bot = new Highrise();

// ============ ذاكرة اللعبة (لكل مستخدم) ============
const games = {}; // { username: { type, target, tries } }

// ============ بيانات ============
const jokes = [
    'واحد دخل المطعم قال للويتر: عندكم دجاج؟ قال: لا. قال: ليش المطعم مفتوح؟ قال: نخبر الناس! 😂',
    'واحد راح للدكتور قال: كل ما أشرب شاي أحس بألم في عيني! قال: شيل الملعقة من الكوب! 😂',
    'سألوا واحد: ليش تمشي ورا البنت؟ قال: من زود الأدب! 😂',
    'واحد قال لصاحبه: أمس حلمت إني شربت بحر! قال: شلون؟ قال: بسرعة! 😂',
    'واحد سأل صاحبه: عندك ساعة؟ قال: عندي، بس ما أعرف الوقت! 😂'
];

const riddles = [
    { q: 'شي يمشي وما عنده رجلين؟', a: 'الماء' },
    { q: 'شي كل ما أخذت منه كبر؟', a: 'الحفرة' },
    { q: 'عنده أسنان وما يعض؟', a: 'المشط' },
    { q: 'يدخل الماء ولا يبتل؟', a: 'الضوء' },
    { q: 'كلما زاد نقص؟', a: 'العمر' },
    { q: 'شي يكتب ولا يقرأ؟', a: 'القلم' }
];

const challenges = [
    'اكتب اسمك بالمقلوب! 🔄',
    'قل شي حلو لأول شخص يدخل! 🌹',
    'اكتب "أحبكم كلكم"! ❤️',
    'سوي رقصة! 💃',
    'قلد صوت حيوان! 🐱'
];

// ============ دالة مساعدة ============
function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ============ عند الاتصال ============
bot.once('ready', (session) => {
    console.log('✅ البوت متصل!');
});

// ============ ترحيب ============
bot.on('userJoin', async (user) => {
    console.log('👤 دخل:', user.username);
    try {
        await bot.message.send(`مرحباً بك @${user.username} في غرفة BLACK MARKET! 🕶️`);
    } catch (e) {}
});

// ============ استقبال الرسائل ============
bot.on('Chat', async (user, message) => {
    try {
        if (!user || !message) return;

        const username = user.username || 'User';
        const text = String(message).trim();
        const lower = text.toLowerCase();
        const args = text.split(' ');
        const cmd = args[0].toLowerCase();

        console.log(`💬 ${username}: ${text}`);

        // ============ قائمة الأوامر ============
        if (cmd === '!مساعدة' || cmd === '!help' || cmd === '!اوامر') {
            await bot.message.send(
                `📜 أوامر البوت:\n` +
                `🎲 !نرد - رمي النرد\n` +
                `🪙 !عملة - رمي عملة\n` +
                `✊ !حجر - حجر ورقة مقص\n` +
                `🎯 !خمن - خمن رقم من 1-50\n` +
                `🎰 !روليت - روليت\n` +
                `🧩 !لغز - لغز\n` +
                `😂 !نكتة - نكتة\n` +
                `😈 !تحدي - تحدي عشوائي`
            );
            return;
        }

        // ============ 🎲 نرد ============
        if (cmd === '!نرد') {
            const dice = Math.floor(Math.random() * 6) + 1;
            const faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
            await bot.message.send(`🎲 @${username} رمى النرد: ${faces[dice-1]} **${dice}**`);
            return;
        }

        // ============ 🪙 عملة ============
        if (cmd === '!عملة') {
            const result = Math.random() < 0.5 ? '👑 صورة' : '📝 كتابة';
            await bot.message.send(`🪙 @${username} رما العملة: **${result}**`);
            return;
        }

        // ============ ✊ حجر ورقة مقص ============
        if (cmd === '!حجر') {
            games[username] = { type: 'rps' };
            await bot.message.send(`✊ @${username} اختر: حجر / ورقة / مقص`);
            return;
        }
        if (['حجر','ورقة','مقص'].includes(lower) && games[username]?.type === 'rps') {
            const botChoice = rand(['حجر','ورقة','مقص']);
            const userChoice = lower;
            let result = '';
            if (userChoice === botChoice) result = '🤝 تعادل!';
            else if (
                (userChoice === 'حجر' && botChoice === 'مقص') ||
                (userChoice === 'ورقة' && botChoice === 'حجر') ||
                (userChoice === 'مقص' && botChoice === 'ورقة')
            ) result = '🎉 فزت!';
            else result = '😢 خسرت!';

            await bot.message.send(`✊ أنت: ${userChoice} | 🤖 البوت: ${botChoice}\n${result}`);
            delete games[username];
            return;
        }

        // ============ 🎯 خمن الرقم ============
        if (cmd === '!خمن') {
            const target = Math.floor(Math.random() * 50) + 1;
            games[username] = { type: 'guess', target, tries: 0 };
            await bot.message.send(`🎯 @${username} خمن رقم بين **1 و 50**\nاكتب الرقم مباشرة`);
            return;
        }
        if (games[username]?.type === 'guess' && /^\d+$/.test(text)) {
            const guess = parseInt(text);
            const game = games[username];
            game.tries++;

            if (guess === game.target) {
                await bot.message.send(`🎉 @${username} صح! الرقم ${game.target}\nخمنته في ${game.tries} محاولات!`);
                delete games[username];
            } else if (guess < game.target) {
                await bot.message.send(`⬆️ الرقم أكبر من ${guess}`);
            } else {
                await bot.message.send(`⬇️ الرقم أصغر من ${guess}`);
            }
            return;
        }

        // ============ 🎰 روليت ============
        if (cmd === '!روليت') {
            const options = ['🔴 أحمر', '⚫ أسود', '🟢 أخضر'];
            const result = rand(options);
            await bot.message.send(`🎰 الدوران...\n🎯 النتيجة: **${result}**\n@${username}`);
            return;
        }

        // ============ 🧩 لغز ============
        if (cmd === '!لغز') {
            const r = rand(riddles);
            games[username] = { type: 'riddle', answer: r.a };
            await bot.message.send(`🧩 @${username} ${r.q}\nاكتب الجواب`);
            return;
        }
        if (games[username]?.type === 'riddle') {
            if (lower === games[username].answer.toLowerCase()) {
                await bot.message.send(`🎉 صح! الجواب: **${games[username].answer}**`);
            } else {
                await bot.message.send(`❌ خطأ! الجواب: **${games[username].answer}**`);
            }
            delete games[username];
            return;
        }

        // ============ 😂 نكتة ============
        if (cmd === '!نكتة') {
            await bot.message.send(`😂 @${username} ${rand(jokes)}`);
            return;
        }

        // ============ 😈 تحدي ============
        if (cmd === '!تحدي') {
            await bot.message.send(`😈 @${username} ${rand(challenges)}`);
            return;
        }

        // ============ ردود تلقائية ============
        if (['هلا','مرحبا','سلام','اهلا','أهلا','hi','hello'].includes(lower)) {
            await bot.message.send(`👋 أهلاً بك @${username}!`);
            return;
        }
        if (lower.includes('شكرا') || lower.includes('تسلم')) {
            await bot.message.send(`🤍 على الرحب @${username}!`);
            return;
        }
        if (lower.includes('كيفك') || lower.includes('شلونك')) {
            await bot.message.send(`😊 بخير دامك موجود @${username}!`);
            return;
        }

    } catch (e) {
        console.log('خطأ:', e.message);
    }
});

// ============ تسجيل الدخول ============
bot.login(process.env.HIGHRISE_TOKEN, process.env.HIGHRISE_ROOM_ID);
console.log('🚀 البوت يشتغل...');

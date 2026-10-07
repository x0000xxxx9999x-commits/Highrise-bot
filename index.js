const { Highrise } = require('highrise.bot');
const bot = new Highrise();

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

// ============ ذاكرة الألعاب ============
const rpsGames = {};    // { username: true }
const guessGames = {};  // { username: { target, tries } }
const riddleGames = {}; // { username: { answer } }

// ============ دالة ============
function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ============ عند الاتصال ============
bot.once('Ready', () => {
    console.log('✅ البوت متصل!');
});

// ============ الترحيب ============
bot.on('UserJoined', async (user) => {
    console.log('👤 دخل:', user.username);
    try {
        await bot.message.send(`مرحباً بك @${user.username} في غرفة BLACK MARKET! 🕶️`);
    } catch (e) {
        console.log('خطأ:', e.message);
    }
});

// ============ استقبال الرسائل ============
bot.on('Chat', async (user, message) => {
    try {
        const username = user.username;
        const text = String(message).trim();
        const lower = text.toLowerCase();

        console.log(`📨 ${username}: ${text}`);

        // ═══════════ القائمة ═══════════
        if (lower === '!help' || lower === '!مساعدة' || lower === 'help') {
            await bot.message.send(
                `📜 أوامر البوت:\n` +
                `!1 - 🎲 نرد\n` +
                `!2 - 🪙 عملة\n` +
                `!3 - ✊ حجر ورقة مقص\n` +
                `!4 - 🎯 خمن الرقم\n` +
                `!5 - 🧩 لغز\n` +
                `!6 - 😂 نكتة\n` +
                `!7 - 😈 تحدي`
            );
            return;
        }

        // ═══════════ !1 نرد ═══════════
        if (lower === '!1') {
            const n = Math.floor(Math.random() * 6) + 1;
            const faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
            await bot.message.send(`🎲 @${username} رمى النرد: ${faces[n-1]} **${n}**`);
            return;
        }

        // ═══════════ !2 عملة ═══════════
        if (lower === '!2') {
            const r = Math.random() < 0.5 ? 'صورة 👑' : 'كتابة 📝';
            await bot.message.send(`🪙 @${username} رما العملة: **${r}**`);
            return;
        }

        // ═══════════ !3 حجر ورقة مقص ═══════════
        if (lower === '!3') {
            rpsGames[username] = true;
            await bot.message.send(`✊ @${username} اختر:\n1 = حجر\n2 = ورقة\n3 = مقص`);
            return;
        }
        if (rpsGames[username] && ['1', '2', '3'].includes(lower)) {
            const choices = { '1': 'حجر ✊', '2': 'ورقة 📄', '3': 'مقص ✂️' };
            const userChoice = lower;
            const botChoice = String(Math.floor(Math.random() * 3) + 1);
            let result = '';

            if (userChoice === botChoice) result = '🤝 تعادل!';
            else if (
                (userChoice === '1' && botChoice === '3') ||
                (userChoice === '2' && botChoice === '1') ||
                (userChoice === '3' && botChoice === '2')
            ) result = '🎉 فزت!';
            else result = '😢 خسرت!';

            await bot.message.send(
                `أنت: ${choices[userChoice]}\n` +
                `البوت: ${choices[botChoice]}\n` +
                `${result}`
            );
            delete rpsGames[username];
            return;
        }

        // ═══════════ !4 خمن الرقم ═══════════
        if (lower === '!4') {
            const target = Math.floor(Math.random() * 50) + 1;
            guessGames[username] = { target, tries: 0 };
            await bot.message.send(`🎯 @${username} خمنت رقم بين 1 و 50!\nاكتب الرقم مباشرة`);
            return;
        }
        if (guessGames[username] && /^\d+$/.test(lower)) {
            const guess = parseInt(lower);
            const game = guessGames[username];
            game.tries++;

            if (guess === game.target) {
                await bot.message.send(`🎉 @${username} صح! الرقم **${game.target}**\nخمنته في ${game.tries} محاولات!`);
                delete guessGames[username];
            } else if (guess < game.target) {
                await bot.message.send(`⬆️ الرقم أكبر من ${guess}`);
            } else {
                await bot.message.send(`⬇️ الرقم أصغر من ${guess}`);
            }
            return;
        }

        // ═══════════ !5 لغز ═══════════
        if (lower === '!5') {
            const r = rand(riddles);
            riddleGames[username] = { answer: r.a };
            await bot.message.send(`🧩 @${username} ${r.q}`);
            return;
        }
        // رد على اللغز
        if (riddleGames[username] && !lower.startsWith('!')) {
            if (text === riddleGames[username].answer) {
                await bot.message.send(`🎉 @${username} صح! الجواب **${riddleGames[username].answer}**`);
            } else {
                await bot.message.send(`❌ خطأ @${username}! الجواب: **${riddleGames[username].answer}**`);
            }
            delete riddleGames[username];
            return;
        }

        // ═══════════ !6 نكتة ═══════════
        if (lower === '!6') {
            await bot.message.send(`😂 @${username} ${rand(jokes)}`);
            return;
        }

        // ═══════════ !7 تحدي ═══════════
        if (lower === '!7') {
            await bot.message.send(`😈 @${username} ${rand(challenges)}`);
            return;
        }

        // ═══════════ ردود تلقائية ═══════════
        if (['هلا', 'مرحبا', 'سلام', 'اهلا', 'أهلا', 'hi', 'hello'].includes(lower)) {
            await bot.message.send(`👋 أهلاً @${username}!`);
            return;
        }
        if (lower.includes('شكرا') || lower.includes('تسلم')) {
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

// ============ تسجيل الدخول ============
bot.login(process.env.HIGHRISE_TOKEN, process.env.HIGHRISE_ROOM_ID);
console.log('🚀 البوت يشتغل...');

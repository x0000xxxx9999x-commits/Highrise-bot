const { Highrise } = require('highrise.bot');
const bot = new Highrise();

// ═══════════════════════════════════════
// 🐉 هوية التنين
// ═══════════════════════════════════════
const ROOM_NAME = 'نرد التنين';
const DRAGON = '🐉';
const DRAGON_FIRE = '🔥';
const DRAGON_TREASURE = '💎';
const DRAGON_CROWN = '👑';
const DRAGON_DICE = '🎲';

// ═══════════════════════════════════════
// 🐉 رسائل التنين
// ═══════════════════════════════════════
const WELCOME_MESSAGES = [
    `🐉 استيقظ التنين! مرحباً بك ${'{user}'} في نرد التنين 🎲\n🔥 اقترب من الكنز! 💎`,
    `🐲 زئير التنين يسمع في الغرفة! ${'{user}'} وصل! 👑\n🎲 تفضل بالمقامرة مع التنين`,
    `🔥 من الأنقاض يخرج التنين! ${'{user}'} نورت! 🐉\n💎 الكنوز في انتظارك`,
    `🐉 عين التنين تراقبك ${'{user}'}... 👁️\n🎲 اقترب إن كنت تجرؤ!`,
    `👑 ${'{user}'} دخل مملكة التنين! 🐲\n💎 الكنوز تحت حمايته، والحظ معك اليوم`
];

const GREET_DRAGON = [
    '🐉 زئير! من يجرؤ على التحدي؟',
    '🔥 هلا بالبطل! اقترب',
    '💎 نورت المملكة!',
    '👑 أهلاً بك في عرين التنين',
    '🐲 مرحباً بك، تفضل بجولة في الكنوز'
];

// ═══════════════════════════════════════
// 🎲 بيانات الألعاب (بثيم التنين)
// ═══════════════════════════════════════
const JOKES = [
    'واحد دخل المطعم قال: عندكم دجاج؟ قال: لا. قال: ليش المطعم مفتوح؟ قال: نخبر الناس! 😂',
    'واحد راح للدكتور قال: كل ما أشرب شاي أحس بألم في عيني! قال: شيل الملعقة من الكوب! 😂',
    'سألوا واحد: ليش تمشي ورا البنت؟ قال: من زود الأدب! 😂',
    'واحد قال لصاحبه: أمس حلمت إني شربت بحر! قال: شلون؟ قال: بسرعة! 😂',
    'واحد سأل صاحبه: عندك ساعة؟ قال: عندي بس ما أعرف الوقت! 😂'
];

const RIDDLES = [
    { q: 'شي يمشي وما عنده رجلين؟', a: 'الماء' },
    { q: 'شي كل ما أخذت منه كبر؟', a: 'الحفرة' },
    { q: 'عنده أسنان وما يعض؟', a: 'المشط' },
    { q: 'يدخل الماء ولا يبتل؟', a: 'الضوء' },
    { q: 'كلما زاد نقص؟', a: 'العمر' },
    { q: 'شي يكتب ولا يقرأ؟', a: 'القلم' },
    { q: 'شي يطير بلا جناح؟', a: 'الخيال' },
    { q: 'بحر بلا ماء؟', a: 'بحر الشعر' }
];

const CHALLENGES = [
    '🐉 ازأر كالتنين أمام الغرفة!',
    '🔥 اكتب اسمك مع إيموجي النار',
    '💎 قل شيئاً ثميناً لأول شخص يدخل',
    '👑 تحدى التنين في التخمين!',
    '🐲 قلد صوت التنين في الدردشة',
    '🎲 ارمِ النرد وقل ما يخرج'
];

const COMPLIMENTS = [
    '🐉 إنت مقاتل حقيقي! 🔥',
    '💎 إنت كنز نادر في مملكة التنين! 👑',
    '🔥 أنت أسطورة! 🐲',
    '👑 التنين معجب بشجاعتك!',
    '🐲 نورت عرين التنين! 💎',
    '⭐ أنت من اختارهم التنين بنفسه!'
];

const DRAGON_WISDOM = [
    '🐉 حكمة التنين: الحظ يعشق الجريء',
    '🔥 التنين يقول: من يخاف لا يفوز',
    '💎 كنز التنين: الوقت أغلى من الذهب',
    '👑 التنين يهدر: القوة بلا عقل هلاك',
    '🐲 من عرين التنين: الوفاء لا يُشترى'
];

// ═══════════════════════════════════════
// ذاكرة الألعاب
// ═══════════════════════════════════════
const rpsGames = {};
const guessGames = {};
const riddleGames = {};

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function getText(message) {
    if (typeof message === 'string') return message.trim();
    if (message && typeof message === 'object') {
        return String(message.message || message.content || message.text || message.body || '').trim();
    }
    return '';
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ═══════════════════════════════════════
// الاتصال
// ═══════════════════════════════════════
bot.once('Ready', () => {
    console.log('🐉 Dragon Bot Awakened!');
    console.log(`🔥 Room: ${ROOM_NAME}`);
});

// ═══════════════════════════════════════
// 🐉 الترحيب بالتنين
// ═══════════════════════════════════════
bot.on('UserJoined', async (user) => {
    console.log(`👤 ${user.username} entered the dragon's lair`);
    try {
        await delay(800);
        const welcome = rand(WELCOME_MESSAGES).replace('{user}', user.username);
        await bot.message.send(welcome);
        
        await delay(2500);
        await bot.message.send(`📜 اكتب !help لعرض أوامر التنين 🐉`);
    } catch (e) {
        console.log('❌ Welcome error:', e.message);
    }
});

// ═══════════════════════════════════════
// استقبال الرسائل
// ═══════════════════════════════════════
bot.on('Chat', async (user, message) => {
    try {
        const username = user.username || 'User';
        const text = getText(message);
        const lower = text.toLowerCase();

        console.log(`📨 ${username}: "${text}"`);

        // ═══ !help ═══
        if (lower === '!help' || lower === '!مساعدة') {
            await delay(300);
            await bot.message.send(
                `🐉 أوامر التنين:\n` +
                `🎲 !1 نرد التنين\n` +
                `🪙 !2 عملة الحظ\n` +
                `✊ !3 حجر ورقة مقص\n` +
                `🎯 !4 خمن الرقم\n` +
                `🧩 !5 لغز التنين\n` +
                `😂 !6 نكتة\n` +
                `😈 !7 تحدي\n` +
                `🌹 !8 مدح\n` +
                `👑 !9 حكمة التنين\n` +
                `🔍 !user [اسم]`
            );
            return;
        }

        // ═══ !1 نرد التنين ═══
        if (lower === '!1' || lower === '!نرد') {
            await delay(300);
            const n = Math.floor(Math.random() * 6) + 1;
            const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
            const comments = ['🔥 التنين راضٍ!', '💎 حظ سعيد!', '🐉 النرد ساخن!', '👑 رمية ملكية!'];
            await bot.message.send(`🐉 ${username} رمى نرد التنين: ${faces[n-1]} **${n}**\n${rand(comments)}`);
            return;
        }

        // ═══ !2 عملة ═══
        if (lower === '!2' || lower === '!عملة') {
            await delay(300);
            const r = Math.random() < 0.5 ? `👑 رأس التنين` : `💎 ذيل التنين`;
            await bot.message.send(`🐲 ${username} رما عملة التنين: **${r}**`);
            return;
        }

        // ═══ !3 حجر ورقة مقص ═══
        if (lower === '!3' || lower === '!حجر') {
            await delay(300);
            rpsGames[username] = true;
            await bot.message.send(`✊ ${username} اختر:\n1 = حجر 🪨\n2 = ورقة 📄\n3 = مقص ✂️`);
            return;
        }
        if (rpsGames[username] && ['1', '2', '3'].includes(lower)) {
            await delay(300);
            const choices = { '1': 'حجر 🪨', '2': 'ورقة 📄', '3': 'مقص ✂️' };
            const userChoice = lower;
            const botChoice = String(Math.floor(Math.random() * 3) + 1);
            let result = '';
            if (userChoice === botChoice) result = '🤝 تعادل!';
            else if (
                (userChoice === '1' && botChoice === '3') ||
                (userChoice === '2' && botChoice === '1') ||
                (userChoice === '3' && botChoice === '2')
            ) result = '🎉 فزت على التنين! 🔥';
            else result = '😈 التنين فاز! 🐉';

            await bot.message.send(`أنت: ${choices[userChoice]}\n🐲 التنين: ${choices[botChoice]}\n${result}`);
            delete rpsGames[username];
            return;
        }

        // ═══ !4 خمن الرقم ═══
        if (lower === '!4' || lower === '!خمن') {
            await delay(300);
            const target = Math.floor(Math.random() * 50) + 1;
            guessGames[username] = { target, tries: 0 };
            await bot.message.send(`🐉 ${username} خمن رقم بين 1 و 50!\n💎 كنز التنين مخبأ!`);
            return;
        }
        if (guessGames[username] && /^\d+$/.test(lower)) {
            await delay(300);
            const guess = parseInt(lower);
            const game = guessGames[username];
            game.tries++;
            if (guess === game.target) {
                await bot.message.send(`🎉 ${username} لقى الكنز! 💎\nالرقم ${game.target} في ${game.tries} محاولات!`);
                delete guessGames[username];
            } else if (guess < game.target) {
                await bot.message.send(`⬆️ الكنز أعلى من ${guess}`);
            } else {
                await bot.message.send(`⬇️ الكنز أقل من ${guess}`);
            }
            return;
        }

        // ═══ !5 لغز ═══
        if (lower === '!5' || lower === '!لغز') {
            await delay(300);
            const r = rand(RIDDLES);
            riddleGames[username] = { answer: r.a };
            await bot.message.send(`🐲 لغز التنين:\n🧩 ${r.q}`);
            return;
        }
        if (riddleGames[username] && !lower.startsWith('!') && !rpsGames[username] && !guessGames[username]) {
            await delay(300);
            if (text === riddleGames[username].answer) {
                await bot.message.send(`🎉 ${username} ذكي كالتنين! الجواب ${riddleGames[username].answer}`);
            } else {
                await bot.message.send(`❌ خطأ! الجواب ${riddleGames[username].answer}`);
            }
            delete riddleGames[username];
            return;
        }

        // ═══ !6 نكتة ═══
        if (lower === '!6' || lower === '!نكتة') {
            await delay(300);
            await bot.message.send(`😂 التنين يضحك:\n${rand(JOKES)}`);
            return;
        }

        // ═══ !7 تحدي ═══
        if (lower === '!7' || lower === '!تحدي') {
            await delay(300);
            await bot.message.send(`🐉 التنين يتحدى ${username}:\n${rand(CHALLENGES)}`);
            return;
        }

        // ═══ !8 مدح ═══
        if (lower === '!8' || lower === '!مدح') {
            await delay(300);
            await bot.message.send(rand(COMPLIMENTS).replace('${user}', username));
            return;
        }

        // ═══ !9 حكمة التنين ═══
        if (lower === '!9' || lower === '!حكمة') {
            await delay(300);
            await bot.message.send(rand(DRAGON_WISDOM));
            return;
        }

        // ═══ !user ═══
        if (lower.startsWith('!user') || lower.startsWith('!معلومات')) {
            try {
                let target = text
                    .replace(/^!user/i, '')
                    .replace(/^!معلومات/, '')
                    .trim()
                    .replace('@', '')
                    .trim();

                if (!target) target = username;

                await delay(500);
                await bot.message.send(`🐉 التنين يبحث عن ${target}...`);

                const profile = await bot.webapi.users.get(target);

                if (!profile || !profile.ok) {
                    await bot.message.send(`❌ التنين ما لقى: ${target}`);
                    return;
                }

                const info = [];
                info.push(`👤 ${profile.username || target}`);
                if (profile.bio && profile.bio.trim()) info.push(`📝 ${profile.bio}`);
                info.push(`👥 الأصدقاء: ${profile.friends || 0}`);
                info.push(`⭐ المتابعون: ${profile.followers || 0}`);
                info.push(`➡️ يتابع: ${profile.following || 0}`);
                if (profile.countryCode) info.push(`🌍 ${profile.countryCode}`);

                await bot.message.send(`📋 معلومات من أرشيف التنين:\n${info.join('\n')}`);

            } catch (e) {
                await bot.message.send(`⚠️ التنين ما قدر يجيب المعلومات`);
            }
            return;
        }

        // ═══ ردود تلقائية (بشخصية التنين) ═══
        const greetings = ['هلا', 'مرحبا', 'سلام', 'اهلا', 'أهلا', 'hi', 'hello', 'السلام عليكم'];
        if (greetings.includes(lower)) {
            await delay(500);
            await bot.message.send(rand(GREET_DRAGON).replace('${user}', username));
            return;
        }

        if (lower.includes('شكرا') || lower.includes('شكراً') || lower.includes('تسلم')) {
            await delay(500);
            await bot.message.send(`👑 التنين يشكرك ${username}! 💎`);
            return;
        }

        if (lower.includes('شلونك') || lower.includes('كيفك') || lower.includes('اخبارك')) {
            await delay(500);
            await bot.message.send(`🐉 التنين بخير، يحرس الكنوز! 💎`);
            return;
        }

    } catch (e) {
        console.log('❌ ERROR:', e.message);
    }
});

// ═══════════════════════════════════════
// تسجيل الدخول
// ═══════════════════════════════════════
bot.login(process.env.HIGHRISE_TOKEN, process.env.HIGHRISE_ROOM_ID);
console.log('🐉 Dragon Bot Rising...');

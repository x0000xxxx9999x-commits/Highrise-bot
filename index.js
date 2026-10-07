const { Highrise } = require('highrise.bot');
const bot = new Highrise();

// ═══════════════════════════════════════
// البيانات
// ═══════════════════════════════════════
const jokes = [
    'واحد دخل المطعم قال: عندكم دجاج؟ قال: لا. قال: ليش المطعم مفتوح؟ قال: نخبر الناس! 😂',
    'واحد راح للدكتور قال: كل ما أشرب شاي أحس بألم في عيني! قال: شيل الملعقة من الكوب! 😂',
    'سألوا واحد: ليش تمشي ورا البنت؟ قال: من زود الأدب! 😂',
    'واحد قال لصاحبه: أمس حلمت إني شربت بحر! قال: شلون؟ قال: بسرعة! 😂',
    'واحد سأل صاحبه: عندك ساعة؟ قال: عندي بس ما أعرف الوقت! 😂'
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
    'اكتب أحبكم كلكم! ❤️',
    'سوي رقصة! 💃',
    'قلد صوت حيوان! 🐱'
];

// ═══════════════════════════════════════
// ذاكرة الألعاب
// ═══════════════════════════════════════
const rpsGames = {};
const guessGames = {};
const riddleGames = {};

// ═══════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════
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
// عند الاتصال
// ═══════════════════════════════════════
bot.once('Ready', () => {
    console.log('✅ Bot Connected');
});

// ═══════════════════════════════════════
// الترحيب
// ═══════════════════════════════════════
bot.on('UserJoined', async (user) => {
    console.log(`👤 Join: ${user.username}`);
    try {
        await delay(500);
        await bot.message.send(`مرحباً بك ${user.username} في غرفة BLACK MARKET 🕶️`);
    } catch (e) { console.log('Error:', e.message); }
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

        // ═══════ !مساعدة ═══════
        if (lower === '!مساعدة' || lower === '!help') {
            await delay(300);
            await bot.message.send(`📜 الأوامر:\n!1 نرد\n!2 عملة\n!3 حجر ورقة مقص\n!4 خمن الرقم\n!5 لغز\n!6 نكتة\n!7 تحدي\n!user معلومات مستخدم`);
            return;
        }

        // ═══════ !1 نرد ═══════
        if (lower === '!1' || lower === '!نرد') {
            await delay(300);
            const n = Math.floor(Math.random() * 6) + 1;
            await bot.message.send(`🎲 ${username} رمى النرد: ${n}`);
            return;
        }

        // ═══════ !2 عملة ═══════
        if (lower === '!2' || lower === '!عملة') {
            await delay(300);
            const r = Math.random() < 0.5 ? '👑 صورة' : '📝 كتابة';
            await bot.message.send(`🪙 ${username}: ${r}`);
            return;
        }

        // ═══════ !3 حجر ورقة مقص ═══════
        if (lower === '!3' || lower === '!حجر') {
            await delay(300);
            rpsGames[username] = true;
            await bot.message.send(`✊ ${username} اختر:\n1 = حجر\n2 = ورقة\n3 = مقص`);
            return;
        }
        if (rpsGames[username] && ['1', '2', '3'].includes(lower)) {
            await delay(300);
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

            await bot.message.send(`أنت: ${choices[userChoice]} | البوت: ${choices[botChoice]} — ${result}`);
            delete rpsGames[username];
            return;
        }

        // ═══════ !4 خمن الرقم ═══════
        if (lower === '!4' || lower === '!خمن') {
            await delay(300);
            const target = Math.floor(Math.random() * 50) + 1;
            guessGames[username] = { target, tries: 0 };
            await bot.message.send(`🎯 ${username} خمن رقم بين 1 و 50!`);
            return;
        }
        if (guessGames[username] && /^\d+$/.test(lower)) {
            await delay(300);
            const guess = parseInt(lower);
            const game = guessGames[username];
            game.tries++;
            if (guess === game.target) {
                await bot.message.send(`🎉 ${username} صح! الرقم ${game.target} في ${game.tries} محاولات`);
                delete guessGames[username];
            } else if (guess < game.target) {
                await bot.message.send(`⬆️ الرقم أكبر من ${guess}`);
            } else {
                await bot.message.send(`⬇️ الرقم أصغر من ${guess}`);
            }
            return;
        }

        // ═══════ !5 لغز ═══════
        if (lower === '!5' || lower === '!لغز') {
            await delay(300);
            const r = rand(riddles);
            riddleGames[username] = { answer: r.a };
            await bot.message.send(`🧩 ${username} ${r.q}`);
            return;
        }
        if (riddleGames[username] && !lower.startsWith('!') && !rpsGames[username] && !guessGames[username]) {
            await delay(300);
            if (text === riddleGames[username].answer) {
                await bot.message.send(`🎉 ${username} صح! الجواب ${riddleGames[username].answer}`);
            } else {
                await bot.message.send(`❌ خطأ! الجواب ${riddleGames[username].answer}`);
            }
            delete riddleGames[username];
            return;
        }

        // ═══════ !6 نكتة ═══════
        if (lower === '!6' || lower === '!نكتة') {
            await delay(300);
            await bot.message.send(`😂 ${username} ${rand(jokes)}`);
            return;
        }

        // ═══════ !7 تحدي ═══════
        if (lower === '!7' || lower === '!تحدي') {
            await delay(300);
            await bot.message.send(`😈 ${username} ${rand(challenges)}`);
            return;
        }

        // ═══════════════════════════════════════
        // ═══════ !user معلومات مستخدم ═══════
        // ═══════════════════════════════════════
        if (lower.startsWith('!user') || lower.startsWith('!معلومات') || lower.startsWith('!يوزر')) {
            try {
                // استخرج الاسم المستهدف
                let target = text
                    .replace(/^!user/i, '')
                    .replace(/^!معلومات/, '')
                    .replace(/^!يوزر/, '')
                    .trim();

                target = target.replace('@', '').trim();

                // إذا ما كتب اسم → معلومات نفسه
                if (!target) {
                    target = username;
                }

                await delay(500);
                await bot.message.send(`🔍 جاري البحث عن ${target}...`);

                // جلب البيانات
                const profile = await bot.webapi.users.get(target);

                console.log('🔍 Profile data:', JSON.stringify(profile));

                if (!profile || !profile.ok) {
                    await bot.message.send(`❌ ما لقيت المستخدم: ${target}`);
                    return;
                }

                // بناء قائمة المعلومات
                const info = [];
                info.push(`👤 الاسم: ${profile.username || target}`);

                if (profile.bio && profile.bio.trim()) {
                    info.push(`📝 النبذة: ${profile.bio}`);
                }

                info.push(`👥 الأصدقاء: ${profile.friends || 0}`);
                info.push(`⭐ المتابعون: ${profile.followers || 0}`);
                info.push(`➡️ يتابع: ${profile.following || 0}`);

                if (profile.joinedAt) {
                    try {
                        const d = new Date(profile.joinedAt);
                        info.push(`📅 انضم: ${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
                    } catch (e) {}
                }

                if (profile.lastOnlineIn) {
                    try {
                        const d = new Date(profile.lastOnlineIn);
                        info.push(`🕐 آخر ظهور: ${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
                    } catch (e) {}
                }

                if (profile.crew && profile.crew.name) {
                    info.push(`🎭 العصابة: ${profile.crew.name}`);
                }

                if (profile.activeRoom && profile.activeRoom.name) {
                    info.push(`🏠 في غرفة: ${profile.activeRoom.name}`);
                }

                if (profile.countryCode) {
                    info.push(`🌍 الدولة: ${profile.countryCode}`);
                }

                await bot.message.send(`📋 معلومات ${profile.username || target}:\n${info.join('\n')}`);
                console.log(`✅ Sent info for: ${target}`);

            } catch (e) {
                console.log('❌ user error:', e.message);
                await bot.message.send(`⚠️ خطأ في جلب معلومات المستخدم`);
            }
            return;
        }

        // ═══════ ردود تلقائية ═══════
        const greetings = ['هلا', 'مرحبا', 'سلام', 'اهلا', 'أهلا', 'hi', 'hello', 'السلام عليكم'];
        if (greetings.includes(lower)) {
            await delay(400);
            await bot.message.send(`👋 أهلاً ${username}!`);
            return;
        }

        if (lower.includes('شكرا') || lower.includes('شكراً') || lower.includes('تسلم')) {
            await delay(400);
            await bot.message.send(`🤍 على الرحب ${username}!`);
            return;
        }

        if (lower.includes('شلونك') || lower.includes('كيفك') || lower.includes('اخبارك')) {
            await delay(400);
            await bot.message.send(`😊 بخير دامك موجود ${username}!`);
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
console.log('🚀 Bot Starting...');

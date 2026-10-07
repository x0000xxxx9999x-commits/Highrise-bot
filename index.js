const { Highrise } = require('highrise.bot');
const fs = require('fs');
const path = require('path');
const bot = new Highrise();

// ═══════════════════════════════════════
// ملف حفظ الرقصات
// ═══════════════════════════════════════
const DANCES_FILE = path.join(__dirname, 'dances.json');

// تحميل الرقصات المحفوظة
let savedDances = [];
try {
    if (fs.existsSync(DANCES_FILE)) {
        savedDances = JSON.parse(fs.readFileSync(DANCES_FILE, 'utf8'));
        console.log(`📂 Loaded ${savedDances.length} dances from file`);
    }
} catch (e) {
    console.log('⚠️ No dances file yet');
    savedDances = [];
}

// حفظ الرقصات
function saveDances() {
    try {
        fs.writeFileSync(DANCES_FILE, JSON.stringify(savedDances, null, 2));
    } catch (e) {
        console.log('❌ Save error:', e.message);
    }
}

// إضافة رقصة جديدة (بدون تكرار)
function addDance(emoteId, emoteName) {
    if (!emoteId) return false;
    const exists = savedDances.find(d => d.id === emoteId);
    if (exists) return false;

    savedDances.push({
        id: emoteId,
        name: emoteName || `Dance ${savedDances.length + 1}`
    });
    saveDances();
    console.log(`💾 Saved new dance: ${emoteName} (${emoteId})`);
    return true;
}

// ═══════════════════════════════════════
// البيانات
// ═══════════════════════════════════════
const jokes = [
    'واحد دخل المطعم قال: عندكم دجاج؟ قال: لا. قال: ليش المطعم مفتوح؟ قال: نخبر الناس! 😂',
    'واحد راح للدكتور قال: كل ما أشرب شاي أحس بألم في عيني! قال: شيل الملعقة من الكوب! 😂',
    'سألوا واحد: ليش تمشي ورا البنت؟ قال: من زود الأدب! 😂'
];

const riddles = [
    { q: 'شي يمشي وما عنده رجلين؟', a: 'الماء' },
    { q: 'شي كل ما أخذت منه كبر؟', a: 'الحفرة' },
    { q: 'عنده أسنان وما يعض؟', a: 'المشط' }
];

const challenges = ['سوي رقصة! 💃', 'قلد صوت حيوان! 🐱'];
const compliments = ['إنت أسطورة! 🔥', 'وجودك ينور الغرفة! ✨'];

// ═══════════════════════════════════════
// ذاكرة الألعاب
// ═══════════════════════════════════════
const rpsGames = {};
const guessGames = {};
const riddleGames = {};

// ═══════════════════════════════════════
// دوال
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
    console.log(`💃 Dances in memory: ${savedDances.length}`);
});

// ═══════════════════════════════════════
// 🎭 سماع كل الرقصات في الغرفة
// ═══════════════════════════════════════
const emoteEventNames = [
    'Emote',
    'emote',
    'PlayerEmote',
    'playerEmote',
    'UserEmote',
    'userEmote',
    'EmoteCreate',
    'emoteCreate'
];

emoteEventNames.forEach(eventName => {
    try {
        bot.on(eventName, (data1, data2) => {
            console.log(`🎭 EVENT "${eventName}":`);
            console.log(`   Data1:`, JSON.stringify(data1));
            console.log(`   Data2:`, JSON.stringify(data2));

            // حاول استخراج emoteId من البيانات
            let emoteId = null;
            let emoteName = null;

            // جرّب كل الاحتمالات
            if (data2 && typeof data2 === 'object') {
                emoteId = data2.id || data2.emoteId || data2.emote_id;
                emoteName = data2.name || data2.emoteName;
            }
            if (!emoteId && data1 && typeof data1 === 'object') {
                emoteId = data1.id || data1.emoteId || data1.emote_id;
                emoteName = data1.name || data1.emoteName;
            }
            if (!emoteId && typeof data1 === 'string') {
                emoteId = data1;
            }
            if (!emoteId && typeof data2 === 'string') {
                emoteId = data2;
            }

            if (emoteId) {
                const saved = addDance(emoteId, emoteName);
                if (saved) {
                    console.log(`✅ NEW DANCE SAVED! Total: ${savedDances.length}`);
                }
            }
        });
    } catch (e) {}
});

// ═══════════════════════════════════════
// الترحيب
// ═══════════════════════════════════════
bot.on('UserJoined', async (user) => {
    console.log(`👤 Join: ${user.username}`);
    try {
        await delay(500);
        await bot.message.send(`مرحباً بك ${user.username} في غرفة BLACK MARKET 🕶️`);
    } catch (e) {}
});

// ═══════════════════════════════════════
// استقبال الرسائل
// ═══════════════════════════════════════
bot.on('Chat', async (user, message) => {
    try {
        const username = user.username || 'User';
        const userId = user.id;
        const text = getText(message);
        const lower = text.toLowerCase();

        console.log(`📨 ${username}: "${text}"`);

        // ═══════ !مساعدة ═══════
        if (lower === '!help' || lower === '!مساعدة') {
            await delay(300);
            await bot.message.send(`📜 الأوامر:\n!1 !2 !3 !4 !5 !6 !7 !8\n!user\n!رقصات - قائمة الرقصات\n!رقص [رقم] - يرقصك`);
            return;
        }

        // ═══════════════════════════════════════
        // ═══════ !رقصات — عرض قائمة الرقصات ═══════
        // ═══════════════════════════════════════
        if (lower === '!رقصات' || lower === '!dances' || lower === '!listdances') {
            await delay(300);
            if (savedDances.length === 0) {
                await bot.message.send(`📭 ما عندي رقصات محفوظة بعد\nارقص عشان أتعلم! 💃`);
                return;
            }
            let msg = `💃 الرقصات المتوفرة (${savedDances.length}):\n`;
            savedDances.forEach((d, i) => {
                msg += `${i + 1}. ${d.name}\n`;
            });
            msg += `\nاكتب: !رقص [رقم]`;
            await bot.message.send(msg);
            return;
        }

        // ═══════════════════════════════════════
        // ═══════ !رقص [رقم] — يجعل المستخدم يرقص ═══════
        // ═══════════════════════════════════════
        if (lower.startsWith('!رقص') || lower.startsWith('!dance')) {
            try {
                const parts = text.split(' ');
                const numStr = parts[1] ? parts[1].trim() : '';

                if (!numStr) {
                    await delay(300);
                    await bot.message.send(`❌ اكتب رقم الرقصة. مثال: !رقص 1`);
                    return;
                }

                const num = parseInt(numStr);
                if (isNaN(num) || num < 1 || num > savedDances.length) {
                    await delay(300);
                    await bot.message.send(`❌ رقم غلط! الأرقام المتوفرة: 1-${savedDances.length}`);
                    return;
                }

                const dance = savedDances[num - 1];
                await delay(300);
                console.log(`💃 Playing dance #${num} for ${username}: ${dance.name} (${dance.id})`);

                try {
                    await bot.player.emote(userId, dance.id);
                    await bot.message.send(`💃 ${username} يرقص: ${dance.name}!`);
                    console.log(`✅ Dance sent: ${dance.id}`);
                } catch (e) {
                    console.log(`❌ Dance error: ${e.message}`);
                    await bot.message.send(`⚠️ ما قدرت أرقصك`);
                }

            } catch (e) {
                console.log('❌ dance error:', e.message);
            }
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
            await bot.message.send(`✊ ${username} اختر: 1=حجر 2=ورقة 3=مقص`);
            return;
        }
        if (rpsGames[username] && ['1', '2', '3'].includes(lower)) {
            await delay(300);
            const choices = { '1': 'حجر ✊', '2': 'ورقة 📄', '3': 'مقص ✂️' };
            const botChoice = String(Math.floor(Math.random() * 3) + 1);
            let result = '😢 خسرت!';
            if (lower === botChoice) result = '🤝 تعادل!';
            else if (
                (lower === '1' && botChoice === '3') ||
                (lower === '2' && botChoice === '1') ||
                (lower === '3' && botChoice === '2')
            ) result = '🎉 فزت!';
            await bot.message.send(`أنت: ${choices[lower]} | البوت: ${choices[botChoice]} — ${result}`);
            delete rpsGames[username];
            return;
        }

        // ═══════ !4 خمن ═══════
        if (lower === '!4' || lower === '!خمن') {
            await delay(300);
            const target = Math.floor(Math.random() * 50) + 1;
            guessGames[username] = { target, tries: 0 };
            await bot.message.send(`🎯 ${username} خمن 1-50!`);
            return;
        }
        if (guessGames[username] && /^\d+$/.test(lower)) {
            await delay(300);
            const guess = parseInt(lower);
            const game = guessGames[username];
            game.tries++;
            if (guess === game.target) {
                await bot.message.send(`🎉 ${username} صح! في ${game.tries} محاولات`);
                delete guessGames[username];
            } else if (guess < game.target) {
                await bot.message.send(`⬆️ أكبر من ${guess}`);
            } else {
                await bot.message.send(`⬇️ أصغر من ${guess}`);
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
        if (riddleGames[username] && !lower.startsWith('!')) {
            await delay(300);
            if (text === riddleGames[username].answer) {
                await bot.message.send(`🎉 صح!`);
            } else {
                await bot.message.send(`❌ خطأ! الجواب ${riddleGames[username].answer}`);
            }
            delete riddleGames[username];
            return;
        }

        // ═══════ !6 نكتة ═══════
        if (lower === '!6' || lower === '!نكتة') {
            await delay(300);
            await bot.message.send(`😂 ${rand(jokes)}`);
            return;
        }

        // ═══════ !7 تحدي ═══════
        if (lower === '!7' || lower === '!تحدي') {
            await delay(300);
            await bot.message.send(`😈 ${rand(challenges)}`);
            return;
        }

        // ═══════ !8 مدح ═══════
        if (lower === '!8' || lower === '!مدح') {
            await delay(300);
            await bot.message.send(`🌹 ${rand(compliments)}`);
            return;
        }

        // ═══════ !user ═══════
        if (lower.startsWith('!user') || lower.startsWith('!معلومات')) {
            try {
                let target = text.replace(/^!user/i, '').replace(/^!معلومات/, '').trim().replace('@', '').trim();
                if (!target) target = username;

                await delay(500);
                await bot.message.send(`🔍 البحث...`);

                const profile = await bot.webapi.users.get(target);

                if (!profile || !profile.ok) {
                    await bot.message.send(`❌ ما لقيت`);
                    return;
                }

                const info = [];
                info.push(`👤 ${profile.username || target}`);
                if (profile.bio) info.push(`📝 ${profile.bio}`);
                info.push(`👥 ${profile.friends || 0}`);
                info.push(`⭐ ${profile.followers || 0}`);
                info.push(`➡️ ${profile.following || 0}`);
                if (profile.countryCode) info.push(`🌍 ${profile.countryCode}`);

                await bot.message.send(`📋 ${info.join(' | ')}`);
            } catch (e) {
                await bot.message.send(`⚠️ خطأ`);
            }
            return;
        }

        // ═══════ ردود تلقائية ═══════
        const greetings = ['هلا', 'مرحبا', 'سلام', 'اهلا', 'أهلا', 'hi', 'hello'];
        if (greetings.includes(lower)) {
            await delay(400);
            await bot.message.send(`👋 أهلاً ${username}!`);
            return;
        }
        if (lower.includes('شكرا') || lower.includes('تسلم')) {
            await delay(400);
            await bot.message.send(`🤍 على الرحب!`);
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

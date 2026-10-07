const { Highrise } = require('highrise.bot');
const fs = require('fs');
const path = require('path');
const bot = new Highrise();

// ═══════════════════════════════════════
// ملف الرقصات
// ═══════════════════════════════════════
const DANCES_FILE = path.join(__dirname, 'dances.json');
let savedDances = [];
try {
    if (fs.existsSync(DANCES_FILE)) {
        savedDances = JSON.parse(fs.readFileSync(DANCES_FILE, 'utf8'));
        console.log(`📂 Loaded ${savedDances.length} dances`);
    }
} catch (e) { savedDances = []; }

function saveDances() {
    try { fs.writeFileSync(DANCES_FILE, JSON.stringify(savedDances, null, 2)); }
    catch (e) {}
}

function addDance(emoteId, emoteName) {
    if (!emoteId || typeof emoteId !== 'string') return false;
    const exists = savedDances.find(d => d.id === emoteId);
    if (exists) return false;
    savedDances.push({ id: emoteId, name: emoteName || `Dance ${savedDances.length + 1}` });
    saveDances();
    return true;
}

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

const compliments = [
    'إنت أسطورة! 🔥',
    'وجودك ينور الغرفة! ✨',
    'إنت الأفضل! 💯',
    'ربنا يحميك! 🤍'
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
// الاتصال
// ═══════════════════════════════════════
bot.once('Ready', () => {
    console.log('✅ Bot Connected');
    console.log(`💃 Dances in memory: ${savedDances.length}`);

    console.log('🔍 Available methods:');
    if (bot.player) {
        Object.keys(bot.player).forEach(k => {
            console.log(`   bot.player.${k}: ${typeof bot.player[k]}`);
        });
    }
    if (bot.webapi) {
        Object.keys(bot.webapi).forEach(k => {
            console.log(`   bot.webapi.${k}: ${typeof bot.webapi[k]}`);
        });
    }
});

// ═══════════════════════════════════════
// استقبال الرقصات
// ═══════════════════════════════════════
bot.on('Emote', (userData, emoteData) => {
    console.log(`🎭 Emote Event`);
    console.log(`   User:`, JSON.stringify(userData));
    console.log(`   Emote:`, JSON.stringify(emoteData));

    let emoteId = null;

    if (typeof emoteData === 'string') {
        emoteId = emoteData;
    } else if (emoteData && typeof emoteData === 'object') {
        emoteId = emoteData.id || emoteData.emoteId || emoteData.name;
    }

    if (emoteId && typeof emoteId === 'string') {
        const saved = addDance(emoteId, emoteId);
        if (saved) {
            console.log(`✅ SAVED: ${emoteId} (Total: ${savedDances.length})`);
        }
    }
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
// الرسائل
// ═══════════════════════════════════════
bot.on('Chat', async (user, message) => {
    try {
        const username = user.username || 'User';
        const userId = user.id;
        const text = getText(message);
        const lower = text.toLowerCase();

        console.log(`📨 ${username}: "${text}"`);

        if (lower === '!help' || lower === '!مساعدة') {
            await delay(300);
            await bot.message.send(`📜 !1-!8 | !user | !رقصات | !رقص [رقم]`);
            return;
        }

        // ═══ !رقصات ═══
        if (lower === '!رقصات' || lower === '!dances') {
            await delay(300);
            if (savedDances.length === 0) {
                await bot.message.send(`📭 ما عندي رقصات. ارقص عشان أتعلم!`);
                return;
            }
            let msg = `💃 الرقصات (${savedDances.length}):\n`;
            savedDances.forEach((d, i) => {
                msg += `${i + 1}. ${d.id}\n`;
            });
            await bot.message.send(msg);
            return;
        }

        // ═══ !رقص [رقم] ═══
        if (lower.startsWith('!رقص') || lower.startsWith('!dance')) {
            const parts = text.split(' ');
            const numStr = parts[1] ? parts[1].trim() : '';

            if (!numStr) {
                await delay(300);
                await bot.message.send(`❌ !رقص [رقم]`);
                return;
            }

            const num = parseInt(numStr);
            if (isNaN(num) || num < 1 || num > savedDances.length) {
                await delay(300);
                await bot.message.send(`❌ رقم غلط`);
                return;
            }

            const dance = savedDances[num - 1];
            await delay(300);
            console.log(`💃 Dance #${num} for ${username}: ${dance.id}`);

            let success = false;
            let usedMethod = '';

            if (!success && bot.player && typeof bot.player.emote === 'function') {
                try {
                    await bot.player.emote(userId, dance.id);
                    success = true;
                    usedMethod = 'player.emote';
                    console.log(`✅ Method 1 worked`);
                } catch (e) { console.log(`M1: ${e.message}`); }
            }

            if (!success && bot.player && typeof bot.player.playEmote === 'function') {
                try {
                    await bot.player.playEmote(userId, dance.id);
                    success = true;
                    usedMethod = 'player.playEmote';
                    console.log(`✅ Method 2 worked`);
                } catch (e) { console.log(`M2: ${e.message}`); }
            }

            if (!success && bot.webapi && bot.webapi.room && typeof bot.webapi.room.emote === 'function') {
                try {
                    await bot.webapi.room.emote(userId, dance.id);
                    success = true;
                    usedMethod = 'webapi.room.emote';
                    console.log(`✅ Method 3 worked`);
                } catch (e) { console.log(`M3: ${e.message}`); }
            }

            if (!success && bot.webapi && bot.webapi.player && typeof bot.webapi.player.emote === 'function') {
                try {
                    await bot.webapi.player.emote(userId, dance.id);
                    success = true;
                    usedMethod = 'webapi.player.emote';
                    console.log(`✅ Method 4 worked`);
                } catch (e) { console.log(`M4: ${e.message}`); }
            }

            if (!success && typeof bot.emote === 'function') {
                try {
                    await bot.emote(userId, dance.id);
                    success = true;
                    usedMethod = 'bot.emote';
                    console.log(`✅ Method 5 worked`);
                } catch (e) { console.log(`M5: ${e.message}`); }
            }

            if (success) {
                await bot.message.send(`💃 ${username} يرقص! (${usedMethod})`);
            } else {
                await bot.message.send(`⚠️ ما قدرت — شوف Console`);
            }
            return;
        }

        // ═══ الألعاب ═══
        if (lower === '!1' || lower === '!نرد') {
            await delay(300);
            await bot.message.send(`🎲 ${username}: ${Math.floor(Math.random() * 6) + 1}`);
            return;
        }
        if (lower === '!2' || lower === '!عملة') {
            await delay(300);
            await bot.message.send(`🪙 ${Math.random() < 0.5 ? 'صورة' : 'كتابة'}`);
            return;
        }
        if (lower === '!3' || lower === '!حجر') {
            await delay(300);
            rpsGames[username] = true;
            await bot.message.send(`✊ ${username}: 1=حجر 2=ورقة 3=مقص`);
            return;
        }
        if (rpsGames[username] && ['1', '2', '3'].includes(lower)) {
            await delay(300);
            const c = { '1': 'حجر', '2': 'ورقة', '3': 'مقص' };
            const b = String(Math.floor(Math.random() * 3) + 1);
            let r = '😢 خسرت';
            if (lower === b) r = '🤝 تعادل';
            else if ((lower === '1' && b === '3') || (lower === '2' && b === '1') || (lower === '3' && b === '2')) r = '🎉 فزت';
            await bot.message.send(`أنت: ${c[lower]} | البوت: ${c[b]} — ${r}`);
            delete rpsGames[username];
            return;
        }
        if (lower === '!4' || lower === '!خمن') {
            await delay(300);
            const t = Math.floor(Math.random() * 50) + 1;
            guessGames[username] = { target: t, tries: 0 };
            await bot.message.send(`🎯 ${username} خمن 1-50!`);
            return;
        }
        if (guessGames[username] && /^\d+$/.test(lower)) {
            await delay(300);
            const g = parseInt(lower);
            const game = guessGames[username];
            game.tries++;
            if (g === game.target) {
                await bot.message.send(`🎉 صح! في ${game.tries}`);
                delete guessGames[username];
            } else if (g < game.target) {
                await bot.message.send(`⬆️ أكبر`);
            } else {
                await bot.message.send(`⬇️ أصغر`);
            }
            return;
        }
        if (lower === '!5' || lower === '!لغز') {
            await delay(300);
            const r = rand(riddles);
            riddleGames[username] = { answer: r.a };
            await bot.message.send(`🧩 ${r.q}`);
            return;
        }
        if (riddleGames[username] && !lower.startsWith('!')) {
            await delay(300);
            if (text === riddleGames[username].answer) {
                await bot.message.send(`🎉 صح!`);
            } else {
                await bot.message.send(`❌ الجواب: ${riddleGames[username].answer}`);
            }
            delete riddleGames[username];
            return;
        }
        if (lower === '!6' || lower === '!نكتة') {
            await delay(300);
            await bot.message.send(`😂 ${rand(jokes)}`);
            return;
        }
        if (lower === '!7' || lower === '!تحدي') {
            await delay(300);
            await bot.message.send(`😈 ${rand(challenges)}`);
            return;
        }
        if (lower === '!8' || lower === '!مدح') {
            await delay(300);
            await bot.message.send(`🌹 ${rand(compliments)}`);
            return;
        }

        // ═══ !user ═══
        if (lower.startsWith('!user') || lower.startsWith('!معلومات')) {
            try {
                let target = text.replace(/^!user/i, '').replace(/^!معلومات/, '').trim().replace('@', '').trim();
                if (!target) target = username;
                await delay(500);
                const p = await bot.webapi.users.get(target);
                if (!p || !p.ok) { await bot.message.send(`❌ ما لقيت`); return; }
                const info = [`👤 ${p.username || target}`];
                if (p.bio) info.push(`📝 ${p.bio}`);
                info.push(`👥 ${p.friends || 0} | ⭐ ${p.followers || 0}`);
                if (p.countryCode) info.push(`🌍 ${p.countryCode}`);
                await bot.message.send(`📋 ${info.join(' | ')}`);
            } catch (e) { await bot.message.send(`⚠️ خطأ`); }
            return;
        }

        // ═══ ردود تلقائية ═══
        const greetings = ['هلا', 'مرحبا', 'سلام', 'اهلا', 'hi', 'hello'];
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

    } catch (e) { console.log('❌ ERROR:', e.message); }
});

bot.login(process.env.HIGHRISE_TOKEN, process.env.HIGHRISE_ROOM_ID);
console.log('🚀 Bot Starting...');

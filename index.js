const { Highrise } = require('highrise.bot');
const fs = require('fs');
const path = require('path');
const bot = new Highrise();

// ═══════════════════════════════════════
// ملف الحركات
// ═══════════════════════════════════════
const DANCES_FILE = path.join(__dirname, 'dances.json');
let savedDances = [];
try {
    if (fs.existsSync(DANCES_FILE)) {
        savedDances = JSON.parse(fs.readFileSync(DANCES_FILE, 'utf8'));
        console.log(`📂 Loaded ${savedDances.length} movements`);
    }
} catch (e) { savedDances = []; }

function saveDances() {
    try { fs.writeFileSync(DANCES_FILE, JSON.stringify(savedDances, null, 2)); }
    catch (e) {}
}

function addDance(emoteId) {
    if (!emoteId || typeof emoteId !== 'string') return false;
    const exists = savedDances.find(d => d.id === emoteId);
    if (exists) return false;
    savedDances.push({ id: emoteId, name: emoteId });
    saveDances();
    return true;
}

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
// الاتصال - نشوف كل الطرق المتوفرة
// ═══════════════════════════════════════
bot.once('Ready', () => {
    console.log('✅ Bot Connected');
    console.log(`📂 Movements: ${savedDances.length}`);

    console.log('═══════════════════════════════');
    console.log('🔍 Checking all available methods:');
    console.log('═══════════════════════════════');

    // bot.player
    if (bot.player) {
        console.log('bot.player methods:');
        Object.getOwnPropertyNames(Object.getPrototypeOf(bot.player)).forEach(m => {
            if (typeof bot.player[m] === 'function') {
                console.log(`   ✅ bot.player.${m}()`);
            }
        });
        Object.keys(bot.player).forEach(k => {
            if (typeof bot.player[k] === 'function') {
                console.log(`   ✅ bot.player.${k}()`);
            }
        });
    }

    // bot.room
    if (bot.room) {
        console.log('bot.room methods:');
        Object.getOwnPropertyNames(Object.getPrototypeOf(bot.room)).forEach(m => {
            if (typeof bot.room[m] === 'function') {
                console.log(`   ✅ bot.room.${m}()`);
            }
        });
    }

    // bot.webapi
    if (bot.webapi) {
        console.log('bot.webapi keys:');
        Object.keys(bot.webapi).forEach(k => {
            console.log(`   📦 bot.webapi.${k}: ${typeof bot.webapi[k]}`);
        });
    }

    // bot.highrise (low level)
    if (bot.highrise) {
        console.log('bot.highrise methods:');
        Object.getOwnPropertyNames(Object.getPrototypeOf(bot.highrise)).forEach(m => {
            if (typeof bot.highrise[m] === 'function') {
                console.log(`   ✅ bot.highrise.${m}()`);
            }
        });
    }

    console.log('═══════════════════════════════');
});

// ═══════════════════════════════════════
// استقبال الحركات
// ═══════════════════════════════════════
bot.on('Emote', (userData, emoteData) => {
    let emoteId = null;
    if (typeof emoteData === 'string') emoteId = emoteData;
    else if (emoteData && emoteData.id) emoteId = emoteData.id;
    else if (emoteData && emoteData.name) emoteId = emoteData.name;

    if (emoteId) {
        const username = userData && userData.username ? userData.username : 'unknown';
        if (addDance(emoteId)) {
            console.log(`✅ NEW movement saved: "${emoteId}" by ${username} (Total: ${savedDances.length})`);
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

        console.log(`📨 ${username} (${userId}): "${text}"`);

        // ═══ !help ═══
        if (lower === '!help' || lower === '!مساعدة') {
            await delay(300);
            await bot.message.send(`📜 !رقصات | !رقص [رقم] | !يوزر [اسم]`);
            return;
        }

        // ═══ !رقصات ═══
        if (lower === '!رقصات' || lower === '!dances') {
            await delay(300);
            if (savedDances.length === 0) {
                await bot.message.send(`📭 ما عندي حركات`);
                return;
            }
            let msg = `💃 الحركات (${savedDances.length}):\n`;
            savedDances.forEach((d, i) => {
                msg += `${i + 1}. ${d.id}\n`;
            });
            await bot.message.send(msg);
            return;
        }

        // ═══ !رقص [رقم] - نجرب كل الطرق الممكنة ═══
        if (lower.startsWith('!رقص') || lower.startsWith('!dance') || lower.startsWith('!حركة')) {
            const parts = text.split(' ');
            const numStr = parts[1] ? parts[1].trim() : '';

            if (!numStr) {
                await delay(300);
                await bot.message.send(`❌ اكتب رقم: !رقص 1`);
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
            console.log(`═══════════════════════════════`);
            console.log(`💃 Testing ALL methods for: ${dance.id}`);
            console.log(`   User: ${username} (${userId})`);
            console.log(`═══════════════════════════════`);

            // ═══ الطريقة 1 ═══
            try {
                console.log(`[1] bot.player.emote(userId, emoteId)...`);
                await bot.player.emote(userId, dance.id);
                console.log(`[1] ✅ SUCCESS`);
            } catch (e) { console.log(`[1] ❌ ${e.message}`); }

            await delay(500);

            // ═══ الطريقة 2 ═══
            try {
                console.log(`[2] bot.player.emote(emoteId)...`);
                await bot.player.emote(dance.id);
                console.log(`[2] ✅ SUCCESS`);
            } catch (e) { console.log(`[2] ❌ ${e.message}`); }

            await delay(500);

            // ═══ الطريقة 3: highrise.send_emote ═══
            if (bot.highrise && typeof bot.highrise.send_emote === 'function') {
                try {
                    console.log(`[3] bot.highrise.send_emote(emoteId)...`);
                    await bot.highrise.send_emote(dance.id);
                    console.log(`[3] ✅ SUCCESS`);
                } catch (e) { console.log(`[3] ❌ ${e.message}`); }
            }

            await delay(500);

            // ═══ الطريقة 4: bot.highrise.send_emote(userId, emoteId) ═══
            if (bot.highrise && typeof bot.highrise.send_emote === 'function') {
                try {
                    console.log(`[4] bot.highrise.send_emote(userId, emoteId)...`);
                    await bot.highrise.send_emote(userId, dance.id);
                    console.log(`[4] ✅ SUCCESS`);
                } catch (e) { console.log(`[4] ❌ ${e.message}`); }
            }

            await delay(500);

            // ═══ الطريقة 5: bot.highrise.send_whisper ═══
            if (bot.highrise && typeof bot.highrise.send_whisper === 'function') {
                try {
                    console.log(`[5] bot.highrise.send_whisper...`);
                    await bot.highrise.send_whisper(userId, `/emote ${dance.id}`);
                    console.log(`[5] ✅ SUCCESS`);
                } catch (e) { console.log(`[5] ❌ ${e.message}`); }
            }

            await delay(500);

            // ═══ الطريقة 6: bot.room.emote ═══
            if (bot.room && typeof bot.room.emote === 'function') {
                try {
                    console.log(`[6] bot.room.emote(userId, emoteId)...`);
                    await bot.room.emote(userId, dance.id);
                    console.log(`[6] ✅ SUCCESS`);
                } catch (e) { console.log(`[6] ❌ ${e.message}`); }
            }

            console.log(`═══════════════════════════════`);

            await bot.message.send(`💃 جربت كل الطرق لـ: ${dance.id}\nشوف Console!`);
            return;
        }

        // ═══ !يوزر ═══
        if (lower.startsWith('!user') || lower.startsWith('!معلومات') || lower.startsWith('!يوزر')) {
            try {
                let target = text.replace(/^!user/i, '').replace(/^!معلومات/, '').replace(/^!يوزر/, '').trim().replace('@', '').trim();
                if (!target) target = username;
                await delay(500);
                await bot.message.send(`🔍 البحث عن ${target}...`);
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

        // ═══ ردود ═══
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

const { Highrise } = require('highrise.bot');
const bot = new Highrise();

// دالة استخراج النص من الرسالة
function getText(message) {
    if (typeof message === 'string') return message.trim();
    if (message && typeof message === 'object') {
        // جرّب كل الأسماء المحتملة
        return String(
            message.message || 
            message.content || 
            message.text || 
            message.body || 
            message.msg ||
            ''
        ).trim();
    }
    return '';
}

// عند الاتصال
bot.once('Ready', () => {
    console.log('✅ Bot Connected');
});

// ترحيب
bot.on('UserJoined', async (user) => {
    console.log(`👤 Join: ${user.username}`);
    try {
        await bot.message.send(`أهلاً ${user.username}`);
    } catch (e) {
        console.log('Error:', e.message);
    }
});

// استقبال الرسائل
bot.on('Chat', async (user, message) => {
    try {
        const username = user.username || 'User';
        const text = getText(message);
        const lower = text.toLowerCase();

        console.log(`📨 ${username}: "${text}"`);

        // !test
        if (lower === '!test') {
            await bot.message.send('OK');
            console.log('✅ test');
            return;
        }

        // !help
        if (lower === '!help') {
            await bot.message.send('!1 !2 !3 !4 !5 !6 !7');
            console.log('✅ help');
            return;
        }

        // !1 نرد
        if (lower === '!1') {
            const n = Math.floor(Math.random() * 6) + 1;
            await bot.message.send(`Dice: ${n}`);
            console.log('✅ 1');
            return;
        }

        // !2 عملة
        if (lower === '!2') {
            const r = Math.random() < 0.5 ? 'Heads' : 'Tails';
            await bot.message.send(`Coin: ${r}`);
            console.log('✅ 2');
            return;
        }

        // !6 نكتة
        if (lower === '!6') {
            await bot.message.send('Haha :)');
            console.log('✅ 6');
            return;
        }

        // !3 حجر ورقة مقص
        if (lower === '!3') {
            await bot.message.send('Write: 1=Rock 2=Paper 3=Scissors');
            console.log('✅ 3');
            return;
        }

        // !4 خمن
        if (lower === '!4') {
            const n = Math.floor(Math.random() * 50) + 1;
            await bot.message.send(`Guess 1-50! Answer: ${n}`);
            console.log('✅ 4');
            return;
        }

        // ردود تلقائية
        if (['هلا', 'مرحبا', 'سلام'].includes(text)) {
            await bot.message.send(`أهلاً ${username}!`);
            return;
        }

    } catch (e) {
        console.log('❌ ERROR:', e.message);
    }
});

bot.login(process.env.HIGHRISE_TOKEN, process.env.HIGHRISE_ROOM_ID);
console.log('🚀 Bot Starting...');

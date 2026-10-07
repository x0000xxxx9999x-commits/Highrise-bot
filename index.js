const { Highrise } = require('highrise.bot');
const bot = new Highrise();

// عند الاتصال
bot.once('Ready', () => {
    console.log('✅ البوت متصل!');
});

// ترحيب
bot.on('UserJoined', async (user) => {
    console.log('👤 دخل:', user.username);
    try {
        await bot.message.send(`أهلاً ${user.username}`);
    } catch (e) {
        console.log('خطأ:', e.message);
    }
});

// استقبال الرسائل - نسخة بسيطة
bot.on('Chat', async (user, message) => {
    try {
        const text = String(message).trim();
        const username = user.username;
        
        // LOG مهم - يسجل كل شي
        console.log('╔══════════════════════════');
        console.log('║ 👤 User:', username);
        console.log('║ 💬 Text:', text);
        console.log('║ 📏 Length:', text.length);
        console.log('╚══════════════════════════');

        // رد بسيط (بدون سطور، بدون إيموجيات معقدة)
        if (text === '!test') {
            await bot.message.send('OK');
            console.log('✅ رد');
            return;
        }

        if (text === '!help') {
            await bot.message.send('Commands: !1 !2 !3 !4 !5 !6 !7');
            console.log('✅ help sent');
            return;
        }

        if (text === '!1') {
            const n = Math.floor(Math.random() * 6) + 1;
            await bot.message.send(`Dice: ${n}`);
            console.log('✅ dice sent');
            return;
        }

        if (text === '!2') {
            const r = Math.random() < 0.5 ? 'Heads' : 'Tails';
            await bot.message.send(`Coin: ${r}`);
            console.log('✅ coin sent');
            return;
        }

        if (text === '!6') {
            await bot.message.send('Haha funny joke :)');
            console.log('✅ joke sent');
            return;
        }

    } catch (e) {
        console.log('❌ ERROR:', e.message);
    }
});

bot.login(process.env.HIGHRISE_TOKEN, process.env.HIGHRISE_ROOM_ID);
console.log('🚀 Starting bot...');

const { Highrise } = require('highrise.bot');

const bot = new Highrise();

// ============ عند الاتصال ============
bot.once('ready', (session) => {
    console.log('✅ البوت متصل!');
    console.log('📋 معلومات الجلسة:', JSON.stringify(session, null, 2));
});

// ============ ترحيب بالأعضاء الجدد ============
bot.on('userJoin', async (user) => {
    console.log('👤 دخل:', user.username);
    try {
        await bot.message.send(`مرحباً بك @${user.username} في غرفة BLACK MARKET! 🕶️`);
    } catch (e) {
        console.log('خطأ بالترحيب:', e);
    }
});

// ============ تجربة كل الأسماء المحتملة للحدث ============
const possibleEvents = [
    'Chat',
    'chat',
    'ChatMessageCreate',
    'chatMessageCreate',
    'ChatMessage',
    'chatMessage',
    'messageCreate',
    'MessageCreate',
    'message',
    'Message',
    'onChat',
    'onMessage'
];

possibleEvents.forEach(eventName => {
    try {
        bot.on(eventName, async (...args) => {
            console.log(`🔥 حدث: "${eventName}"`);
            console.log('  Args:', JSON.stringify(args, null, 2));

            // محاولة الرد
            let user = null;
            let message = null;

            if (args.length >= 2) {
                user = args[0];
                message = args[1];
            } else if (args.length === 1) {
                message = args[0];
                user = args[0].user || args[0].sender || null;
            }

            if (message && user) {
                const text = typeof message === 'string' ? message : (message.content || message.text || '');
                const username = user.username || user.name || 'User';

                if (text.toLowerCase() === '!test') {
                    await bot.message.send(`✅ اشتغل! أهلاً @${username}`);
                }
            }
        });
    } catch (e) {
        // تجاهل الأحداث غير الموجودة
    }
});

// ============ تسجيل الدخول ============
bot.login(process.env.HIGHRISE_TOKEN, process.env.HIGHRISE_ROOM_ID);

// ============ رسالة عند البدء ============
console.log('🚀 جاري تشغيل البوت...');
console.log('📡 الأحداث المسجلة:');
possibleEvents.forEach(e => console.log(`   - ${e}`));

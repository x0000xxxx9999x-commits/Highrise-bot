const { Highrise } = require('highrise.bot');

const bot = new Highrise();

// ============ بيانات عشوائية ============
const welcomeMessages = [
    "مرحباً بك @{user} في الغرفة! 🎉",
    "نورت الغرفة يا @{user}! ✨",
    "أهلاً وسهلاً بـ @{user}! 🌟",
    "يا هلا بـ @{user}! 💫",
    "منورنا @{user}! 🔥",
    "أهلاً بك يا @{user} في أحلى غرفة! 😎",
    "حياك الله @{user}! 🤍",
    "يسعدنا وجودك @{user}! 💚",
    "يا مرحب بـ @{user}! 🌹",
    "أهلاً بالغالي @{user}! 💐"
];

const jokes = [
    "واحد دخل المطعم قال للويتر: عندكم دجاج مشوي؟ قال: لا. قال: طيب سمك؟ قال: لا. قال: شنو عندكم؟ قال: ما عندنا شي! قال: ليش المطعم مفتوح؟ قال: عشان نخبر الناس! 😂",
    "واحد راح للدكتور قال: كل ما أشرب شاي أحس بألم في عيني! قال الدكتور: جرب تشيل الملعقة من الكوب! 😂",
    "سألوا واحد: ليش تمشي ورا البنت؟ قال: من زود الأدب! 😂",
    "واحد قال لصاحبه: أمس حلمت إني شربت بحر! قال: شلون؟ قال: بسرعة! 😂",
    "واحد سأل صاحبه: عندك ساعة؟ قال: عندي، بس ما أعرف الوقت! 😂",
    "واحد ركب تكسي قال للسواق: عادل، حاسب السواق! قال السواق: إنت اللي لازم تحاسب! 😂",
    "واحد دخل الحمام مكتوب على الباب: ممنوع الدخول! قال: طيب ليش مكتوب؟ 😂",
    "واحد قال لأمه: ماما، أنا أحب البطاطا! قالت: طيب. قال: بس أنا ما أحبها مطبوخة ولا مشوية ولا مقلية! قالت: شلون تحبها؟ قال: أحبها نية! 😂"
];

const compliments = [
    "@{user}، إنت أحلى واحد في الغرفة! 🌹",
    "@{user}، إنت أسطورة! 🔥",
    "@{user}، وجودك ينور الغرفة! ✨",
    "@{user}، إنت الأفضل! 💯",
    "@{user}، ربنا يحميك، إنت إنسان رائع! 🤍",
    "@{user}، إنت منور الغرفة! 💡",
    "@{user}، يا طيب الأصل والمنبع! 🌟"
];

const fortunes = [
    "🔮 حظك اليوم: ممتاز! يومك سيكون رائعاً! 🌟",
    "🔮 حظك اليوم: جيد جداً! توقع أخبار حلوة. ⭐",
    "🔮 حظك اليوم: متوسط! خليك هادئ. 🌙",
    "🔮 حظك اليوم: حظك حلو! استمتع بيومك. ☀️",
    "🔮 حظك اليوم: رائع! لا تفوت الفرص. 🌈",
    "🔮 حظك اليوم: غريب! توقع المفاجآت. 💫",
    "🔮 حظك اليوم: ممتاز للأعمال! ابدأ مشروع جديد. 💼",
    "🔮 حظك اليوم: حظك بالحب عالي! ❤️"
];

const riddles = [
    "🧩 شي يمشي وما عنده رجلين، شنو هو؟\n**الجواب: الماء**",
    "🧩 شي كل ما أخذت منه كبر، شنو هو؟\n**الجواب: الحفرة**",
    "🧩 شي يكتب ولا يقرأ، شنو هو؟\n**الجواب: القلم**",
    "🧩 عنده أسنان وما يعض، شنو هو؟\n**الجواب: المشط**",
    "🧩 يدخل الماء ولا يبتل، شنو هو؟\n**الجواب: الضوء**",
    "🧩 بيت ما فيه أبواب ولا نوافذ، شنو هو؟\n**الجواب: بيت الشعر**",
    "🧩 كلما زاد نقص، شنو هو؟\n**الجواب: العمر**"
];

const wisdom = [
    "💡 من جد وجد، ومن زرع حصد.",
    "💡 الصبر مفتاح الفرج.",
    "💡 الوقت كالسيف إن لم تقطعه قطعك.",
    "💡 من سار على الدرب وصل.",
    "💡 رب أخ لك لم تلده أمك.",
    "💡 في التأني السلامة وفي العجلة الندامة.",
    "💡 إذا لم تستحِ فاصنع ما شئت.",
    "💡 خير الكلام ما قل ودل."
];

const questions = [
    "❓ لو عندك قوة خارقة، شنو تختار؟",
    "❓ شنو أكلتك المفضلة؟",
    "❓ لو تسافر أي بلد، وين تروح؟",
    "❓ شنو أحلى شي سويته بحياتك؟",
    "❓ من هو مثلك الأعلى؟",
    "❓ لو ترجع بالزمن، شنو تغير؟",
    "❓ شنو حلمك في الحياة؟",
    "❓ لو تصير مليونير، شنو أول شي تسويه؟"
];

const truths = [
    "🔍 شنو أكثر شي تخاف منه؟",
    "🔍 شنو الشي اللي تخبيه عن أهلك؟",
    "🔍 آخر مرة كذبت، على من؟",
    "🔍 شنو الشي اللي تندم عليه؟",
    "🔍 من هو الشخص اللي تحبه أكثر؟",
    "🔍 شنو أسوأ عادة عندك؟"
];

const dares = [
    "😈 اكتب في الدردشة: أحبكم كلكم! ❤️",
    "😈 سوي رقصة في الغرفة! 💃",
    "😈 قل شي حلو لأول شخص يدخل الغرفة! 🌹",
    "😈 اكتب اسمك بالمقلوب! 🔄",
    "😈 غير لون شعرك! 💇",
    "😈 قلد صوت حيوان! 🐱"
];

const loveMessages = [
    "❤️ نسبة الحب بين @{user1} و @{user2}: **{percent}%**",
    "💕 التوافق بين @{user1} و @{user2}: **{percent}%**",
    "💖 قصة حب @{user1} و @{user2}: **{percent}%**"
];

// ============ دالة مساعدة ============
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ============ عند الاتصال ============
bot.once('Ready', (metadata) => {
    console.log(`✅ البوت متصل! معرف المستخدم: ${metadata.userId}`);
});

// ============ الترحيب بالأعضاء الجدد ============
bot.on('UserJoined', async (user) => {
    console.log(`👤 ${user.username} دخل الغرفة.`);
    const msg = getRandom(welcomeMessages).replace('{user}', user.username);
    await bot.message.send(msg);
});

// ============ الأوامر ============
bot.on('Chat', async (user, message) => {
    const msg = message.trim();
    const args = msg.split(' ');
    const command = args[0].toLowerCase();

    // ===== قائمة المساعدة =====
    if (command === '!مساعدة' || command === '!help') {
        await bot.message.send(
            `📜 **قائمة الأوامر:**\n` +
            `🎉 **ترفيهي:**\n` +
            `!نكتة - نكتة عشوائية\n` +
            `!مدح - مدح عشوائي\n` +
            `!حظ - حظك اليوم\n` +
            `!حكمة - حكمة عشوائية\n` +
            `!لغز - لغز مع الجواب\n` +
            `!تحية - تحية حلوة\n` +
            `!سلام - رد السلام\n\n` +
            `🎲 **ألعاب:**\n` +
            `!نرد - رمي النرد\n` +
            `!رمي - رمي عملة\n` +
            `!قرعة [خيار1 خيار2 ...] - اختيار عشوائي\n` +
            `!عجلة - عجلة الحظ\n` +
            `!سؤال - سؤال عشوائي\n` +
            `!حقيقة - حقيقة\n` +
            `!تحدي - تحدي\n` +
            `!صراحة - حقيقة أو تحدي\n\n` +
            `💕 **رومانسي:**\n` +
            `!قلب @شخص - نسبة الحب\n\n` +
            `ℹ️ **عام:**\n` +
            `!وقت - الساعة الآن\n` +
            `!تاريخ - التاريخ اليوم\n` +
            `!ping - اختبار الاتصال`
        );
    }

    // ===== نكتة =====
    if (command === '!نكتة') {
        await bot.message.send(getRandom(jokes));
    }

    // ===== مدح =====
    if (command === '!مدح') {
        const compliment = getRandom(compliments).replace('{user}', user.username);
        await bot.message.send(compliment);
    }

    // ===== حظ =====
    if (command === '!حظ') {
        await bot.message.send(getRandom(fortunes));
    }

    // ===== حكمة =====
    if (command === '!حكمة') {
        await bot.message.send(getRandom(wisdom));
    }

    // ===== لغز =====
    if (command === '!لغز') {
        await bot.message.send(getRandom(riddles));
    }

    // ===== تحية =====
    if (command === '!تحية') {
        await bot.message.send(`👋 أهلاً بك @${user.username}! كيف حالك اليوم؟`);
    }

    // ===== سلام =====
    if (command === '!سلام') {
        await bot.message.send(`🕊️ وعليكم السلام ورحمة الله @${user.username}!`);
    }

    // ===== نرد =====
    if (command === '!نرد') {
        const result = Math.floor(Math.random() * 6) + 1;
        await bot.message.send(`🎲 @${user.username} رمى النرد وطلع: **${result}**`);
    }

    // ===== رمي عملة =====
    if (command === '!رمي') {
        const result = Math.random() < 0.5 ? "🪙 **صورة** (وجه)" : "🪙 **كتابة** (ظهر)";
        await bot.message.send(`@${user.username} رما العملة وطلع: ${result}`);
    }

    // ===== قرعة =====
    if (command === '!قرعة') {
        const options = args.slice(1);
        if (options.length < 2) {
            await bot.message.send(`❌ الاستخدام: \`!قرعة خيار1 خيار2 خيار3\`\nمثال: \`!قرعة أحمد محمد علي\``);
            return;
        }
        const chosen = getRandom(options);
        await bot.message.send(`🎯 القرعة اختارت: **${chosen}**`);
    }

    // ===== عجلة الحظ =====
    if (command === '!عجلة') {
        const wheel = ["🍀 حظ سعيد!", "💀 حظ سيء!", "⭐ حظ ممتاز!", "🌈 حظ رائع!", "⚡ حظ متوسط", "💎 حظ ماسي!"];
        await bot.message.send(`🎡 @${user.username} لفة العجلة وطلع: ${getRandom(wheel)}`);
    }

    // ===== سؤال =====
    if (command === '!سؤال') {
        await bot.message.send(`${getRandom(questions)}`);
    }

    // ===== حقيقة =====
    if (command === '!حقيقة') {
        await bot.message.send(`${getRandom(truths)}`);
    }

    // ===== تحدي =====
    if (command === '!تحدي') {
        await bot.message.send(`${getRandom(dares)}`);
    }

    // ===== صراحة (حقيقة أو تحدي) =====
    if (command === '!صراحة') {
        const all = [...truths, ...dares];
        await bot.message.send(`${getRandom(all)}`);
    }

    // ===== قلب (نسبة الحب) =====
    if (command === '!قلب') {
        const mention = args[1];
        if (!mention) {
            await bot.message.send(`❌ الاستخدام: \`!قلب @الشخص\``);
            return;
        }
        const percent = Math.floor(Math.random() * 101);
        const target = mention.replace('@', '');
        const template = getRandom(loveMessages);
        await bot.message.send(template.replace('{user1}', user.username).replace('{user2}', target).replace('{percent}', percent));
    }

    // ===== وقت =====
    if (command === '!وقت') {
        const now = new Date();
        const time = now.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });
        await bot.message.send(`🕐 الوقت الآن: **${time}**`);
    }

    // ===== تاريخ =====
    if (command === '!تاريخ') {
        const now = new Date();
        const date = now.toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        await bot.message.send(`📅 التاريخ اليوم: **${date}**`);
    }

    // ===== ping =====
    if (command === '!ping') {
        await bot.message.send(`🏓 Pong! @${user.username}`);
    }

    // ===== ردود تلقائية على التحيات =====
    const greetings = ['هلا', 'مرحبا', 'السلام عليكم', 'سلام', 'اهلا', 'أهلا', 'هاي', 'hi', 'hello'];
    if (greetings.includes(msg.toLowerCase())) {
        await bot.message.send(`👋 أهلاً بك @${user.username}! نورت الغرفة 🌟`);
    }

    // ===== رد على "شكراً" =====
    if (msg.includes('شكرا') || msg.includes('شكراً') || msg.includes('تسلم')) {
        await bot.message.send(`🤍 على الرحب والسعة @${user.username}!`);
    }

    // ===== رد على "كيفك" =====
    if (msg.includes('كيفك') || msg.includes('شلونك') || msg.includes('اخبارك')) {
        await bot.message.send(`😊 بخير دامك موجود @${user.username}!`);
    }
});

// ============ تسجيل الدخول ============
bot.login(process.env.HIGHRISE_TOKEN, process.env.HIGHRISE_ROOM_ID);

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'ТВОЙ_ТОКЕН_БОТА'; // сюда можно подставить напрямую, если хочешь
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'ТВОЙ_CHAT_ID';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// логика Telegram-бота
bot.on('message', (msg) => {
  bot.sendMessage(msg.chat.id, 'Бот работает!');
});

// обработка платежей ЮKassa
app.post("/webhook", async (req, res) => {
  const payment = req.body;

  if (payment.event === "payment.succeeded") {
    const uid = payment.object.metadata?.uid || "не указан";
    const amount = payment.object.amount.value;

    await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      params: {
        chat_id: TELEGRAM_CHAT_ID,
        text: `✅ Оплата прошла!\nUID: ${uid}\nСумма: ${amount} ₽`
      }
    });
  }

  res.sendStatus(200);
});

// корневая страница
app.get("/", (req, res) => {
  res.send("Бот и сервер успешно работают на Railway!");
});

// запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

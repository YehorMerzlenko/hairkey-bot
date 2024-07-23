import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import { GoogleCalendar } from '../calendar';
import { calendar } from '@googleapis/calendar';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not specified in the .env file');
  }

const bot = new TelegramBot(token, { polling: true });


bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привіт! Я ваш бот.');

});


bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (msg.text) {
    console.log(msg.text);

    bot.sendMessage(chatId, msg.text);
  }
});
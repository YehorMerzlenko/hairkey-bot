import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import { GoogleCalendar } from '../calendar';


dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

const calendarId = process.env.CALENDAR_ID;

if (!calendarId) {
    throw new Error('CALENDAR_ID is not specified in the .env file');
}


if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not specified in the .env file');
  }

const bot = new TelegramBot(token, { polling: true });


bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Вітаємо! Оберіть зручний для вас час для стрижки:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '13:00', callback_data: '13:00' },
                ],
                [
                    { text: '14:00', callback_data: '14:00' },
                ],
                [
                    { text: '15:00', callback_data: '15:00' },
                ],
                [
                    { text: '16:00', callback_data: '16:00' },
                ],
            ],
        },
    });
});

bot.on('callback_query', async (query) => {
    const chatId = query.message?.chat.id;
    const selectedTime = query.data;


    bot.sendMessage(chatId!, `Ви обрали ${selectedTime}. Зараз додамо це до календаря.`);

    const event = {
        summary: 'Стрижка',
        start: {
            dateTime: `2024-08-03T${selectedTime}:00+03:00`,
            timeZone: 'Europe/Kyiv',
        },
        end: {
            dateTime: `2024-08-03T${selectedTime}:30+03:00`,
            timeZone: 'Europe/Kyiv',
        },
    };


    try {
        const response = await GoogleCalendar.events.insert({
          calendarId,
          requestBody: event,
        });
        bot.sendMessage(chatId!, `Подія створена: ${response.data.htmlLink}`);
      } catch (err) {
        console.error('Error creating event:', err);
        bot.sendMessage(chatId!, 'Виникла помилка при створенні події.');
      }


});


bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (msg.text) {

    bot.sendMessage(chatId, msg.text);
  }
});
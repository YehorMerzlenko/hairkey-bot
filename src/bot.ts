import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import { GoogleCalendar, listEvents } from '../calendar';

dotenv.config();

export interface Slot {
    eventId: string;
    start: string;
    end: string;
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const calendarId = process.env.CALENDAR_ID;

if (!calendarId) {
    throw new Error('CALENDAR_ID is not specified in the .env file');
}

if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not specified in the .env file');
}

const bot = new TelegramBot(token, { polling: true });
const slots = new Map<number, Slot>();

const sendWelcomeMessage = (chatId: number) => {
    const welcomeMessage = `
Йо, вітаю!

Ось шо робити треба:
1. Натисніть на кнопку "Обрати час для стрижки" та оберіть час для стрижки`;
    bot.sendMessage(chatId, welcomeMessage, {
        reply_markup: {
            keyboard: [
                [{ text: 'Обрати час для стрижки' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
};

const handleChooseTime = async (chatId: number) => {
    const events = await listEvents(calendarId);

    if (events.length === 0) {
        bot.sendMessage(chatId, 'Немає доступного часу для запису.');
        return;
    }

    const availableTimes = events.map((event, index) => {
        if (!event.id || !event.start?.dateTime || !event.end?.dateTime) {
            return null;
        }

        slots.set(index, {
            eventId: event.id,
            start: event.start.dateTime,
            end: event.end.dateTime
        });

        const date = new Date(event.start.dateTime).toLocaleDateString('uk-UA', { weekday: 'short', month: 'long', day: 'numeric' });
        const startTime = new Date(event.start.dateTime).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

        return {
            text: `${date}, ${startTime}`,
            callback_data: `${index}`
        };
    }).filter(time => time !== null);

    bot.sendMessage(chatId, 'Коли тобі зручно?', {
        reply_markup: {
            inline_keyboard: availableTimes.map(time => [time!]),
        },
    });
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    sendWelcomeMessage(chatId);
});

bot.onText(/Обрати час для стрижки/, async (msg) => {
    const chatId = msg.chat.id;
    await handleChooseTime(chatId);
});

bot.on('callback_query', async (query) => {
    const chatId = query.message?.chat.id;
    const messageId = query.message?.message_id;
    const index = parseInt(query.data!);

    const slot = slots.get(index);

    if (!slot) {
        bot.sendMessage(chatId!, 'Невірний вибір. Спробуйте знову.');
        return;
    }

    const { eventId, start, end } = slot;
    const username = query.from.username || query.from.first_name;

    const updatedEvent = {
        summary: `записаний ${username}`,
        start: {
            dateTime: start,
            timeZone: 'Europe/Kyiv',
        },
        end: {
            dateTime: end,
            timeZone: 'Europe/Kyiv',
        },
        colorId: '2',
    };

    try {
        const response = await GoogleCalendar.events.patch({
            calendarId,
            eventId,
            requestBody: updatedEvent,
        });

        const startDate = new Date(response.data.start?.dateTime!);
        const startTimeString = startDate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
        const dateString = startDate.toLocaleDateString('uk-UA', { weekday: 'long', month: 'long', day: 'numeric' });

        await bot.editMessageText(`Записаний на ${dateString} ${startTimeString}`, { chat_id: chatId, message_id: messageId });
    } catch (err) {
        console.error('Error updating event:', err);
        bot.sendMessage(chatId!, 'Виникла помилка при бронюванні.');
    }

    bot.answerCallbackQuery(query.id);
});

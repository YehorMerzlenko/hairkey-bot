# Telegram Bot for Haircut Appointments

This Telegram bot allows users to schedule haircut appointments. The bot interacts with the Google Calendar API to fetch available time slots and update events.

## Features

- Fetch available time slots from Google Calendar
- Allow users to choose a time slot for their appointment
- Update the chosen time slot in Google Calendar
- Simple and interactive user interface

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm.
- You have a Google account and have enabled the Google Calendar API.
- You have created a Telegram bot and obtained the bot token.

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/YehorMerzlenko/hairkey-bot.git
    cd hairkey-bot
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:

    ```env
    TELEGRAM_BOT_TOKEN=your-telegram-bot-token
    CALENDAR_ID=your-calendar-id
    ```

## Usage

1. Start the bot:

    ```sh
    npm run dev
    ```

2. Open Telegram and find your bot by its username. Start a conversation and use the command `/start` to interact with the bot.

## Project Structure

- `src/bot.ts`: Main bot logic.
- `src/calendar.ts`: Functions to interact with Google Calendar API.
- `src/auth.ts`: Google API authentication setup.


## Commands

- `/start`: Start interacting with the bot and see the welcome message.
- `Oбрати час для стрижки`: Choose a time slot for your appointment.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Google Calendar API](https://developers.google.com/calendar)


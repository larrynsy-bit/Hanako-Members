from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from aiogram.filters import CommandStart
from aiogram.types import (
    Message,
    ReplyKeyboardMarkup,
    KeyboardButton,
    WebAppInfo
)

import asyncio

from config import BOT_TOKEN, WEBAPP_URL

bot = Bot(
    token=BOT_TOKEN,
    default=DefaultBotProperties(
        parse_mode=ParseMode.HTML
    )
)

dp = Dispatcher()

keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [
            KeyboardButton(
                text="🚀 Открыть приложение",
                web_app=WebAppInfo(
                    url=WEBAPP_URL
                )
            )
        ]
    ],
    resize_keyboard=True
)

@dp.message(CommandStart())
async def start(message: Message):

    await message.answer(
        "<b>Добро пожаловать!</b>\n\n"
        "Нажмите кнопку ниже, чтобы открыть приложение.",
        reply_markup=keyboard
    )

async def main():

    print("Бот запущен!")

    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
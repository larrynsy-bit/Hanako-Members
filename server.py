from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from config import ADMIN_ID
from database import db


app = FastAPI(title="TikTok Mini App")


templates = Jinja2Templates(directory="templates")


app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)



# ==========================
# Главная страница
# ==========================

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request
        }
    )



# ==========================
# Добавление пользователя
# ==========================

@app.post("/api/register")
async def register(data: dict):


    telegram_id = data.get("telegram_id")


    if telegram_id != ADMIN_ID:

        return JSONResponse({
            "success": False,
            "error": "Access denied"
        })


    username = data.get("username", "")
    first_name = data.get("first_name", "")
    last_name = data.get("last_name", "")

    tiktok = data.get("tiktok", "")
    tiktok_url = data.get("tiktok_url", "")

    avatar = data.get(
        "avatar",
        ""
    )


    db.add_user(
        telegram_id,
        username,
        first_name,
        last_name,
        tiktok,
        tiktok_url,
        avatar
    )


    return JSONResponse({

        "success": True,

        "message":
        "Пользователь добавлен"

    })



# ==========================
# Получение пользователей
# ==========================

@app.get("/api/users")
async def users(admin_id:int):


    if admin_id != ADMIN_ID:

        return JSONResponse({

            "success":False,
            "error":"Access denied"

        })


    return JSONResponse(
        db.get_all_users()
    )




# ==========================
# Количество участников
# ==========================

@app.get("/api/count")
async def count():

    return {

        "count":
        db.count()

    }




# ==========================
# Удаление
# ==========================

@app.post("/api/delete")
async def delete(data:dict):


    if data.get("admin_id") != ADMIN_ID:

        return JSONResponse({

            "success":False,
            "error":"Access denied"

        })


    user_id = data.get(
        "telegram_id"
    )


    db.delete(user_id)


    return {

        "success":True

    }





# ==========================
# Поиск
# ==========================

@app.get("/api/search")
async def search(
    admin_id:int,
    text:str
):


    if admin_id != ADMIN_ID:

        return JSONResponse({

            "success":False

        })


    return JSONResponse(

        db.search(text)

    )
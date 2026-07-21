from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from config import ADMIN_ID
from database import db


app = FastAPI(
    title="TikTok Members"
)


templates = Jinja2Templates(
    directory="templates"
)


app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)



# =========================
# Главная
# =========================

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request
        }
    )



# =========================
# Проверка админа
# =========================

def check_admin(user_id):

    try:
        return int(user_id) == int(ADMIN_ID)

    except:

        return False



# =========================
# Добавление участника
# =========================

@app.post("/api/register")
async def register(data: dict):


    telegram_id = data.get(
        "telegram_id"
    )


    if not check_admin(telegram_id):

        return JSONResponse({

            "success":False,
            "error":"Access denied"

        })



    db.add_user(

        telegram_id,

        data.get(
            "username",
            ""
        ),

        data.get(
            "first_name",
            ""
        ),

        data.get(
            "last_name",
            ""
        ),


        data.get(
            "tiktok",
            ""
        ),


        data.get(
            "tiktok_url",
            ""
        ),


        data.get(
            "avatar",
            ""

        )

    )


    return {

        "success":True,

        "message":
        "Добавлено"

    }





# =========================
# Все пользователи
# =========================

@app.get("/api/users")
async def users(admin_id:int):


    if not check_admin(admin_id):

        return JSONResponse({

            "success":False,
            "error":"Access denied"

        })


    return {

        "success":True,

        "users":
        db.get_all_users()

    }





# =========================
# Количество
# =========================

@app.get("/api/count")
async def count():

    return {

        "count":
        db.count()

    }





# =========================
# Удаление
# =========================

@app.post("/api/delete")
async def delete(data:dict):


    if not check_admin(
        data.get("admin_id")
    ):

        return {

            "success":False,

            "error":
            "Access denied"

        }



    db.delete(
        data.get(
            "telegram_id"
        )
    )


    return {

        "success":True

    }





# =========================
# Поиск
# =========================

@app.get("/api/search")
async def search(
    admin_id:int,
    text:str
):


    if not check_admin(admin_id):

        return {

            "success":False

        }



    return {

        "success":True,

        "users":
        db.search(text)

    }
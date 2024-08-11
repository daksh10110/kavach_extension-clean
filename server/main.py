from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2 import sql

from models.text import toxicity_predictor

from models.images.predict import predict_url,predict_base64_image
from models.images.video import perdict_video
from models.audio.audio_predictor import predict_audio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Image(BaseModel):
    url: str
    raw: bool
    dir: bool
    hostname: str
    page_url: str

class Content(BaseModel):
    content: str

class Multimedia(BaseModel):
    url: str

# Initialize the SQLite database and create tables for images and videos
conn = psycopg2.connect(
    host="localhost",  # Use the service name defined in Docker Compose
    port=5432,
    user="your_username",  # Replace with your PostgreSQL username
    password="your_password",  # Replace with your PostgreSQL password
    dbname="your_database_name",  # Replace with your PostgreSQL database name
)


cursor = conn.cursor()
create_table_query = '''
    CREATE TABLE IF NOT EXISTS images (
        url VARCHAR NOT NULL,
        raw BOOL,
        dir BOOL,
        hostname VARCHAR,
        result BOOL
    )
'''

cursor.execute(create_table_query)
conn.commit()

@app.get("/")
async def root():
    return { "message": "Hello World" }

@app.post("/process_image")
async def process_image(image: Image):
    print(image)
    
    # Check if the source exists in the database and the result is true
    select_query = sql.SQL("SELECT result FROM images WHERE url = {}").format(sql.Literal(image.url))

    cursor.execute(select_query)
    query_result = cursor.fetchone()

    if query_result:
        print(query_result[0], "searched")
        blur = query_result[0]

        return {
            "blur": bool(blur),
            "url": image.url,
            "pre": True
        }

    try:
        if image.raw:
            blur = predict_base64_image(image.url)
            print("raw")
        else:
            print("are: ", image.url)
            if not image.url.startswith(('http://', 'https://')):
                image.url = "https://" + image.hostname + image.url
            blur = predict_url(image.url)
            print("blur? : ", image.url)
            print(blur)
    except Exception as e:
        print(e)
        blur = True

    # Insert the data into the database
    insert_query = '''
        INSERT INTO images (url, raw, dir, hostname, result) 
        VALUES (%s, %s, %s, %s, %s)
    '''

    values = (image.url, image.raw, image.dir, image.hostname, blur)

    try:
        cursor.execute(insert_query, values)
        if cursor.rowcount > 0:
            print("INSERT successful")
        else:
            print("INSERT failed")
    except Exception as e:
        print(e)
        blur = True

    conn.commit()

    return { "blur": blur, "url": image.url, "pre": False }

@app.post("/process_text")
async def process_text(content: Content):
    txt = content.content
    toxicity = toxicity_predictor.predict_txt(txt)
    if (toxicity[0] or toxicity[2]):
        print(txt)
    return { "toxic": bool(toxicity[0] or toxicity[2]), "message": "The text contains toxic content" };

@app.post("/process_video")
async def process_video(video: Multimedia):
    url = video.url
    print(video.url+"  server recieved")
    blur = perdict_video(video.url)
    print("processed",blur)
    return { "hide": blur, "url": url }

@app.post("/process_audio")
async def process_audio(audio: Multimedia):
    url = audio.url
    result = predict_audio(url)
    return { "obscene": result }

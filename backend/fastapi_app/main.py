from fastapi import FastAPI, Depends, HTTPException
from passlib.context import CryptContext
import uvicorn

app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.post("/hash-password")
def hash_password(password: str):
    return {"hashed_password": pwd_context.hash(password)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)

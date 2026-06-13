from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random
import httpx
from pydantic import BaseModel
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⚠️ IMPORTANT: When deploying to Render, change localhost:8000 to your live CRM API URL!
CRM_WEBHOOK_URL = os.getenv("CRM_BACKEND_URL", "http://localhost:8000/api/webhooks/delivery-receipt")

class MessagePayload(BaseModel):
    message_id: str
    recipient: str
    content: str
    channel: str

async def simulate_delivery_lifecycle(message_id: str):
    # 1. Simulate network delay (2 to 5 seconds)
    await asyncio.sleep(random.uniform(2.0, 5.0))
    
    # 2. Determine initial delivery outcome (80% success)
    is_delivered = random.choice([True, True, True, True, False]) 
    status = "DELIVERED" if is_delivered else "FAILED"
    
    # 3. Send receipt back to CRM
    async with httpx.AsyncClient() as client:
        try:
            await client.post(CRM_WEBHOOK_URL, json={"message_id": message_id, "status": status})
        except httpx.RequestError:
            pass

    if not is_delivered:
        return 

    # 4. Simulate human reading/clicking delay (5 to 10 seconds)
    await asyncio.sleep(random.uniform(5.0, 10.0))
    
    # 5. Determine engagement outcome
    engagement = random.choices(
        population=["OPENED", "CLICKED", "IGNORED"], 
        weights=[0.5, 0.2, 0.3], 
        k=1
    )[0]

    if engagement != "IGNORED":
        async with httpx.AsyncClient() as client:
            try:
                await client.post(CRM_WEBHOOK_URL, json={"message_id": message_id, "status": engagement})
            except httpx.RequestError:
                pass

@app.post("/api/stub/send")
async def receive_outbound_message(payload: MessagePayload, background_tasks: BackgroundTasks):
    background_tasks.add_task(simulate_delivery_lifecycle, payload.message_id)
    return {"status": "Processing", "message_id": payload.message_id}
import os
import uuid
import httpx
import pandas as pd
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROBUST DATA LOADING ---
# Find directory where this script lives, regardless of where the server runs
base_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(base_dir, 'Online Retail.xlsx')

print(f"Attempting to load dataset from: {csv_path}")

try:
    # Use read_excel for .xlsx files
    raw_df = pd.read_excel(csv_path)
    
    # Standard cleanup
    raw_df = raw_df.dropna(subset=['CustomerID'])
    raw_df['LineTotal'] = raw_df['Quantity'] * raw_df['UnitPrice']
    raw_df['InvoiceDate'] = pd.to_datetime(raw_df['InvoiceDate'])

    customers_df = raw_df.groupby('CustomerID').agg(
        totalSpent=('LineTotal', 'sum'),
        lastOrder=('InvoiceDate', 'max'),
        city=('Country', 'first') 
    ).reset_index()

    customers_df['id'] = customers_df['CustomerID'].astype(int).astype(str)
    customers_df['name'] = "Customer " + customers_df['id'] 
    customers_df['totalSpent'] = customers_df['totalSpent'].round(2)
    customers_df['lastOrder'] = customers_df['lastOrder'].dt.strftime('%Y-%m-%d')
    
    np.random.seed(42) 
    customers_df['opted_in'] = np.random.choice([True, False], size=len(customers_df), p=[0.85, 0.15])
    
    print(f"Successfully indexed {len(customers_df)} unique customers from Excel.")
except Exception as e:
    print(f"Error loading Excel file: {e}. Falling back to empty dataframe.")
    customers_df = pd.DataFrame(columns=["id", "name", "city", "totalSpent", "lastOrder", "opted_in"])

# --- MEMORY TRACKER & MODELS ---
message_tracking = {}

class IntentRequest(BaseModel):
    prompt: str

class WebhookPayload(BaseModel):
    message_id: str
    status: str

class NewCustomer(BaseModel):
    name: str
    city: str
    totalSpent: float
    lastOrder: str

# --- API ENDPOINTS ---

@app.get("/api/customers")
async def get_customers():
    export_cols = customers_df[['id', 'name', 'city', 'totalSpent', 'lastOrder']]
    return export_cols.to_dict(orient="records")

@app.post("/api/customers")
async def add_customer(customer: NewCustomer):
    global customers_df
    new_id = str(len(customers_df) + 999000)
    new_row = pd.DataFrame([{
        "id": new_id, "name": customer.name, "city": customer.city,
        "totalSpent": customer.totalSpent, "lastOrder": customer.lastOrder, "opted_in": True
    }])
    customers_df = pd.concat([customers_df, new_row], ignore_index=True)
    return {"status": "success", "id": new_id}

@app.post("/api/ai-intent")
async def process_intent(request: IntentRequest):
    prompt_lower = request.prompt.lower()
    segment = customers_df[customers_df["opted_in"] == True]
    
    if "vip" in prompt_lower or "high" in prompt_lower:
        segment = segment[segment["totalSpent"] > 2000]
    elif "uk" in prompt_lower or "united kingdom" in prompt_lower:
        segment = segment[segment["city"] == "United Kingdom"]
    
    segment = segment.head(50)
    audience_count = len(segment)
    
    if audience_count == 0:
        return {"reply": "I couldn't find any opted-in users matching that criteria."}

    # Use SIMULATOR_URL from environment variables (Render/Vercel)
    simulator_url = os.environ.get("SIMULATOR_URL", "http://localhost:8001")

    async with httpx.AsyncClient() as client:
        for _, user in segment.iterrows():
            msg_id = str(uuid.uuid4())
            message_tracking[msg_id] = "DISPATCHED" 
            try:
                await client.post(f"{simulator_url}/api/stub/send", json={
                    "message_id": msg_id,
                    "recipient": user["id"],
                    "content": "Exclusive offer inside!",
                    "channel": "WhatsApp"
                })
            except httpx.RequestError:
                message_tracking[msg_id] = "FAILED"
                print(f"Failed to reach simulator at {simulator_url}")

    return {"reply": f"Found {audience_count} targeted shoppers. Campaign dispatched."}

@app.post("/api/webhooks/delivery-receipt")
async def receive_receipt(payload: WebhookPayload):
    message_tracking[payload.message_id] = payload.status
    return {"status": "success", "recorded": True}

@app.get("/api/stats")
async def get_live_stats():
    stats = {"dispatched": 0, "delivered": 0, "opened": 0}
    stats["dispatched"] = len(message_tracking)
    for status in message_tracking.values():
        if status in ["DELIVERED", "OPENED", "CLICKED"]:
            stats["delivered"] += 1
        if status in ["OPENED", "CLICKED"]:
            stats["opened"] += 1
    return stats
@app.get("/")
async def root():
    return {"status": "online", "message": "Xeno AI CRM Backend is operational"}
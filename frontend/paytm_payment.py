# paytm_payment.py
from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
import hashlib, hmac

app = FastAPI()

# -----------------------------
# 🔹 Your Paytm Merchant Details
# -----------------------------
MID = "paytmqr5kpeef@ptys"       # e.g. Rx1234567890123456
MKEY = "YOUR_MERCHANT_KEY"     # e.g. a long secret key
WEBSITE = "DEFAULT"            # for production (use WEBSTAGING for test)
INDUSTRY_TYPE_ID = "Retail"
CHANNEL_ID = "WEB"
CALLBACK_URL = "https://smartmed.infinityfreeapp.com/payment-success"  # your hosted success endpoint

# -----------------------------
# 🔹 Generate Checksum (HMAC-SHA256)
# -----------------------------
def generate_checksum(params: dict, merchant_key: str):
    params_string = "&".join(f"{k}={v}" for k, v in sorted(params.items()))
    return hmac.new(merchant_key.encode(), params_string.encode(), hashlib.sha256).hexdigest()

# -----------------------------
# 🔹 Create Paytm Order Endpoint
# -----------------------------
@app.post("/create-order")
async def create_order(amount: float = Form(...)):
    """
    This endpoint receives the total amount from your frontend
    and redirects the user to the Paytm Payment Gateway page.
    """
    order_id = "ORDER" + str(abs(hash(amount)))[:10]

    paytm_params = {
        "MID": MID,
        "ORDER_ID": order_id,
        "CUST_ID": "CUST001",     # You can generate per-user IDs if needed
        "TXN_AMOUNT": str(amount),
        "CHANNEL_ID": CHANNEL_ID,
        "WEBSITE": WEBSITE,
        "INDUSTRY_TYPE_ID": INDUSTRY_TYPE_ID,
        "CALLBACK_URL": CALLBACK_URL,
    }

    # Generate checksum to secure parameters
    checksum = generate_checksum(paytm_params, MKEY)
    paytm_params["CHECKSUMHASH"] = checksum

    # For LIVE transactions:
    paytm_url = "https://securegw.paytm.in/theia/processTransaction"

    # For testing (sandbox):
    # paytm_url = "https://securegw-stage.paytm.in/theia/processTransaction"

    # Build auto-submit HTML form
    html_form = f"""
    <html>
      <body onload="document.forms[0].submit()">
        <form method="post" action="{paytm_url}">
          {''.join([f'<input type="hidden" name="{k}" value="{v}"/>' for k, v in paytm_params.items()])}
        </form>
      </body>
    </html>
    """
    return HTMLResponse(content=html_form)

# -----------------------------
# 🔹 Callback Verification (optional but recommended)
# -----------------------------
@app.post("/payment-success")
async def payment_success(response: dict = Form(...)):
    """
    Paytm will send a POST request here after payment.
    You can verify the checksum again and store success in your DB.
    """
    print("🔹 Payment Callback Received:", response)
    return HTMLResponse("<h2>✅ Payment successful! Thank you for your purchase.</h2>")

from fastapi import FastAPI, Depends, HTTPException
from fatturafacile_sdk import FatturaFacileClient, FatturaFacileError
import os

app = FastAPI(title="Fattura Facile FastAPI Bridge")

def get_client() -> FatturaFacileClient:
    return FatturaFacileClient(
        api_key=os.getenv("FATTURAFACILE_API_KEY", "ff_live_sample"),
        tenant_id=os.getenv("FATTURAFACILE_TENANT_ID", "a0000000-0000-0000-0000-000000000001"),
    )

@app.get("/api/erp/invoices")
def list_invoices(client: FatturaFacileClient = Depends(get_client)):
    try:
        return client.request("GET", "/v1/invoices?limit=25")
    except FatturaFacileError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.problem)

@app.post("/api/erp/invoices/{invoice_id}/transmit")
def transmit_sdi(invoice_id: str, client: FatturaFacileClient = Depends(get_client)):
    try:
        return client.request("POST", f"/v1/invoices/{invoice_id}/sdi/transmit")
    except FatturaFacileError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.problem)

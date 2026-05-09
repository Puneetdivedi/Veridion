import os
import json
import random

def generate_mock_satellite_data(company_name: str):
    data = {
        "company": company_name,
        "region": "Global-South",
        "observations": [
            {"date": "2026-01-01", "co2_level": random.uniform(350, 450), "methane": random.uniform(1.5, 2.5)},
            {"date": "2026-02-01", "co2_level": random.uniform(350, 450), "methane": random.uniform(1.5, 2.5)},
            {"date": "2026-03-01", "co2_level": random.uniform(350, 450), "methane": random.uniform(1.5, 2.5)},
        ],
        "compliance_status": "Observation Phase"
    }
    os.makedirs("c:/Users/ADMIN/Desktop/Veridion/data/satellite", exist_ok=True)
    with open(f"c:/Users/ADMIN/Desktop/Veridion/data/satellite/{company_name}_obs.json", "w") as f:
        json.dump(data, f, indent=4)
    print(f"Generated satellite mock data for {company_name}")

def generate_mock_invoices(company_name: str):
    invoices = [
        {"invoice_id": "INV-001", "vendor": "GreenPower Co", "amount": 5000, "energy_type": "Wind", "kwh": 2500},
        {"invoice_id": "INV-002", "vendor": "SolarGrid", "amount": 3200, "energy_type": "Solar", "kwh": 1800},
        {"invoice_id": "INV-003", "vendor": "LogisticsX", "amount": 12000, "energy_type": "Diesel", "kwh": 0, "fuel_liters": 1500},
    ]
    os.makedirs("c:/Users/ADMIN/Desktop/Veridion/data/invoices", exist_ok=True)
    with open(f"c:/Users/ADMIN/Desktop/Veridion/data/invoices/{company_name}_invoices.json", "w") as f:
        json.dump(invoices, f, indent=4)
    print(f"Generated invoice mock data for {company_name}")

if __name__ == "__main__":
    test_company = "EcoLogic_Corp"
    generate_mock_satellite_data(test_company)
    generate_mock_invoices(test_company)

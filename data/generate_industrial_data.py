import os
import json
import random

def generate_industrial_dataset():
    base_path = "c:/Users/ADMIN/Desktop/Veridion/data"
    os.makedirs(f"{base_path}/satellite", exist_ok=True)
    os.makedirs(f"{base_path}/invoices", exist_ok=True)
    os.makedirs(f"{base_path}/suppliers", exist_ok=True)

    companies = [
        {"name": "Veridion_Global", "type": "Parent"},
        {"name": "EcoLogic_Corp", "type": "Manufacturing"},
        {"name": "BioGrid_Energy", "type": "Supplier"},
        {"name": "Titan_Logistics", "type": "Logistics"},
        {"name": "RareEarth_Mining", "type": "Raw Material"}
    ]

    # Supply Chain Map
    supply_chain = {
        "Veridion_Global": ["EcoLogic_Corp", "Titan_Logistics"],
        "EcoLogic_Corp": ["BioGrid_Energy", "RareEarth_Mining"],
        "BioGrid_Energy": [],
        "Titan_Logistics": [],
        "RareEarth_Mining": []
    }

    with open(f"{base_path}/supply_chain_map.json", "w") as f:
        json.dump(supply_chain, f, indent=4)

    for comp in companies:
        name = comp["name"]
        
        # Satellite Data
        sat_data = {
            "company": name,
            "metrics": {
                "co2_emissions": random.uniform(10, 500),
                "methane_leakage": random.uniform(0.1, 5.0),
                "deforestation_index": random.uniform(0, 1)
            },
            "history": [
                {"date": "2026-01-01", "value": random.uniform(100, 200)},
                {"date": "2026-02-01", "value": random.uniform(90, 180)},
                {"date": "2026-03-01", "value": random.uniform(80, 160)}
            ]
        }
        with open(f"{base_path}/satellite/{name}_obs.json", "w") as f:
            json.dump(sat_data, f, indent=4)

        # Sustainability Report (RAG Source)
        report = f"""
        Sustainability Report 2026: {name}
        Our commitment to the planet is paramount. 
        In 2026, we achieved a {random.randint(70, 95)}% renewable energy mix across our global operations.
        We have implemented carbon capture technology at our {comp['type']} facilities.
        Our total scope 1 emissions were {sat_data['metrics']['co2_emissions']:.1f} metric tons.
        We strictly follow ethical sourcing guidelines for all {comp.get('type', 'Standard')} materials.
        """
        os.makedirs(f"{base_path}/reports", exist_ok=True)
        with open(f"{base_path}/reports/{name}_report.txt", "w") as f:
            f.write(report)

    print("Industrial ESG dataset and RAG sources generated successfully.")

if __name__ == "__main__":
    generate_industrial_dataset()

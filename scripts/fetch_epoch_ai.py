#!/usr/bin/env python3

import csv
import json

# import requests
from pathlib import Path
from urllib import request

_URL = "https://epochai.org/data/epochdb/all_systems.csv"
_OUTPUT_PATH = Path("data/epoch_ai.json")

with request.urlopen(_URL) as response:
    csv_text = response.read().decode("utf-8")
data = [row for row in csv.DictReader(csv_text.splitlines())]
_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
with _OUTPUT_PATH.open("w") as file:
    json.dump(
        [
            {
                "name": row["System"],
                "flops": row["Training compute (FLOP)"],
            }
            for row in data
            if row["Task"] == "Language modelling"
        ],
        file,
        indent=4,
    )

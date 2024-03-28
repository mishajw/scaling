#!/usr/bin/env python3

from collections import defaultdict
import csv
from dataclasses import dataclass
import json
from pathlib import Path
from typing import Any, Literal
from urllib import request

Source = Literal["custom", "epoch"]


@dataclass
class FieldValue:
    value: str | int | float
    source: Source
    citation: str


_ID = "19sTVx7gMHhw_tUs2psmUbdJxZzDRw8qNJ3WTasdSfgI"
_SHEET_IDS: dict[Source, str] = {
    "custom": "662000617",
    "epoch": "1990802743",
}
_OUTPUT_PATH = Path("data/all.json")

print("Fetching data from Google Sheets...")
model_data: dict[str, dict[str, FieldValue]] = defaultdict(dict)
for source in _SHEET_IDS.keys():
    url = (
        "https://docs.google.com/spreadsheets/d/"
        f"{_ID}/export?format=csv&gid={_SHEET_IDS[source]}"
    )
    with request.urlopen(url) as response:
        csv_text = response.read().decode("utf-8")
    for row in csv.DictReader(csv_text.splitlines()):
        model_name = row["model_name"]
        field = row["attribute"]
        value = row["value"]
        citation = row["citation"]
        model_data[model_name][field] = FieldValue(value, source, citation)

print("Processing data...")
models = []
for model_name, fields in model_data.items():
    model: dict[str, Any] = {"model_name": model_name, "fields": {}}
    for field_name, field_value in fields.items():
        model["fields"][field_name] = {
            "value": field_value.value,
            "source": field_value.source,
            "citation": field_value.citation,
        }
    models.append(model)

print("Writing data...")
_OUTPUT_PATH.write_text(json.dumps(models, indent=2))

print("Done!")

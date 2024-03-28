#!/usr/bin/env python3

import csv
from dataclasses import asdict, dataclass
from pathlib import Path
from urllib import request


@dataclass
class Attribute:
    attribute: str
    epoch_key: str
    epoch_citation_key: str | None


@dataclass
class OutputRow:
    model_name: str
    attribute: str
    value: str
    citation: str


_URL = "https://epochai.org/data/epochdb/all_systems.csv"
_OUTPUT_PATH = Path("data/epoch_ai.csv")
_NAME_EPOCH_KEY = "System"
_TASK_EPOCH_KEY = "Task"
_ATTRIBUTES = [
    Attribute("flops", "Training compute (FLOP)", "Training compute notes"),
    Attribute("numParams", "Parameters", None),
    Attribute("numTokens", "Training dataset size (datapoints)", "Dataset size notes"),
    Attribute("batchSize", "Batch size", None),
    Attribute("costDollars", "Training compute cost (2020 USD)", "Compute cost notes"),
    # TODO
    Attribute("trainingTimeDays", "Training time (hours)", "Training time notes"),
    Attribute("gpuCount", "Hardware quantity", None),
    Attribute("gpuType", "Training hardware", None),
    Attribute("gpuUtilization", "Hardware utilization", None),
    Attribute("releaseDate", "Publication date", None),
    Attribute("batchSize", "Batch size", "Batch size notes"),
    # Field("sequenceLength", None, None),
    # Field("isOpenWeights", None, None),
]
IGNORE_MODELS = [
    "Deep Multitask NLP Network",
    "RNN for 1B words",
    "Sparse Non-negative Matrix (SNM) estimation",
    "LSTM",
]

print("Fetching data from EpochAI...")
with request.urlopen(_URL) as response:
    csv_text = response.read().decode("utf-8")
data = [row for row in csv.DictReader(csv_text.splitlines())]

print("Processing data...")
output_rows = []
for row in data:
    if (
        row[_NAME_EPOCH_KEY] in IGNORE_MODELS
        or row[_TASK_EPOCH_KEY] != "Language modelling"
    ):
        continue
    for field in _ATTRIBUTES:
        assert field.epoch_key in row, f"Missing key: {field.epoch_key}"
        assert (
            field.epoch_citation_key is None or field.epoch_citation_key in row
        ), f"Missing key: {field.epoch_citation_key}"
        if row[field.epoch_key] == "":
            continue
        output_rows.append(
            OutputRow(
                model_name=row[_NAME_EPOCH_KEY],
                attribute=field.attribute,
                value=row[field.epoch_key],
                citation=(
                    row[field.epoch_citation_key] if field.epoch_citation_key else ""
                ),
            )
        )

print("Writing data to file...")
with open(_OUTPUT_PATH, "w", newline="") as output_f:
    writer = csv.DictWriter(
        output_f,
        fieldnames=["model_name", "attribute", "value", "citation"],
    )
    writer.writeheader()
    writer.writerows([asdict(row) for row in output_rows])

print("Done!")

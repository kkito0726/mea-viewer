from flask import request
from model.form_value import FormValue
from lib.plot import showAll
from pyMEA.MEA import MEA


def showAllService() -> str:
    value = FormValue(
        request.json["hed_path"],
        request.json["start"],
        request.json["end"],
        request.json["volt_min"],
        request.json["volt_max"],
        request.json["x_ratio"],
        request.json["y_ratio"],
        request.json["dpi"],
    )
    start = int(value.start - 1)
    if start < 0:
        start = 0
    end = int(value.end + 1)
    data = MEA(value.hed_path, start, end)
    image = showAll(
        data,
        value.start,
        value.end,
        value.volt_min,
        value.volt_max,
        figsize=(value.x_ratio, value.y_ratio),
        dpi=value.dpi,
    )

    return image

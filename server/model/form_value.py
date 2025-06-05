from dataclasses import dataclass


class FormValue:
    def __init__(self, json_data: dict) -> None:
        self.readTime = ReadTime(**json_data["readTime"])
        self.start = float(json_data["start"])
        self.end = float(json_data["end"])
        self.hedValue = HedValue(**json_data["hedValue"])
        self.volt_min = float(json_data["volt_min"])
        self.volt_max = float(json_data["volt_max"])
        if not json_data["x_ratio"]:
            json_data["x_ratio"] = 8
        if not json_data["y_ratio"]:
            json_data["y_ratio"] = 8
        self.x_ratio = int(json_data["x_ratio"])
        self.y_ratio = int(json_data["y_ratio"])
        self.dpi = int(json_data["dpi"])
        self.chs = json_data.get("chs")


@dataclass(frozen=True)
class ReadTime:
    start: int
    end: int


@dataclass(frozen=True)
class HedValue:
    sampling_rate: int
    gain: int

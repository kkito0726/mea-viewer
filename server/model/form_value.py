class FormValue:
    def __init__(self, json_data) -> None:
        self.start = float(json_data["start"])
        self.end = float(json_data["end"])
        self.volt_min = float(json_data["volt_min"])
        self.volt_max = float(json_data["volt_max"])
        if not json_data["x_ratio"]:
            json_data["x_ratio"] = 8
        if not json_data["y_ratio"]:
            json_data["y_ratio"] = 8
        self.x_ratio = int(json_data["x_ratio"])
        self.y_ratio = int(json_data["y_ratio"])
        self.dpi = int(json_data["dpi"])

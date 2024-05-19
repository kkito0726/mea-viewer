class PeakFormValue:
    def __init__(self, json_data) -> None:
        self.isPositive = json_data["peakFormValue"]["isPositive"]
        self.isNegative = json_data["peakFormValue"]["isNegative"]
        self.distance = json_data["peakFormValue"]["distance"]
        self.threshold = json_data["peakFormValue"]["threshold"]

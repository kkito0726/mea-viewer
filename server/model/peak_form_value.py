class PeakFormValue:
    def __init__(self, json_data) -> None:
        peak_form_value = json_data.get("peakFormValue")
        if peak_form_value:
            self.isPositive = peak_form_value.get("isPositive")
            self.isNegative = peak_form_value.get("isNegative")
            self.distance = peak_form_value.get("distance")
            self.threshold = peak_form_value.get("threshold")
            self.isLoop = peak_form_value.get("isLoop")
            self.base_ch = peak_form_value.get("baseCh")

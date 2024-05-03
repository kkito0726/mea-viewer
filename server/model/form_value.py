class FormValue:
    def __init__(
        self, hed_path, start, end, volt_min, volt_max, x_ratio, y_ratio, dpi
    ) -> None:
        self.hed_path = hed_path
        self.start = float(start)
        self.end = float(end)
        self.volt_min = float(volt_min)
        self.volt_max = float(volt_max)
        if not x_ratio:
            x_ratio = 8
        if not y_ratio:
            y_ratio = 8
        self.x_ratio = int(x_ratio)
        self.y_ratio = int(y_ratio)
        self.dpi = int(dpi)

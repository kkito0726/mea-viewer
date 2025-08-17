class VideoFormValue:
    def __init__(self, json_data: dict):
        video_form_value = json_data.get("videoFormValue")
        if video_form_value:
            self.window_time = video_form_value.get("window_time")
            self.duration = video_form_value.get("duration")

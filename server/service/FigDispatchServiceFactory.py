from enums.FigType import FigType
from model.form_value import FormValue
from model.peak_form_value import PeakFormValue
from model.video_form_value import VideoFormValue
from pyMEA import FigMEA
from service.fig_service import FigService
from service.FigDispatchService import FigDispatchService
from service.FigImageDispatchService import FigImageDispatchService
from service.FigVideoDispatchService import FigVideoDispatchService
from service.video_service import VideoService


class FigDispatchServiceFactory:
    @staticmethod
    def create(
        fm: FigMEA,
        form_value: FormValue,
        peak_form_value: PeakFormValue,
        video_form_value: VideoFormValue,
    ) -> FigDispatchService:
        fig_type = FigType.from_value(form_value.fig_type)
        if fig_type in fig_type.image_fig_type_list:
            fig_service = FigService(fm, form_value, peak_form_value)
            return FigImageDispatchService(fig_service, fig_type)
        else:
            video_service = VideoService(
                fm, form_value, peak_form_value, video_form_value
            )
            return FigVideoDispatchService(video_service, fig_type)

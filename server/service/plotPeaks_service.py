from repository.plotPeaks_repository import PlotPeaksRepository


class PlotPeaksService:
    @staticmethod
    def inserts(chs: list[int], image_urls: list[str], file_name: str):
        return [
            PlotPeaksRepository.save_image(ch, image_url, file_name)
            for ch, image_url in zip(chs, image_urls)
        ]

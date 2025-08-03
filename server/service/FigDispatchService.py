from abc import ABCMeta, abstractmethod

from model.FigImageData import FigImageData


class FigDispatchService(metaclass=ABCMeta):
    @abstractmethod
    def create_fig(self) -> list[FigImageData]:
        pass

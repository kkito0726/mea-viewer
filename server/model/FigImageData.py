import io
from dataclasses import dataclass

from enums.FigType import FigType


@dataclass(frozen=True)
class FigImageData:
    ch: int | None
    fig_type: FigType
    image_buf: io.BytesIO
    filename: str

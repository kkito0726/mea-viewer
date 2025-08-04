import io

from PIL import Image


def bytesio_list_to_gif(
    frames_bytesio: list[io.BytesIO], duration=0.1, loop=0
) -> io.BytesIO:
    # 各BytesIOをPIL.Imageに変換
    frames = [Image.open(bio) for bio in frames_bytesio]
    gif_buf = io.BytesIO()
    # 1枚目を基準に、残りをappend_imagesで追加
    frames[0].save(
        gif_buf,
        format="GIF",
        save_all=True,
        append_images=frames[1:],
        duration=duration * 1000,  # ミリ秒に変換
        loop=loop,
    )
    gif_buf.seek(0)
    return gif_buf

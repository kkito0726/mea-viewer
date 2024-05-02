from pyMEA.MEA import MEA
import matplotlib
matplotlib.use('Agg')  # GUIバックエンドを使用しないように設定
import matplotlib.pyplot as plt
import numpy as np
import io
import base64

def showAll(
    data: MEA,
    start=0,
    end=5,
    volt_min=-200,
    volt_max=200,
    figsize=(8, 8),
    dpi=300,
) -> str:
        buf = io.BytesIO()

        # 読み込み開始時間が0ではないときズレが生じるため差を取っている
        start_frame = int(abs(data.start - start) * data.SAMPLING_RATE)
        end_frame = int(abs(data.start - end) * data.SAMPLING_RATE)

        plt.figure(figsize=figsize, dpi=dpi)
        for i in range(1, 65, 1):
            plt.subplot(8, 8, i)
            plt.plot(
                data.array[0][start_frame:end_frame],
                data.array[i][start_frame:end_frame],
            )
            plt.ylim(volt_min, volt_max)
            plt.xlim(start, end)
        plt.savefig(buf, format="png")
        plt.close()
        buf.seek(0)
        image_base64 = base64.b64encode(buf.read()).decode('utf-8')

        return image_base64

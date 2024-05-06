from pyMEA.MEA import MEA
import matplotlib

matplotlib.use("Agg")  # GUIバックエンドを使用しないように設定
import matplotlib.pyplot as plt
import numpy as np
import io
import base64


def showAll(
    data,
    start=0,
    end=5,
    volt_min=-200,
    volt_max=200,
    figsize=(8, 8),
    dpi=300,
) -> str:
    buf = io.BytesIO()

    plt.figure(figsize=figsize, dpi=dpi)
    for i in range(1, 65, 1):
        plt.subplot(8, 8, i)
        plt.plot(
            data[0],
            data[i],
        )
        plt.ylim(volt_min, volt_max)
        plt.xlim(start, end)
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode("utf-8")

    return image_base64


def showSingle(
    x,
    y,
    start,
    end,
    volt_min=-200,
    volt_max=200,
    figsize=(8, 2),
    dpi=300,
    xlabel="Time (s)",
    ylabel="Voltage (μV)",
):
    buf = io.BytesIO()
    plt.figure(figsize=figsize, dpi=dpi)
    plt.plot(x, y)
    plt.xlim(start, end)
    plt.ylim(volt_min, volt_max)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode("utf-8")

    return image_base64

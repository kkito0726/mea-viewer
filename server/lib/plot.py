import matplotlib
import numpy as np
from model.form_value import FormValue

matplotlib.use("Agg")  # GUIバックエンドを使用しないように設定
import matplotlib.pyplot as plt
from lib.utils import output_base64, output_buf
import io


@output_buf
def showAll(data, form_value: FormValue) -> str:
    plt.figure(figsize=(form_value.x_ratio, form_value.y_ratio), dpi=form_value.dpi)
    for i in range(1, 65, 1):
        plt.subplot(8, 8, i)
        plt.plot(
            data[0],
            data[i],
        )
        plt.ylim(form_value.volt_min, form_value.volt_max)
        plt.xlim(form_value.start, form_value.end)


@output_buf
def showSingle(
    x,
    y,
    form_value: FormValue,
    xlabel="Time (s)",
    ylabel="Voltage (μV)",
) -> str:
    plt.figure(figsize=(form_value.x_ratio, form_value.y_ratio), dpi=form_value.dpi)
    plt.plot(x, y)
    plt.xlim(form_value.start, form_value.end)
    plt.ylim(form_value.volt_min, form_value.volt_max)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)


@output_buf
def showDetection(
    data,
    form_value: FormValue,
    chs: list[int],
    xlabel="Time (s)",
    ylabel="Voltage (μV)",
) -> io.BytesIO:
    plt.figure(figsize=(form_value.x_ratio, form_value.y_ratio), dpi=form_value.dpi)
    for i in range(1, len(data)):
        tmp_volt = (data[i] - np.mean(data[i])) / 50
        plt.plot(data[0], tmp_volt + (i - 1))
    ch_labels = [str(chs[i]) for i in range(len(chs))]
    plt.yticks(range(0, len(chs), 1), ch_labels)

    plt.ylim(-1, len(chs))
    plt.xlim(form_value.start, form_value.end)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)


@output_buf
def raster_plot(
    MEA_data,
    form_value: FormValue,
    chs: list[int],
    *peak_index,
    tick_ch=1,
) -> None:
    plt.figure(figsize=(form_value.x_ratio, form_value.y_ratio), dpi=form_value.dpi)
    for peak in peak_index:
        for i in range(1, len(chs)):
            plt.plot(
                MEA_data[0][peak[i]],
                np.ones(len(peak[i])) * i,
                "|",
                color="black",
                markersize=4,
            )

    plt.ylim(-1, len(chs) + 1)

    # 縦軸の目盛りを電極番号に変更
    ele_label = np.array([str(chs[i]) for i in range(len(chs))])
    l = np.arange(0, len(chs), tick_ch)
    plt.yticks(l, ele_label[l])

    plt.xlim(form_value.start, form_value.end)
    plt.xlabel("Time (s)")
    plt.ylabel("Electrode Number")
    plt.tight_layout()

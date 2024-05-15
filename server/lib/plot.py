import matplotlib
from model.form_value import FormValue

matplotlib.use("Agg")  # GUIバックエンドを使用しないように設定
import matplotlib.pyplot as plt
from lib.utils import output_base64


@output_base64
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


@output_base64
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

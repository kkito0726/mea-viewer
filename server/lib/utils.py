import matplotlib

matplotlib.use("Agg")  # GUIバックエンドを使用しないように設定
import matplotlib.pyplot as plt
import io
import base64


# base64でグラフを変換する
def output_base64(func):
    def warapper(*args, **kwargs):
        buf = io.BytesIO()
        func(*args, *kwargs)

        plt.savefig(buf, format="png")
        plt.close()
        buf.seek(0)
        image_base64 = base64.b64encode(buf.read()).decode("utf-8")

        return image_base64

    return warapper


def output_buf(func):
    def warapper(*args, **kwargs):
        buf = io.BytesIO()
        func(*args, *kwargs)

        plt.savefig(buf, format="png")
        plt.close()
        buf.seek(0)

        return buf

    return warapper


if __name__ == "__main__":

    @output_base64
    def test(x, y, figsize=(5, 5)):
        plt.figure(figsize=figsize)
        plt.plot(x, y)

    img = test([1, 2, 3], [1, 2, 3])
    print(img)

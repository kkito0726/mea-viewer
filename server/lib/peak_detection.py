import numpy as np
from numpy import ndarray
from scipy.signal import find_peaks


# 64電極すべての下ピークを取得
def detect_peak_neg(
    MEA_data: ndarray,
    distance=3000,
    threshold=3,
    min_amp=10,
    width=None,
    prominence=None,
) -> ndarray:
    peak_index = np.array([None for _ in range(len(MEA_data))])
    for i in range(1, len(MEA_data)):
        # ピーク抽出の閾値を設定
        height = np.std(MEA_data[i]) * threshold
        # 閾値が最低閾値を下回っていた場合は最低閾値の値を閾値の値に設定する
        if height < min_amp:
            height = min_amp
        detect_peak_index = find_peaks(
            -MEA_data[i],
            height=height,
            distance=distance,
            width=width,
            prominence=prominence,
        )

        peak_index[i] = detect_peak_index[0]
        peak_index[i] = np.sort(peak_index[i])
    peak_index[0] = np.array([])

    return peak_index


# 64電極すべての上ピークを取得
def detect_peak_pos(
    MEA_data: ndarray,
    distance=3000,
    threshold=3,
    min_amp=10,
    width=None,
    prominence=None,
) -> ndarray:
    peak_index = np.array([None for _ in range(len(MEA_data))])
    for i in range(1, len(MEA_data)):
        # ピーク抽出の閾値を設定
        height = np.std(MEA_data[i]) * threshold
        # 閾値が最低閾値を下回っていた場合は最低閾値の値を閾値の値に設定する
        if height < min_amp:
            height = min_amp
        detect_peak_index = find_peaks(
            MEA_data[i],
            height=height,
            distance=distance,
            width=width,
            prominence=prominence,
        )

        peak_index[i] = detect_peak_index[0]
        peak_index[i] = np.sort(peak_index[i])
    peak_index[0] = np.array([])

    return peak_index

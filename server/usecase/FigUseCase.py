from dataclasses import dataclass

import numpy as np
from flask import jsonify
from pyMEA import MEA, FigMEA
from pyMEA.core.Electrode import Electrode
from pyMEA.read.model.HedPath import HedPath

from enums.FigType import FigType
from model.FigRequest import FigRequest
from model.form_value import FormValue
from model.peak_form_value import PeakFormValue
from repository.fig_image_repository import FigImageRepository
from service.fig_service import FigService
from service.FigDispatchService import FigDispatchService
from service.mino_service import MinioService


@dataclass(frozen=True)
class FigUseCase:
    fig_request: FigRequest

    def create_fig(self):
        # 入力データ読み込み
        form_value = FormValue(self.fig_request.json_data)
        peak_form_value = PeakFormValue(self.fig_request.json_data)
        completed_data = complete_data(self.fig_request.data, form_value)

        fm = create_figMEA(completed_data, form_value)
        fig_service = FigService(fm, form_value, peak_form_value)
        fig_type = FigType.from_value(form_value.fig_type)
        # グラフ描画
        image_data_list = FigDispatchService(fig_service, fig_type).create_fig()

        # 永続化
        fig_images = MinioService.saves(image_data_list)
        res = [FigImageRepository.insert(fig_image) for fig_image in fig_images]
        return jsonify(res), 200


def create_time_data(data, form_value: FormValue):
    t = np.arange(len(data[0])) / form_value.hedValue.sampling_rate
    t = t.reshape(1, len(t))
    t += form_value.start

    return np.append(t, data, axis=0)


# 受け取った電位データ以外はダミーデータで保管してpyMEAで使用できるようにする
def complete_data(data, form_value: FormValue):
    # 時刻データ作成
    data = create_time_data(data, form_value)
    if len(data) == 65:
        return data

    length = len(data[0])
    result = np.ones((65, length), dtype=data[0].dtype)
    result[0] = data[0]

    index = 1
    for ch in range(1, 65):
        if ch in set(form_value.chs):
            result[ch] = data[index]
            index += 1
    return result


def create_figMEA(data, form_value: FormValue):
    data = MEA(
        HedPath("tmp.hed"),
        form_value.start,
        form_value.end,
        form_value.hedValue.sampling_rate,
        form_value.hedValue.gain,
        data,
    )
    return FigMEA(data, Electrode(form_value.electrode_distance))

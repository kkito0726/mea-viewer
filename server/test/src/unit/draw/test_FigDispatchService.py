import unittest
from test.src.utils import get_resource_path
from unittest.mock import patch

import numpy as np
from enums.FigType import FigType
from model.form_value import FormValue
from model.peak_form_value import PeakFormValue
from pyMEA import detect_peak_neg, read_MEA
from pyMEA.figure.plot.plot import circuit_eles
from service.fig_service import FigService
from service.FigImageDispatchService import FigImageDispatchService
from usecase.FigUseCase import complete_data, create_figMEA


class DrawLineTest(unittest.TestCase):
    def setUp(self):
        self.path = get_resource_path("230615_day2_test_5s_.hed")
        self.mea = read_MEA(self.path.__str__(), 0, 1, 450)

    @patch("pyMEA.FigMEA.draw_line_conduction")
    def test_環状_拍動周期基準電極指定(self, mock_draw_line_conduction):
        input_data = []
        for ch in circuit_eles:
            input_data.append(self.mea.data[ch])

        json_data = {
            "readTime": {"start": 0, "end": 30},
            "hedValue": {"sampling_rate": 10000, "gain": 2000},
            "filename": "230615_day2_test_5s_0001.bio",
            "chs": circuit_eles,
            "figType": "drawLine",
            "start": 0,
            "end": 1,
            "volt_min": -200,
            "volt_max": 200,
            "x_ratio": 10,
            "y_ratio": 8,
            "dpi": 100,
            "electrode_distance": 450,
            "peakFormValue": {
                "isPositive": False,
                "isNegative": True,
                "distance": 3000,
                "threshold": 3,
                "isLoop": True,
                "baseCh": 9,
            },
        }

        # テストデータの準備
        form_value = FormValue(json_data)
        peak_form_value = PeakFormValue(json_data)
        completed_data = complete_data(np.array(input_data), form_value)
        fm = create_figMEA(completed_data, form_value)
        fig_service = FigService(fm, form_value, peak_form_value)
        fig_type = FigType.from_value(form_value.fig_type)

        # テスト対象メソッドの実行
        peak_index = detect_peak_neg(
            fm.data, peak_form_value.distance, peak_form_value.threshold
        )
        FigImageDispatchService(fig_service, fig_type).create_fig()

        mock_draw_line_conduction.assert_called()
        mock_draw_line_conduction.assert_called_once_with(
            peak_index=peak_index,
            amc_chs=circuit_eles,
            base_ch=9,
            isLoop=True,
            dpi=100,
            isBuf=True,
        )

    @patch("pyMEA.FigMEA.draw_line_conduction")
    def test_環状でない_拍動周期基準電極指定(self, mock_draw_line_conduction):
        input_data = []
        for ch in circuit_eles:
            input_data.append(self.mea.data[ch])

        json_data = {
            "readTime": {"start": 0, "end": 30},
            "hedValue": {"sampling_rate": 10000, "gain": 2000},
            "filename": "230615_day2_test_5s_0001.bio",
            "chs": circuit_eles,
            "figType": "drawLine",
            "start": 0,
            "end": 1,
            "volt_min": -200,
            "volt_max": 200,
            "x_ratio": 10,
            "y_ratio": 8,
            "dpi": 100,
            "electrode_distance": 450,
            "peakFormValue": {
                "isPositive": False,
                "isNegative": True,
                "distance": 3000,
                "threshold": 3,
                "isLoop": False,
                "baseCh": 2,
            },
        }

        # テストデータの準備
        form_value = FormValue(json_data)
        peak_form_value = PeakFormValue(json_data)
        completed_data = complete_data(np.array(input_data), form_value)
        fm = create_figMEA(completed_data, form_value)
        fig_service = FigService(fm, form_value, peak_form_value)
        fig_type = FigType.from_value(form_value.fig_type)

        # テスト対象メソッドの実行
        peak_index = detect_peak_neg(
            fm.data, peak_form_value.distance, peak_form_value.threshold
        )
        FigImageDispatchService(fig_service, fig_type).create_fig()

        mock_draw_line_conduction.assert_called()
        mock_draw_line_conduction.assert_called_once_with(
            peak_index=peak_index,
            amc_chs=circuit_eles,
            base_ch=2,
            isLoop=False,
            dpi=100,
            isBuf=True,
        )

    @patch("pyMEA.FigMEA.draw_line_conduction")
    def test_環状_拍動周期基準電極指定なし(self, mock_draw_line_conduction):
        input_data = []
        for ch in circuit_eles:
            input_data.append(self.mea.data[ch])

        json_data = {
            "readTime": {"start": 0, "end": 30},
            "hedValue": {"sampling_rate": 10000, "gain": 2000},
            "filename": "230615_day2_test_5s_0001.bio",
            "chs": circuit_eles,
            "figType": "drawLine",
            "start": 0,
            "end": 1,
            "volt_min": -200,
            "volt_max": 200,
            "x_ratio": 10,
            "y_ratio": 8,
            "dpi": 100,
            "electrode_distance": 450,
            "peakFormValue": {
                "isPositive": False,
                "isNegative": True,
                "distance": 3000,
                "threshold": 3,
                "isLoop": True,
                "baseCh": None,
            },
        }

        # テストデータの準備
        form_value = FormValue(json_data)
        peak_form_value = PeakFormValue(json_data)
        completed_data = complete_data(np.array(input_data), form_value)
        fm = create_figMEA(completed_data, form_value)
        fig_service = FigService(fm, form_value, peak_form_value)
        fig_type = FigType.from_value(form_value.fig_type)

        # テスト対象メソッドの実行
        peak_index = detect_peak_neg(
            fm.data, peak_form_value.distance, peak_form_value.threshold
        )
        FigImageDispatchService(fig_service, fig_type).create_fig()

        mock_draw_line_conduction.assert_called()
        mock_draw_line_conduction.assert_called_once_with(
            peak_index=peak_index,
            amc_chs=circuit_eles,
            base_ch=None,
            isLoop=True,
            dpi=100,
            isBuf=True,
        )

    @patch("pyMEA.FigMEA.draw_line_conduction")
    def test_環状でない_拍動周期基準電極指定なし_baseCh項目すらなし(
        self, mock_draw_line_conduction
    ):
        input_data = []
        for ch in circuit_eles:
            input_data.append(self.mea.data[ch])

        json_data = {
            "readTime": {"start": 0, "end": 30},
            "hedValue": {"sampling_rate": 10000, "gain": 2000},
            "filename": "230615_day2_test_5s_0001.bio",
            "chs": circuit_eles,
            "figType": "drawLine",
            "start": 0,
            "end": 1,
            "volt_min": -200,
            "volt_max": 200,
            "x_ratio": 10,
            "y_ratio": 8,
            "dpi": 100,
            "electrode_distance": 450,
            "peakFormValue": {
                "isPositive": False,
                "isNegative": True,
                "distance": 3000,
                "threshold": 3,
                "isLoop": False,
            },
        }

        # テストデータの準備
        form_value = FormValue(json_data)
        peak_form_value = PeakFormValue(json_data)
        completed_data = complete_data(np.array(input_data), form_value)
        fm = create_figMEA(completed_data, form_value)
        fig_service = FigService(fm, form_value, peak_form_value)
        fig_type = FigType.from_value(form_value.fig_type)

        # テスト対象メソッドの実行
        peak_index = detect_peak_neg(
            fm.data, peak_form_value.distance, peak_form_value.threshold
        )
        FigImageDispatchService(fig_service, fig_type).create_fig()

        mock_draw_line_conduction.assert_called()
        mock_draw_line_conduction.assert_called_once_with(
            peak_index=peak_index,
            amc_chs=circuit_eles,
            base_ch=None,
            isLoop=False,
            dpi=100,
            isBuf=True,
        )


if __name__ == "__main__":
    unittest.main()

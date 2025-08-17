import unittest
from test.src.utils import get_resource_path

import numpy as np
from model.form_value import FormValue
from pyMEA import read_MEA
from pyMEA.figure.plot.plot import circuit_eles
from usecase.FigUseCase import complete_data


class CompleteDataTest(unittest.TestCase):
    def setUp(self):
        self.path = get_resource_path("230615_day2_test_5s_.hed")
        self.mea = read_MEA(self.path.__str__(), 0, 1, 450)

    def test_入力chが環状経路の場合電位データの整合性が保たれている(self):
        input_data = []
        for ch in circuit_eles:
            input_data.append(self.mea.data[ch])

        json_data = {
            "readTime": {"start": 0, "end": 30},
            "hedValue": {"sampling_rate": 10000, "gain": 2000},
            "filename": "230615_day2_test_5s_0001.bio",
            "chs": circuit_eles,
            "figType": "showSingle",
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

        # テスト対象の実行
        actual_data = complete_data(np.array(input_data), FormValue(json_data))

        # アサーション
        for ch in circuit_eles:
            np.testing.assert_allclose(
                actual_data[ch], self.mea.data[ch], err_msg=f"Mismatch at channel {ch}"
            )

    def test_入力chが順不同で入力されても電位データの整合性が保たれている(self):
        input_chs = [3, 7, 2, 6, 4, 58, 63, 32, 27, 51, 64, 1]
        input_data = []
        for ch in input_chs:
            input_data.append(self.mea.data[ch])

        json_data = {
            "readTime": {"start": 0, "end": 30},
            "hedValue": {"sampling_rate": 10000, "gain": 2000},
            "filename": "230615_day2_test_5s_0001.bio",
            "chs": input_chs,
            "figType": "showSingle",
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

        # テスト対象の実行
        actual_data = complete_data(np.array(input_data), FormValue(json_data))

        # アサーション
        for ch in input_chs:
            np.testing.assert_allclose(
                actual_data[ch], self.mea.data[ch], err_msg=f"Mismatch at channel {ch}"
            )


if __name__ == "__main__":
    unittest.main()

import unittest

import numpy as np

from model.FigRequest import clean_data


class CleanNanFromInputDataTest(unittest.TestCase):
    def setUp(self):
        self.expect = np.array(
            [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
            ]
        )

    def test_入力データにnanが含まれる場合除去されたデータが返される(self):
        # 入力データ
        test_data = np.array(
            [
                [1, 2, 3, np.nan, np.nan],
                [4, 5, 6, np.nan, np.nan],
                [7, 8, 9, np.nan, np.nan],
            ]
        )

        # テスト対象の実行
        actual = clean_data(test_data)

        np.testing.assert_allclose(actual, self.expect)

    def test_入力データにnanが含まれない場合_そのままのデータが返される(self):
        # 入力データ
        test_data = np.array(
            [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
            ]
        )

        # テスト対象の実行
        actual = clean_data(test_data)

        np.testing.assert_allclose(actual, self.expect)


if __name__ == "__main__":
    unittest.main()

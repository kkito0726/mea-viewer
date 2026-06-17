import os
import tempfile
import unittest
from unittest.mock import patch

import numpy as np
from enums.FigType import FigType
from model.FigRequest import NpzFigRequest
from pyMEA.domain.model.HedPath import HedPath
from pyMEA.domain.model.MEA import MEA
from pyMEA.infrastructure.npz_io import save_mea_npz
from usecase.FigUseCase import NpzFigUseCase


def _make_synth_npz(path: str, sampling_rate=1000, gain=2000, electrode_distance=450):
    """テスト用の合成MEAデータ(時刻 + 64ch, 1秒)をnpzで保存する。"""
    n = sampling_rate
    t = np.arange(n) / sampling_rate
    arr = np.vstack([t] + [np.sin(2 * np.pi * 5 * t + ch) for ch in range(64)]).astype(
        np.float64
    )
    mea = MEA(HedPath("tmp.hed"), 0, 1, sampling_rate, gain, arr)
    save_mea_npz(mea, path, dtype="int16", electrode_distance=electrode_distance)


class NpzFigUseCaseTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.NamedTemporaryFile(suffix=".npz", delete=False)
        self.tmp.close()
        _make_synth_npz(self.tmp.name)
        self.json_data = {
            "figType": "showAll",
            "filename": "test_synth.npz",
            "volt_min": -200,
            "volt_max": 200,
            "x_ratio": 8,
            "y_ratio": 8,
            "dpi": 100,
            "chs": [],
        }

    def tearDown(self):
        if os.path.exists(self.tmp.name):
            os.remove(self.tmp.name)

    @patch("usecase.FigUseCase.FigImageRepository")
    @patch("usecase.FigUseCase.MinioService")
    def test_npzから画像が生成される(self, mock_minio, mock_repo):
        mock_minio.saves.side_effect = lambda images: images
        mock_repo.insert.side_effect = lambda img: img.fig_type

        req = NpzFigRequest(self.tmp.name, self.json_data)
        result = NpzFigUseCase(req).create_fig()

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0], FigType.SHOW_ALL)

    @patch("usecase.FigUseCase.FigImageRepository")
    @patch("usecase.FigUseCase.MinioService")
    def test_処理後にtempファイルが削除される(self, mock_minio, mock_repo):
        mock_minio.saves.side_effect = lambda images: images
        mock_repo.insert.side_effect = lambda img: img.fig_type

        req = NpzFigRequest(self.tmp.name, self.json_data)
        NpzFigUseCase(req).create_fig()

        self.assertFalse(os.path.exists(self.tmp.name))

    @patch("usecase.FigUseCase.FigImageRepository")
    @patch("usecase.FigUseCase.MinioService")
    def test_読み込み失敗時もtempファイルが削除される(self, mock_minio, mock_repo):
        # 不正なnpzパスを渡すと read_MEA_npz が例外を投げる
        with open(self.tmp.name, "wb") as f:
            f.write(b"not a valid npz file")

        req = NpzFigRequest(self.tmp.name, self.json_data)
        with self.assertRaises(Exception):
            NpzFigUseCase(req).create_fig()

        self.assertFalse(os.path.exists(self.tmp.name))


if __name__ == "__main__":
    unittest.main()

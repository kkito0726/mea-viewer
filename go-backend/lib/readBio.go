package lib

import (
	"encoding/binary"
	"io"
	"math"
	"mime/multipart"

	"github.com/kkito0726/mea-viewer/model"
)

func DecodeRequest(files [][]*multipart.FileHeader) (*[][]float32, error) {
	var data [][]float32
	for _, fileHeaders := range files {
		for _, fileHeader := range fileHeaders {
			file, err := fileHeader.Open()
			if err != nil {
				return nil, err
			}
			defer file.Close()

			fileData, err := io.ReadAll(file)
			if err != nil {
				return nil, err
			}

			// Convert byte slice to float32 slice
			floatData := make([]float32, len(fileData)/4)
			for i := 0; i < len(floatData); i++ {
				floatData[i] = math.Float32frombits(binary.LittleEndian.Uint32(fileData[i*4 : (i+1)*4]))
			}

			data = append(data, floatData)
		}

	}

	return &data, nil
}

func CalcReadFrame(data *model.JsonData) *model.ReadFrame {
	startFrame := (data.Start - data.ReadTime.Start) * data.HedValue.SamplingRate
	endFrame := (data.End - data.ReadTime.Start) * data.HedValue.SamplingRate

	if startFrame < 0 {
		startFrame = 0
	}
	if endFrame < 0 {
		endFrame = 1
	}
	if endFrame > data.ReadTime.End*data.HedValue.SamplingRate {
		endFrame = data.ReadTime.End * data.HedValue.SamplingRate
	}

	return &model.ReadFrame{
		StartFrame: startFrame,
		EndFrame:   endFrame,
	}
}

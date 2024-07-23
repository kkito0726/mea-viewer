package lib

import (
	"fmt"
	"io"
	"mime/multipart"
	"strconv"
	"unsafe"

	"github.com/kkito0726/mea-viewer/model"
)

func DecodeRequest(formFiles map[string][]*multipart.FileHeader) (*[][]float32, error) {
	var meaData [][]float32
	for i := 0; i <= len(formFiles); i++ {
		// Assuming file keys are in the format "file0", "file1", etc.
		files := formFiles[fmt.Sprintf("file%s", strconv.Itoa(i))]
		if len(files) > 0 {
			file, err := files[0].Open()
			if err != nil {
				return nil, err
			}
			defer file.Close()

			buf, err := io.ReadAll(file)
			if err != nil {
				return nil, err
			}

			var floatArray []float32
			err = decodeFloat32Array(buf, &floatArray)
			if err != nil {
				return nil, err
			}

			meaData = append(meaData, floatArray)
		}
	}

	return &meaData, nil
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

func decodeFloat32Array(data []byte, out *[]float32) error {
	if len(data)%4 != 0 {
		return fmt.Errorf("data length is not a multiple of 4")
	}
	var float32Data []float32
	for i := 0; i < len(data); i += 4 {
		bits := uint32(data[i]) | uint32(data[i+1])<<8 | uint32(data[i+2])<<16 | uint32(data[i+3])<<24
		float32Data = append(float32Data, *(*float32)(unsafe.Pointer(&bits)))
	}
	*out = float32Data
	return nil
}

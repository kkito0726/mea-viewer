package lib

import (
	"fmt"
	"io"
	"mime/multipart"
	"strconv"
	"sync"
	"unsafe"
)

func DecodeRequest(formFiles map[string][]*multipart.FileHeader) ([][]float32, error) {
	var wg sync.WaitGroup
	ch := make(chan struct{}, 8)
	var mu sync.Mutex
	meaData := make([][]float32, len(formFiles))
	for i := 0; i < len(formFiles); i++ {
		wg.Add(1)
		ch <- struct{}{}
		go func(i int) {
			defer wg.Done()
			defer func() { <-ch }()
			// Assuming file keys are in the format "file0", "file1", etc.
			files := formFiles[fmt.Sprintf("file%s", strconv.Itoa(i))]
			if len(files) > 0 {
				file, err := files[0].Open()
				if err != nil {
					return
				}
				defer file.Close()

				buf, err := io.ReadAll(file)
				if err != nil {
					return
				}

				var floatArray []float32
				err = decodeFloat32Array(buf, &floatArray)
				if err != nil {
					return
				}

				mu.Lock()
				meaData[i] = floatArray
				mu.Unlock()
			}
		}(i)
	}
	wg.Wait()
	return meaData, nil
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

package service

import (
	"bytes"
	"image/png"
	"sync"

	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/lib"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
)

var imageRepository = &repository.ImageRepository{}
var minioRepository = &repository.MinioRepository{}

func FigDispatch(requestModel *RequestModel) ([]model.FigImage, *errors.CustomError) {
	figType, err := enum.ParseFigType(requestModel.JsonData.FigType)
	if err != nil {
		return nil, errors.BadRequest(enum.F009)
	}
	switch figType {

	case enum.ShowAll:
		return showAll(requestModel)

	case enum.ShowSingle:
		return showSingle(requestModel)

	case enum.ShowDetection:
		return showDetection(requestModel)

	case enum.RasterPlot:
		return rasterPlot(requestModel)

	case enum.PlotPeaks:
		return plotPeaks(requestModel)

	default:
		return nil, errors.BadRequest(enum.F009)
	}
}

func showAll(requestModel *RequestModel) ([]model.FigImage, *errors.CustomError) {
	images := make([]model.FigImage, 1)
	meaPlot := lib.NewMeaPlot(requestModel.SliceMeaData)
	image, customErr := createImage(meaPlot.ShowAll, &model.FormDto{
		FormValue: &model.FormValue{
			FigType: requestModel.JsonData.FigType,
			XRatio:  requestModel.JsonData.XRatio,
			YRatio:  requestModel.JsonData.YRatio,
			VoltMin: requestModel.JsonData.VoltMin,
			VoltMax: requestModel.JsonData.VoltMax,
			Start:   requestModel.JsonData.Start,
			End:     requestModel.JsonData.End,
		},
		FileName: requestModel.JsonData.Filename,
		FigType:  enum.ShowAll,
	})
	images[0] = *image
	return images, customErr
}

func showSingle(requestModel *RequestModel) ([]model.FigImage, *errors.CustomError) {
	var wg sync.WaitGroup
	ch := make(chan struct{}, 8)
	images := make([]model.FigImage, len(requestModel.JsonData.Chs))
	var mu sync.Mutex
	var firstErr *errors.CustomError
	for i, meaCh := range requestModel.JsonData.Chs {
		wg.Add(1)
		ch <- struct{}{}

		go func(i, meaCh int) {
			defer wg.Done()
			defer func() { <-ch }()
			singleChannelMeaData := [][]float32{requestModel.SliceMeaData[0], requestModel.SliceMeaData[i+1]}
			meaPlot := lib.NewMeaPlot(singleChannelMeaData)
			image, customErr := createImage(meaPlot.ShowSingle, &model.FormDto{
				FormValue: &model.FormValue{
					FigType: requestModel.JsonData.FigType,
					XRatio:  requestModel.JsonData.XRatio,
					YRatio:  requestModel.JsonData.YRatio,
					VoltMin: requestModel.JsonData.VoltMin,
					VoltMax: requestModel.JsonData.VoltMax,
					Start:   requestModel.JsonData.Start,
					End:     requestModel.JsonData.End,
				},
				FileName: requestModel.JsonData.Filename,
				FigType:  enum.ShowSingle,
				Ch:       meaCh,
			})
			if customErr != nil {
				mu.Lock()
				if firstErr == nil {
					firstErr = customErr
				}
				mu.Unlock()
				return
			}
			mu.Lock()
			images[i] = *image
			mu.Unlock()
		}(i, meaCh)

	}
	wg.Wait()
	if firstErr != nil {
		return nil, firstErr
	}
	return images, nil
}

func showDetection(requestModel *RequestModel) ([]model.FigImage, *errors.CustomError) {
	images := make([]model.FigImage, 1)
	meaPlot := lib.NewMeaPlot(requestModel.SliceMeaData)
	image, customErr := createImage(meaPlot.ShowDetection, &model.FormDto{
		FormValue: &model.FormValue{
			FigType: requestModel.JsonData.FigType,
			XRatio:  requestModel.JsonData.XRatio,
			YRatio:  requestModel.JsonData.YRatio,
			VoltMin: requestModel.JsonData.VoltMin,
			VoltMax: requestModel.JsonData.VoltMax,
			Start:   requestModel.JsonData.Start,
			End:     requestModel.JsonData.End,
			Chs:     requestModel.JsonData.Chs,
		},
		FileName: requestModel.JsonData.Filename,
		FigType:  enum.ShowDetection,
	})
	if customErr != nil {
		return nil, customErr
	}
	images[0] = *image
	return images, nil
}

func rasterPlot(requestModel *RequestModel) ([]model.FigImage, *errors.CustomError) {
	images := make([]model.FigImage, 1)
	meaPlot := lib.NewMeaPlot(requestModel.SliceMeaData)
	image, customErr := createImage(meaPlot.RasterPlot, &model.FormDto{
		FormValue: &model.FormValue{
			FigType:       requestModel.JsonData.FigType,
			XRatio:        requestModel.JsonData.XRatio,
			YRatio:        requestModel.JsonData.YRatio,
			VoltMin:       requestModel.JsonData.VoltMin,
			VoltMax:       requestModel.JsonData.VoltMax,
			Start:         requestModel.JsonData.Start,
			End:           requestModel.JsonData.End,
			PeakFormValue: requestModel.JsonData.PeakFormValue,
			Chs:           requestModel.JsonData.Chs,
		},
		FileName: requestModel.JsonData.Filename,
		FigType:  enum.RasterPlot,
	})
	if customErr != nil {
		return nil, customErr
	}
	images[0] = *image
	return images, nil
}

func plotPeaks(requestModel *RequestModel) ([]model.FigImage, *errors.CustomError) {
	images := make([]model.FigImage, len(requestModel.JsonData.Chs))
	var wg sync.WaitGroup
	ch := make(chan struct{}, 8)
	var mu sync.Mutex
	var firstErr *errors.CustomError
	for i, meaCh := range requestModel.JsonData.Chs {
		wg.Add(1)
		ch <- struct{}{}
		go func(i, meaCh int) {
			defer wg.Done()
			defer func() { <-ch }()
			singleChannelMeaData := [][]float32{requestModel.SliceMeaData[0], requestModel.SliceMeaData[i+1]}
			meaPlot := lib.NewMeaPlot(singleChannelMeaData)

			image, customErr := createImage(meaPlot.PlotPeaks, &model.FormDto{
				FormValue: &model.FormValue{
					FigType:       requestModel.JsonData.FigType,
					XRatio:        requestModel.JsonData.XRatio,
					YRatio:        requestModel.JsonData.YRatio,
					VoltMin:       requestModel.JsonData.VoltMin,
					VoltMax:       requestModel.JsonData.VoltMax,
					Start:         requestModel.JsonData.Start,
					End:           requestModel.JsonData.End,
					PeakFormValue: requestModel.JsonData.PeakFormValue,
				},
				FileName: requestModel.JsonData.Filename,
				FigType:  enum.PlotPeaks,
				Ch:       meaCh,
			})
			if customErr != nil {
				mu.Lock()
				if firstErr == nil {
					firstErr = customErr
				}
				mu.Unlock()
				return
			}
			mu.Lock()
			images[i] = *image
			mu.Unlock()
		}(i, meaCh)
	}
	wg.Wait()
	if firstErr != nil {
		return nil, firstErr
	}
	return images, nil
}

func createImage(f lib.PlotMethod, formDto *model.FormDto) (*model.FigImage, *errors.CustomError) {
	// Figの描画
	img, err := f(formDto.FormValue)
	if err != nil {
		return nil, errors.ServerError(enum.F008)
	}
	buf := new(bytes.Buffer)
	if err := png.Encode(buf, img.Image()); err != nil {
		return nil, errors.ServerError(enum.F005)
	}

	// minioへの保存
	imageUrl, err := minioRepository.SaveImage(buf, formDto)
	if err != nil {
		return nil, errors.ServerError(enum.F003)
	}

	// DBへレコードInsert
	image := &model.FigImage{FigType: formDto.FigType.String(), ImageUrl: imageUrl, FileName: formDto.FileName, Ch: formDto.Ch}
	if err := imageRepository.CreateImage(image); err != nil {
		return nil, errors.ServerError(enum.F004)
	}

	return image, nil
}

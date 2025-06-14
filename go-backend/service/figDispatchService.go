package service

import (
	"sync"

	"github.com/kkito0726/mea-viewer/enum"
	"github.com/kkito0726/mea-viewer/errors"
	"github.com/kkito0726/mea-viewer/lib"
	"github.com/kkito0726/mea-viewer/model"
	"github.com/kkito0726/mea-viewer/repository"
)

func FigDispatch(requestModel *RequestModel) ([]model.Image, *errors.CustomError) {
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

func showAll(requestModel *RequestModel) ([]model.Image, *errors.CustomError) {
	images := make([]model.Image, 1)
	meaPlot := lib.NewMeaPlot(requestModel.SliceMeaData)
	imageService := NewImageService(enum.ShowAllTable, repository.MinioRepository{})
	image, customErr := imageService.CreateImage(meaPlot.ShowAll, &model.FormDto{
		FormValue: &model.FormValue{
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

func showSingle(requestModel *RequestModel) ([]model.Image, *errors.CustomError) {
	var wg sync.WaitGroup
	ch := make(chan struct{}, 8)
	images := make([]model.Image, len(requestModel.JsonData.Chs))
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
			imageService := NewImageService(enum.ShowSingleTable, repository.MinioRepository{})
			image, customErr := imageService.CreateImage(meaPlot.ShowSingle, &model.FormDto{
				FormValue: &model.FormValue{
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

func showDetection(requestModel *RequestModel) ([]model.Image, *errors.CustomError) {
	images := make([]model.Image, 1)
	meaPlot := lib.NewMeaPlot(requestModel.SliceMeaData)
	imageService := NewImageService(enum.ShowDetectionTable, repository.MinioRepository{})
	image, customErr := imageService.CreateImage(meaPlot.ShowDetection, &model.FormDto{
		FormValue: &model.FormValue{
			XRatio:  requestModel.JsonData.XRatio,
			YRatio:  requestModel.JsonData.YRatio,
			VoltMin: requestModel.JsonData.VoltMin,
			VoltMax: requestModel.JsonData.VoltMax,
			Start:   requestModel.JsonData.Start,
			End:     requestModel.JsonData.End,
			Chs:     requestModel.JsonData.Chs,
		},
		FileName: requestModel.JsonData.Filename,
		FigType:  enum.ShowAll,
	})
	if customErr != nil {
		return nil, customErr
	}
	images[0] = *image
	return images, nil
}

func rasterPlot(requestModel *RequestModel) ([]model.Image, *errors.CustomError) {
	images := make([]model.Image, 1)
	meaPlot := lib.NewMeaPlot(requestModel.SliceMeaData)
	imageService := NewImageService(enum.RasterPlotTable, repository.MinioRepository{})
	image, customErr := imageService.CreateImage(meaPlot.RasterPlot, &model.FormDto{
		FormValue: &model.FormValue{
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
		FigType:  enum.ShowAll,
	})
	if customErr != nil {
		return nil, customErr
	}
	images[0] = *image
	return images, nil
}

func plotPeaks(requestModel *RequestModel) ([]model.Image, *errors.CustomError) {
	images := make([]model.Image, len(requestModel.JsonData.Chs))
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

			imageService := NewImageService(enum.PlotPeaksTable, repository.MinioRepository{})
			image, customErr := imageService.CreateImage(meaPlot.PlotPeaks, &model.FormDto{
				FormValue: &model.FormValue{
					XRatio:        requestModel.JsonData.XRatio,
					YRatio:        requestModel.JsonData.YRatio,
					VoltMin:       requestModel.JsonData.VoltMin,
					VoltMax:       requestModel.JsonData.VoltMax,
					Start:         requestModel.JsonData.Start,
					End:           requestModel.JsonData.End,
					PeakFormValue: requestModel.JsonData.PeakFormValue,
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

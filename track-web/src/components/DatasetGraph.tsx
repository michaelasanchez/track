import { map } from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import ChartistGraph from 'react-chartist';
import { useResize } from '../hooks';
import { ApiDataset, ApiSeries } from '../models/api';
import {
  ChartistData,
  ChartistDataType,
  ChartistSeries,
} from '../models/chartist';
import { strings } from '../shared/strings';
import {
  ChartistOptionsFactory,
  defaultColor,
  SERIES_PREFIXES,
} from '../utils/ChartistOptionsFactory';
import { TimeSpan } from '../utils/TimeSpan';

export enum GraphType {
  Bar = 'Bar',
  Line = 'Line',
}

export enum ChartZoom {
  Month = 'month',
  Day = 'day',
  Hour = 'hour',
  Minute = 'minute',
}

const renderColorStyle = (
  apiSeries: ApiSeries[],
  className: string,
  chartistSeries: ChartistSeries[]
) => {
  return (
    <style>
      {map(chartistSeries, (ss, i) => {
        const prefix = SERIES_PREFIXES.substr(i, 1);
        const s = apiSeries[i];

        // TODO: hack to hide span series
        const color = s ? s.Color || `#${defaultColor(s.Order)}` : '#00000000';

        return `
          .${className} .ct-series-${prefix} .ct-line,
          .${className} .ct-series-${prefix} .ct-point {
            stroke: ${color};
          }`;
      })}
    </style>
  );
};

const getChartZoom = (span: TimeSpan): ChartZoom => {
  if (span.days > 60) {
    return ChartZoom.Month;
  } else if (span.days > 1) {
    return ChartZoom.Day;
  } else if (span.hours > 1) {
    return ChartZoom.Hour;
  }
  return ChartZoom.Minute;
};

// "No Dataset" label
const labelStyle = {
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: '0 0 0 4px #ffffffcc',
  backgroundColor: '#e2e3e5aa',
};

//
const getBufferUnits = (zoom: ChartZoom): [number, moment.unitOfTime.Base] => {
  switch (zoom) {
    case ChartZoom.Month:
      return [15, 'day'];
    case ChartZoom.Day:
      return [12, 'hour'];
    case ChartZoom.Hour:
      return [10, 'minute'];
    case ChartZoom.Minute:
      return [10, 'second'];
  }
};

// Span Series - added to numerical/frequency to create chart "buffer"
const getSpanSeries = (labels: Array<string>, value: any, zoom: ChartZoom) => {
  const [num, unit] = getBufferUnits(zoom);

  const starDate = moment(labels[0]);
  const endDate = moment(labels[labels.length - 1]);

  const startBuffer = starDate.clone().subtract(num, unit);
  const startLabel = startBuffer.clone().add(1, zoom).startOf(zoom);

  // const endLabel = endDate.clone().add(1, zoom).startOf(zoom);
  const endBuffer = endDate.clone().add(num, unit);

  return [startLabel, /*endLabel, */ startBuffer, endBuffer].map((m) => ({
    x: m,
    y: value,
  }));
};

export interface GraphDimensions {
  height: number;
  width: number;
}

interface GraphProps {
  chartRef: React.MutableRefObject<HTMLDivElement>;
  dataset: ApiDataset;
  defaultType?: GraphType;
}

const DatasetGraph: React.FunctionComponent<GraphProps> = ({
  chartRef,
  dataset,
  defaultType = GraphType.Line,
}) => {
  const [graphDimensions, setGraphDimensions] = useState<GraphDimensions>({ height: 0, width: 0 });

  console.log('dimensions', graphDimensions)

  const { height, width } = useResize(chartRef);

  const [span, setSpan] = useState<TimeSpan>(new TimeSpan(dataset?.Ticks));

  const [numericalData, setNumericalData] = useState<ChartistData>();
  const [frequencyData, setFrequencyData] = useState<ChartistData>();

  const [optionsFactory, setOptionsFactory] = useState<ChartistOptionsFactory>();

  useEffect(() => {
    if (!!span && !!graphDimensions) {
      setOptionsFactory(new ChartistOptionsFactory(
        span,
        graphDimensions,
        getChartZoom(span)
      ));
    }
  }, [span, graphDimensions]);

  useEffect(() => {
    if (dataset) {
      const span = new TimeSpan(dataset.Ticks);
      const zoom = getChartZoom(span);

      let numerical;
      if (dataset?.NumericalSeries.length) {
        numerical = new ChartistData(dataset, ChartistDataType.Numerical);
        const avg = (numerical.max + numerical.min) / 2;
        numerical.series.push(getSpanSeries(dataset.SeriesLabels, avg, zoom));
      }
      setNumericalData(numerical);

      let frequency;
      if (dataset?.FrequencySeries.length) {
        frequency = new ChartistData(dataset, ChartistDataType.Frequency);
        frequency.series.push(getSpanSeries(dataset.SeriesLabels, -1, zoom));
      }
      setFrequencyData(frequency);

      setSpan(span);
    }
  }, [dataset]);

  // Update width on resize
  useEffect(() => {
    if (height && width) {
      setGraphDimensions({ height, width });
    }
  }, [height, width]);

  // Set scroll position
  let graphWidth = 0;
  const onDrawHandler = (e: any) => {
    const scrollWidth = chartRef.current?.scrollWidth;
    if (!!scrollWidth && graphWidth != scrollWidth) {
      chartRef.current.scrollLeft = scrollWidth;
      graphWidth = scrollWidth;
    }
  };

  const listeners = {
    draw: (e: any) => onDrawHandler(e),
  };

  const numericalLabels = () => {
    return (
      <>
        <ChartistGraph
          data={numericalData}
          options={optionsFactory.getNumericalLabelOptions()}
          type={defaultType}
        />
      </>
    );
  };

  const frequencyLabels = (dataset: ApiDataset) => {
    return (
      <>
        <ChartistGraph
          data={frequencyData}
          options={optionsFactory.getFrequencyLabelOptions(
            dataset.FrequencySeries
          )}
          type={defaultType}
        />
      </>
    );
  };

  const numericalGraph = (dataset: ApiDataset) => {
    return (
      <>
        {renderColorStyle(
          dataset.NumericalSeries,
          'numerical',
          numericalData.series
        )}
        <ChartistGraph
          listener={listeners}
          data={numericalData}
          options={optionsFactory.getNumericalChartOptions(
            numericalData.series,
            !!frequencyData
          )}
          type={defaultType}
        />
      </>
    );
  };

  const frequencyGraph = (dataset: ApiDataset) => {
    return (
      <>
        {renderColorStyle(
          dataset.FrequencySeries,
          'frequency',
          frequencyData.series
        )}
        <ChartistGraph
          listener={listeners}
          data={frequencyData}
          options={optionsFactory.getFrequencyChartOptions(
            frequencyData.series,
            !!numericalData
          )}
          type={defaultType}
        />
      </>
    );
  };

  const blankGraph = () => {
    return (
      <ChartistGraph
        data={{}}
        options={ChartistOptionsFactory.getDefaultOptions()}
        type={defaultType}
      />
    );
  };

  return dataset ? (
    <>
      <div className="label-container">
        {numericalData && numericalLabels()}
        {frequencyData && frequencyLabels(dataset)}
      </div>
      <div className="chart-container" ref={chartRef}>
        {numericalData && numericalGraph(dataset)}
        {frequencyData && frequencyGraph(dataset)}
      </div>
    </>
  ) : (
    <div className="position-relative">
      <Alert
        variant="secondary"
        style={labelStyle}
        className="position-absolute"
      >
        {strings.graph.noDataset}
      </Alert>
      {blankGraph()}
    </div>
  );
};

export default DatasetGraph;

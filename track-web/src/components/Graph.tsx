import { map } from 'lodash';
import moment, { Moment } from 'moment';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
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

type GraphProps = {
  dataset: ApiDataset;
  defaultType?: GraphType;
};

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

const getSpanSeries = (start: Moment, end: Moment, value: any) => {
  return [
    { x: start, y: value },
    { x: end, y: value },
  ];
};

const Graph: React.FunctionComponent<GraphProps> = ({
  dataset,
  defaultType = GraphType.Line,
}) => {
  const [refWidth, setRefWidth] = useState<number>();

  const ref = useRef<HTMLHeadingElement>();
  const { width } = useResize(ref);

  const [span, setSpan] = useState<TimeSpan>(new TimeSpan(dataset?.Ticks));

  const [numericalData, setNumericalData] = useState<ChartistData>();
  const [frequencyData, setFrequencyData] = useState<ChartistData>();

  const optionsFactory = new ChartistOptionsFactory(
    span,
    refWidth,
    getChartZoom(span)
  );

  useEffect(() => {
    if (dataset) {
      const span = new TimeSpan(dataset.Ticks);
      const zoom = getChartZoom(span) as moment.unitOfTime.Base;

      const labels = dataset.SeriesLabels;
      const startDate = moment(labels[0]).startOf(zoom);
      const endDate = moment(labels[labels.length - 1])
        .add(1, zoom)
        .startOf(zoom);

      let numerical;
      if (dataset?.NumericalSeries.length) {
        numerical = new ChartistData(dataset, ChartistDataType.Numerical);
        const spanSeries = getSpanSeries(startDate, endDate, 0);
        numerical.series.push(spanSeries);
      }
      setNumericalData(numerical);

      let frequency;
      if (dataset?.FrequencySeries.length) {
        frequency = new ChartistData(dataset, ChartistDataType.Frequency);
        const spanSeries = getSpanSeries(startDate, endDate, -1);
        frequency.series.push(spanSeries);
      }
      setFrequencyData(frequency);

      setSpan(span);
    }
  }, [dataset]);

  // Set initial graph container width
  useEffect(() => {
    ref?.current?.offsetWidth && setRefWidth(ref.current.offsetWidth);
  }, [ref]);

  // Update width on resize
  useEffect(() => {
    if (width) {
      setRefWidth(width);
    }
  }, [width]);

  // Set scroll position
  let graphWidth = 0;
  const onDrawHandler = (e: any) => {
    // if (e.type === 'point') {
    //   console.log('POINT', e);
    // }
    const scrollWidth = ref.current?.scrollWidth;
    if (!!scrollWidth && graphWidth != scrollWidth) {
      ref.current.scrollLeft = scrollWidth;
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
    console.log('numerical', !!numericalData);
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
      <div className="graph-container" ref={ref}>
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

export default Graph;

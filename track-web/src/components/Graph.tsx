import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import ChartistGraph from 'react-chartist';

import { useResize } from '../hooks';
import { ApiDataset, ApiSeries } from '../models/api';
import { ChartistData } from '../models/chartist';
import { ChartistOptionsFactory, defaultColor, SERIES_PREFIXES } from '../utils/ChartistOptionsFactory';
import { TimeSpan } from '../utils/TimeSpan';
import { strings } from '../shared/strings';

type GraphProps = {
  dataset: ApiDataset;
  defaultType?: GraphType;
};

export enum GraphType {
  Bar = 'Bar',
  Line = 'Line',
}

export enum ChartZoom {
  Month,
  Day,
  Hour,
  Minute
}

const renderColorStyle = (series: ApiSeries[], className: string) => {
  return (
    <style>
      {map(series, (s, i) => {
        const prefix = SERIES_PREFIXES.substr(i, 1);
        const color = s.Color || `#${defaultColor(s.Order)}`;

        return `
          .${className} .ct-series-${prefix} .ct-line,
          .${className} .ct-series-${prefix} .ct-point {
            stroke: ${color};
          }`;
      })}
    </style>
  )
}

const getChartZoom = (span: TimeSpan): ChartZoom => {
  if (span.days > 60) {
    return ChartZoom.Month;
  } else if (span.days > 1) {
    return ChartZoom.Day;
  } else if (span.hours > 1) {
    return ChartZoom.Hour;
  }
  return ChartZoom.Minute;
}

// "No Dataset" label
const labelStyle = {
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: '0 0 0 4px #ffffffcc',
  backgroundColor: '#e2e3e5aa'
}

const Graph: React.FunctionComponent<GraphProps> = ({
  dataset,
  defaultType = GraphType.Line
}) => {
  // TODO: Toggle line/bar for frequency graph
  const [type, setType] = useState<GraphType>(defaultType);

  const [refWidth, setRefWidth] = useState<number>();

  const ref = useRef<HTMLHeadingElement>(null);
  const { width, height } = useResize(ref);

  const [span, setSpan] = useState<TimeSpan>(new TimeSpan(dataset?.Ticks));

  const optionsFactory = new ChartistOptionsFactory(span, refWidth, getChartZoom(span));

  // useEffect(() => {
  //   console.log('do do do', span, refWidth);
  //   if (span && refWidth) setOptionsFactory(new ChartistOptionsFactory(span, refWidth, getChartZoom(span)));
  // }, [span, refWidth])

  useEffect(() => {
    if (dataset) {
      setSpan(new TimeSpan(dataset.Ticks))
      // setOptionsFactory(new ChartistOptionsFactory(span, refWidth, getChartZoom(span)))
    }
  }, [dataset]);

  // Set initial width & scroll
  useEffect(() => {
    ref?.current?.offsetWidth && setRefWidth(ref.current.offsetWidth);
  }, [ref]);

  // Update width on resize
  useEffect(() => {
    if (width) {
      setRefWidth(width);
    }
  }, [width]);

  let graphWidth = 0;
  const onDrawHandler = (e: any) => {
    const scrollWidth = ref.current?.scrollWidth;
    if (!!scrollWidth && graphWidth != scrollWidth) {
      ref.current.scrollLeft = scrollWidth;
      graphWidth = scrollWidth;
    }
  }

  let hasNumericalData = dataset?.NumericalSeries.length > 0;
  let hasFrequencyData = dataset?.FrequencySeries.length > 0;

  let numericalData: ChartistData, frequencyData: ChartistData;
  if (dataset) {
    numericalData = new ChartistData(dataset.SeriesLabels, dataset.NumericalSeries);
    frequencyData = new ChartistData(dataset.SeriesLabels, dataset.FrequencySeries);
  }

  const listeners = {
    draw: (e: any) => onDrawHandler(e)
  }

  const lineLabels = () => {
    return (<>
      <ChartistGraph
        data={numericalData}
        options={optionsFactory.getNumericalLabelOptions()}
        type={type}
      />
    </>);
  };

  const frequencyLabels = (dataset: ApiDataset) => {
    return (<>
      <ChartistGraph
        data={frequencyData}
        options={optionsFactory.getFrequencyLabelOptions(dataset.FrequencySeries)}
        type={type}
      />
    </>);
  };

  const lineGraph = (dataset: ApiDataset) => {
    return (<>
      {renderColorStyle(dataset.NumericalSeries, 'numerical')}
      <ChartistGraph
        listener={listeners}
        data={numericalData}
        options={optionsFactory.getNumericalChartOptions(hasFrequencyData)}
        type={type}
      />
    </>);
  };

  const frequencyGraph = (dataset: ApiDataset) => {
    return (<>
      {renderColorStyle(dataset.FrequencySeries, 'frequency')}
      <ChartistGraph
        listener={listeners}
        data={frequencyData}
        options={optionsFactory.getFrequencyChartOptions(dataset.FrequencySeries, hasNumericalData)}
        type={type}
      />
    </>);
  };

  const blankGraph = () => {
    return (<ChartistGraph
      data={{}}
      options={ChartistOptionsFactory.getDefaultOptions()}
      type={type}
    />);
  }

  return dataset ?
    (
      <>
        <div className="label-container">
          {hasNumericalData && lineLabels()}
          {hasFrequencyData && frequencyLabels(dataset)}
        </div>
        <div className="graph-container" ref={ref}>
          {hasNumericalData && lineGraph(dataset)}
          {hasFrequencyData && frequencyGraph(dataset)}
        </div>
      </>
    )
    :
    (
      <div className="position-relative">
        <Alert variant="secondary" style={labelStyle} className="position-absolute">
          {strings.graph.noDataset}
        </Alert>
        {blankGraph()}
      </div>
    );
}

export default Graph;
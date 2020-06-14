import * as React from "react"
import ChartistGraph from 'react-chartist';
import { map } from 'lodash';
import moment = require("moment");
import { useState, useRef, useEffect } from "react";
import { ChartistOptions, SERIES_PREFIXES, DEFAULT_CHARTIST_COLORS } from "../models/ChartistOptions";
import { ApiDataset } from "../models/ApiDataset";
import { SeriesType } from "../shared/enums";
import { ApiSeries } from "../models/ApiSeries";
import Alert from "react-bootstrap/Alert";
import { ChartistData } from "../models/ChartistData";
import { useResize } from "../hooks/useResize";
import { TimeSpan } from "../interfaces/TimeSpan";

type GraphProps = {
  dataset: ApiDataset;
  defaultType?: GraphType;
};

export enum GraphType {
  Bar = 'Bar',
  Line = 'Line',
}

const renderColorStyle = (series: ApiSeries[], className: string) => {
  return (
    <style>
      {map(series, (s, i) => {
        const prefix = SERIES_PREFIXES.substr(i, 1);
        const color = s.Color || DEFAULT_CHARTIST_COLORS[s.Order];

        return `
          .${className} .ct-series-${prefix} .ct-line,
          .${className} .ct-series-${prefix} .ct-point {
            stroke: ${color};
          }`;
      })}
    </style>
  )
}

// "No Dataset" label
const labelStyle = {
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: '0 0 0 4px #ffffffcc',
  backgroundColor: '#e2e3e5aa'
}

const convertTimeSpan = (ticks: number): TimeSpan => {
  const seconds = Math.round(ticks / 10000000);
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  console.log('days', days);
  console.log('hours', hours);
  console.log('minutes', minutes);

  return {
    days,
    hours,
    minutes,
    seconds
  } as TimeSpan;
}

const calcChartWidth = (span: TimeSpan, refWidth: number): number => {

  const chartWidth = span.days * 100;
  const zoom = refWidth / chartWidth;

  // console.log('CHART WIDTH', chartWidth);
  // console.log('REF WIDTH', refWidth)
  // console.log('ZOOM', zoom);

  return chartWidth < refWidth ? chartWidth * zoom : chartWidth;
}

const Graph: React.FunctionComponent<GraphProps> = ({
  dataset,
  defaultType = GraphType.Line
}) => {
  // TODO: Toggle line/bar for frequency graph
  const [type, setType] = useState<GraphType>(defaultType);
  const [chartWidth, setChartWidth] = useState<number>();

  const ref = useRef<HTMLHeadingElement>(null);
  const { width, height } = useResize(ref);

  const span = convertTimeSpan(dataset.Ticks);

  useEffect(() => {
    if (width && height)
      setChartWidth(calcChartWidth(span, width));
  }, [width, height]);

  // Set initial width
  useEffect(() => {
    setChartWidth(calcChartWidth(span, ref.current.offsetWidth));
  }, [ref.current, dataset]);

  const options = new ChartistOptions(dataset, span);
  options.apply({ width: chartWidth });


  let hasNumericalData, hasFrequencyData;
  if (dataset) {
    hasNumericalData = dataset.NumericalSeries.length > 0;
    hasFrequencyData = dataset.FrequencySeries.length > 0;
  }

  const lineLabels = (dataset: ApiDataset) => {
    return (<>
      <ChartistGraph
        data={new ChartistData(dataset.SeriesLabels, dataset.NumericalSeries)}
        options={options.getNumericalLabelOptions()}
        type={type}
      />
    </>);
  }

  const lineGraph = (dataset: ApiDataset) => {
    return (<>
      {renderColorStyle(dataset.NumericalSeries, 'numerical')}
      <ChartistGraph
        data={new ChartistData(dataset.SeriesLabels, dataset.NumericalSeries)}
        options={options.getNumericalOptions()}
        type={type}
      />
    </>);
  };

  const frequencyLabels = (dataset: ApiDataset, hideLabels: boolean) => {
    return (<>
      <ChartistGraph
        data={new ChartistData(dataset.SeriesLabels, dataset.FrequencySeries)}
        options={options.getFrequencyLabelOptions(dataset.FrequencySeries)}
        type={type}
      />
    </>);
  }

  const frequencyGraph = (dataset: ApiDataset, hideLabels: boolean) => {
    return (<>
      {renderColorStyle(dataset.FrequencySeries, 'frequency')}
      <ChartistGraph
        data={new ChartistData(dataset.SeriesLabels, dataset.FrequencySeries)}
        options={options.getFrequencyOptions(dataset.FrequencySeries, hideLabels)}
        type={type}
      />
    </>);
  };

  const blankGraph = () => {
    return (<ChartistGraph
      data={{}}
      options={options.getNumericalOptions()}
      type={type}
    />);
  }

  return dataset ?
    (
      <>
        <div className="label-container">
          {hasNumericalData && lineLabels(dataset)}
          {hasFrequencyData && frequencyLabels(dataset, hasNumericalData)}
        </div>
        <div className="graph-container" style={{ overflowX: 'scroll' }} ref={ref}>
          {hasNumericalData && lineGraph(dataset)}
          {hasFrequencyData && frequencyGraph(dataset, hasNumericalData)}
        </div>
      </>
    )
    :
    (
      <div className="position-relative">
        <Alert variant="secondary" style={labelStyle} className="position-absolute">
          No Dataset
        </Alert>
        {blankGraph()}
      </div>
    );
}

export default Graph;
import * as React from "react"
import ChartistGraph from 'react-chartist';
import { map } from 'lodash';
import moment = require("moment");
import { useState, useRef, useEffect } from "react";
import { ChartistOptionsFactory, SERIES_PREFIXES, DEFAULT_CHARTIST_COLORS } from "../models/ChartistOptions";
import { ApiDataset } from "../models/ApiDataset";
import { SeriesType } from "../shared/enums";
import { ApiSeries } from "../models/ApiSeries";
import Alert from "react-bootstrap/Alert";
import { ChartistData } from "../models/ChartistData";
import { useResize } from "../hooks/useResize";
import { TimeSpan } from "../models/TimeSpan";

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

const calcZoom = (span: TimeSpan): ChartZoom => {
  return span.days > 15 ? ChartZoom.Month : ChartZoom.Day;
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

  const span = new TimeSpan(dataset.Ticks);

  let zoomMode;
  if (span.days > 15) {
    zoomMode = ChartZoom.Month;
  } else if (span.days > 1) {
    zoomMode = ChartZoom.Day;
  } else if (span.hours > 1) {
    zoomMode = ChartZoom.Hour;
  } else {
    zoomMode = ChartZoom.Minute;
  }

  const optionsFactory = new ChartistOptionsFactory(span, refWidth, zoomMode);

  // Set initial width
  useEffect(() => {
    setRefWidth(ref.current.offsetWidth);
  }, [ref.current, dataset]);

  // Update width on resize
  useEffect(() => {
    if (width) {
      setRefWidth(width);
    }
  }, [width]);

  let hasNumericalData = dataset?.NumericalSeries.length > 0;
  let hasFrequencyData: boolean,
    numericalData: ChartistData,
    frequencyData: ChartistData;
  if (dataset) {
    numericalData = new ChartistData(dataset.SeriesLabels, dataset.NumericalSeries);

    hasFrequencyData = dataset.FrequencySeries.length > 0;
    frequencyData = new ChartistData(dataset.SeriesLabels, dataset.FrequencySeries);
  }

  const lineLabels = () => {
    return (<>
      <ChartistGraph
        data={numericalData}
        options={optionsFactory.getNumericalLabelOptions()}
        type={type}
      />
    </>);
  }

  const lineGraph = (dataset: ApiDataset) => {
    return (<>
      {renderColorStyle(dataset.NumericalSeries, 'numerical')}
      <ChartistGraph
        data={numericalData}
        options={optionsFactory.getNumericalChartOptions(hasFrequencyData)}
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
  }

  const frequencyGraph = (dataset: ApiDataset) => {
    return (<>
      {renderColorStyle(dataset.FrequencySeries, 'frequency')}
      <ChartistGraph
        data={frequencyData}
        options={optionsFactory.getFrequencyChartOptions(dataset.FrequencySeries, hasNumericalData)}
        type={type}
      />
    </>);
  };

  const blankGraph = () => {
    return (<ChartistGraph
      data={{}}
      options={optionsFactory.getNumericalChartOptions()}
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
          No Dataset
        </Alert>
        {blankGraph()}
      </div>
    );
}

export default Graph;
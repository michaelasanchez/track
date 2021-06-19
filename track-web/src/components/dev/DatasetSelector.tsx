import { map } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { useCategoryService, useDatasetService } from '../../App';
import { Category, Dataset } from '../../models/odata';

const groupBy = (collection: any[], property: string) => {
  let i = 0,
    val,
    index,
    values = [],
    result = {} as any;
  for (; i < collection.length; i++) {
    val = collection[i][property];
    index = values.indexOf(val);
    if (index > -1) result[val].push(collection[i]);
    else {
      values.push(val);
      result[val] = [collection[i]];
    }
  }
  return result;
};

export const DatasetSelector: React.FunctionComponent<{}> = (props) => {
  const { datasetList, datasetListLoading, loadDatasetList } =
    useDatasetService();
  const { categoryList, categoryListLoading } = useCategoryService();

  const [groupedDatasets, setGroupedDatasets] = useState<Dataset[][]>([]);
  const [defaultActiveKey, setDefaultActiveKey] = useState<number>();

  // useEffect(() => {
  //   loadDatasetList();
  // }, []);

  useEffect(() => {
    const groupedDatasetList = groupBy(datasetList, 'CategoryId');
    const defaultKey = Object.keys(groupedDatasetList)[0];

    setGroupedDatasets(groupBy(datasetList, 'CategoryId'));
    setDefaultActiveKey(parseInt(defaultKey));
  }, [datasetList]);

  return (
    <>
      <Accordion defaultActiveKey={defaultActiveKey?.toString()}>
        {map(categoryList, (c: Category, i: number) => {
          const eventKey = i.toString();

          const hasDatasets = !!groupedDatasets[i];

          return (
            hasDatasets && (
              <Card key={i}>
                <Accordion.Toggle as={Card.Header} eventKey={eventKey}>
                  {c.Label}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={eventKey}>
                  <Card.Body>
                    {map(groupedDatasets[i], (d) => (
                      <li key={i.toString()}>{d.Label}</li>
                    ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            )
          );
        })}
      </Accordion>
    </>
  );
};

import { map } from 'lodash';
import { FunctionComponent } from 'react';
import React from 'react';
import { Alert } from 'react-bootstrap';

type LoadingProps = {
  errors?: any[];
}

export const Loading: FunctionComponent<LoadingProps> = ({ errors }) => {

  const renderErrors = (errors: any[]) => {
    return (
      <>
        {/* <p>Something went wrong...</p> */}
        {map(errors, (e: any, i: number) => {
          return <Alert key={i} variant="danger">
            {e.message}
          </Alert>
        })}
      </>
    )
  }

  return (
    <div className="h-100 d-flex flex-column align-items-center justify-content-center">
      {errors.length ?
        renderErrors(errors)
        :
        'Loading...'}
    </div>);
}
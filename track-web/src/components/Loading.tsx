import { FunctionComponent } from "react";
import React from "react";
import { map } from "lodash";
import { Alert } from "react-bootstrap";

type LoadingProps = {
  errors?: any[];
}

export const Loading: FunctionComponent<LoadingProps> = ({ errors }) => {

  // if (errors) console.log('WE GOT ERRORS', errors);

  const renderErrors = (errors: any[]) => {
    return (
      <>
        {/* <p>Something went wrong...</p> */}
        {map(errors, (e: string, i: number) => {
          return <Alert key={i} variant="danger">
            {e}
          </Alert>
        })}
      </>
    )
  }

  return (
    <div className="h-100 d-flex flex-column align-items-center justify-content-center">
      {errors ?
        renderErrors(errors)
        :
        'Loading...'}
    </div>);
}
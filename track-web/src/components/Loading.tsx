import { FunctionComponent } from "react";
import React from "react";

type LoadingProps = {
  error?: string;
  errors?: string[];
}

export const Loading: FunctionComponent<LoadingProps> = ({ error, errors }) => {

  return (<div className="h-100 d-flex align-items-center justify-content-center">Loading...</div>);
}
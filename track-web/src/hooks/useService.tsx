import { useState } from 'react';
import { useAuthContext } from '../Auth';
import { DatasetService } from './services';

export const useService = () => {
  const { token } = useAuthContext();

  const dataset = DatasetService(token);

  return { dataset };
};

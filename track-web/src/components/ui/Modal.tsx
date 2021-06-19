import { ToolbarAction } from './Toolbar';
import { Modal as BSModal, Button } from 'react-bootstrap';
import React from 'react';
import { Link } from 'react-router-dom';

const HtmlToReactParser = require('html-to-react').Parser;

var htmlToReactParser = new HtmlToReactParser();

export interface ModalProps {
  show?: boolean;
  state: IModalState;
}

// TODO: Decouple from ToolbarAction
export interface IModalState {
  title: string;
  body?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: string;
}

export enum ModalAction {
  Confirm,
  Cancel,
}

export const Modal: React.FunctionComponent<ModalProps> = ({
  show,
  state,
}) => {

  return (
    <BSModal
      show={show}
      onHide={state?.onCancel}
      animation={false}
    >
      <BSModal.Header closeButton>
        <BSModal.Title>{state?.title || 'Well?'}</BSModal.Title>
      </BSModal.Header>
      {state?.body && (
        <BSModal.Body>{htmlToReactParser.parse(state.body)}</BSModal.Body>
      )}
      <BSModal.Footer>
        <Button
          variant="secondary"
          onClick={state?.onCancel}
        >
          {state?.cancelLabel || 'Cancel'}
        </Button>
        <Link
          to={`/`}
          onClick={state?.onConfirm}
        >
          <Button variant={(state?.variant as any) || 'outline-danger'}>{state?.confirmLabel || 'Confirm'}</Button>
        </Link>
      </BSModal.Footer>
    </BSModal>
  );
};

import * as React from 'react';
import { Form } from 'react-bootstrap';
import { BlockPicker, Color, TwitterPicker, CompactPicker } from 'react-color';
import { useState, useRef, useEffect } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

const DEF_COLOR = 'd70206';
const DEFAULT_PICKER_COLORS = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'];

type ColorPickerProps = {
  defaultColor: Color;
  className?: string;
  onChange: Function;
  disabled?: boolean;
};

const ColorPicker: React.FunctionComponent<ColorPickerProps> = ({ defaultColor, className = null, onChange, disabled }) => {
  const [showing, setShowing] = useState<boolean>(false);
  const [color, setColor] = useState<Color>(defaultColor || DEF_COLOR);

  const handleChange = (e: any) => {
    setColor(e.hex);
    onChange(e);
  }

  const handleClick = (e: any) => {
    e.preventDefault();
    setShowing(!showing);
  }

  var colorString = color.toString();
  colorString = colorString.indexOf('#') < 0 ? `#${colorString}` : colorString;

  const notsure = (e: any) => {
    // TODO: Getting an error when we remove onChange from Form.Control ?
    console.log('ColorPicker onChange', e);
  }

  const wrapperRef = useRef(null);
  let clickedOutside = useClickOutside(wrapperRef);

  useEffect(() => {
    setShowing(false);
  }, [clickedOutside]);

  return (
    <div className="color-picker">
      {/* <div className="thing"> */}
      <div className="input-container">
        <Form.Control type="color" onChange={notsure} value={colorString} onClick={(e: any) => handleClick(e)} className={className} disabled={disabled} />
      </div>
      {/* </div> */}

      {showing && <div className="picker-container" ref={wrapperRef}>
        <CompactPicker
          color={color}
          onChange={handleChange}
          
        />
      </div>}
    </div>
  );
}

export default ColorPicker;
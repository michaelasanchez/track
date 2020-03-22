import * as React from 'react';
import { Form } from 'react-bootstrap';
import { BlockPicker, Color, TwitterPicker } from 'react-color';
import { useState } from 'react';


type ColorPickerProps = {
  defaultColor: Color;
  onChange: Function;
};

const ColorPicker: React.FunctionComponent<ColorPickerProps> = ({ defaultColor, onChange }) => {
  const [showing, setShowing] = useState<boolean>(false);
  const [color, setColor] = useState<Color>(defaultColor);

  const handleChange = (e: any) => {
    setColor(e.hex);
    onChange(e);
  }

  const handleClick = (e: any) => {
    e.preventDefault();
    setShowing(!showing);
  }

  var colorString = color.toString();
  colorString = colorString.length == 6 ? `#${colorString}` : colorString;

  const notsure = (e: any) => {
    // TODO: Getting an erro when we remore onChange from Form.Control ?
    console.log('ColorPicker onChange', e);
  }

  return (
    <div className="color-picker">
      <Form.Control type="color" onChange={notsure} value={colorString} onClick={(e: any) => handleClick(e)}/>
      {showing && <div className="picker-container">
        <TwitterPicker
          color={color}
          colors={['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF']}
          onChange={handleChange}
          triangle={'hide'}
          // onChangeComplete={testing}
        />
      </div>}
    </div>
  );
}

export default ColorPicker;
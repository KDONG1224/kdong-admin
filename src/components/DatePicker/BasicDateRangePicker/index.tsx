import React from 'react';
import { StyledBasicDateRangePicker } from './style';
import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';

type BasicDateRangePickerProps = RangePickerProps & {};

export const BasicDateRangePicker: React.FC<BasicDateRangePickerProps> = ({
  ...props
}) => {
  return (
    <StyledBasicDateRangePicker>
      <DatePicker.RangePicker {...props} />
    </StyledBasicDateRangePicker>
  );
};

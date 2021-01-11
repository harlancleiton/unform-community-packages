import React from 'react';

import { SelectProps as BaseSelectProps } from '@material-ui/core/Select/Select';

export interface SelectOption {
  value: string | number;
  text: string | React.ReactNode;
}

export interface SelectProps extends Omit<BaseSelectProps, 'name'> {
  name: string;
  options?: SelectOption[];
  clearErrorOnFocus?: boolean;
}

export type SelectFocusHandler = (
  event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>,
) => void;

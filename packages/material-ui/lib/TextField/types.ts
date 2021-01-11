import React from 'react';

import { TextFieldProps as BaseTextFieldProps } from '@material-ui/core/TextField/TextField';

export type TextFieldProps = BaseTextFieldProps & {
  name: string;
  clearErrorOnFocus?: boolean;
};

export type TextFieldFocusHandler = (
  event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) => void;

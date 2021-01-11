import React, { useRef, useEffect, useState, useCallback } from 'react';

import { TextField as BaseTextField } from '@material-ui/core';
import { useField } from '@unform/core';

import { printWarning } from '../debug';
import { TextFieldProps, TextFieldFocusHandler } from './types';

const TextField: React.FC<TextFieldProps> = ({
  name,
  helperText,
  defaultValue,
  InputLabelProps,
  onFocus,
  clearErrorOnFocus = true,
  ...restProps
}) => {
  if (!name) {
    printWarning(
      'TextField component must have a `name` property for correctly working.',
    );
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const {
    fieldName,
    defaultValue: defaultFieldValue,
    registerField,
    clearError,
    error,
  } = useField(name);
  const defaultInputValue = defaultValue ?? defaultFieldValue;
  const [shrink, setShrink] = useState<boolean>(!!defaultInputValue);

  useEffect(() => {
    if (fieldName) {
      registerField({
        name: fieldName,
        ref: inputRef.current,
        path: 'value',
        clearValue(ref, resetValue: string) {
          const newValue = resetValue ?? defaultInputValue ?? '';
          ref.value = newValue;
          setShrink(!!newValue);
        },
        setValue(ref: HTMLInputElement, value: string) {
          if (ref) {
            const newValue = value ?? '';
            ref.value = newValue;
            setShrink(!!newValue);
          }
        },
      });
    }
  }, [fieldName, registerField, defaultInputValue, setShrink]);

  useEffect(() => {
    const input = inputRef.current;

    function handlerFocusEvent(evt: FocusEvent) {
      const inputValue = (evt.currentTarget as HTMLInputElement).value;
      if (!inputValue) setShrink(true);
    }

    function handlerBlurEvent(evt: FocusEvent) {
      const inputValue = (evt.target as HTMLInputElement).value;
      if (!inputValue) setShrink(false);
    }

    if (input) {
      input.addEventListener('focus', handlerFocusEvent);
      input.addEventListener('blur', handlerBlurEvent);
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handlerFocusEvent);
        input.removeEventListener('blur', handlerBlurEvent);
      }
    };
  }, [inputRef]);

  const handleOnFocus = useCallback<TextFieldFocusHandler>(
    event => {
      if (clearErrorOnFocus) clearError();

      if (onFocus) onFocus(event);
    },
    [clearError, clearErrorOnFocus, onFocus],
  );

  return (
    <BaseTextField
      {...restProps}
      name={fieldName}
      error={!!error}
      helperText={error || helperText}
      inputRef={inputRef}
      defaultValue={defaultInputValue}
      onFocus={handleOnFocus}
      InputLabelProps={{
        ...InputLabelProps,
        shrink: InputLabelProps?.shrink ?? shrink,
      }}
    />
  );
};

export default React.memo(TextField);

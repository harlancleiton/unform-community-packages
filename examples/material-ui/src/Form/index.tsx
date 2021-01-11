import React, { useCallback } from 'react';

import * as Yup from 'yup';

import { Button, Grid, CircularProgress, MenuItem } from '@material-ui/core';
import { SubmitHandler, FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { TextField, Select } from '../../../../packages/material-ui/lib';
import { useRandomPerson } from './useRandomPerson';

const FormWrapper: React.FC = () => {
  const formRef = React.useRef<FormHandles>(null);
  const { loading, loadNewPerson } = useRandomPerson();
  const [data, setData] = React.useState({});

  const loadData = useCallback(async () => {
    const person = await loadNewPerson();
    formRef.current?.setData({ ...person, yesno: 1, truefalse: true });
  }, [loadNewPerson]);

  const handleSubmit = useCallback<SubmitHandler>(async formData => {
    try {
      setData(formData);

      const schema = Yup.object().shape({
        name: Yup.object().shape({
          first: Yup.string().required('Required'),
          last: Yup.string().required('Required'),
        }),
        email: Yup.string()
          .email('Invalid email')
          .required('Required'),
        gender: Yup.string().required('Required'),
        yesno: Yup.string().required('Required'),
        truefalse: Yup.string().required('Required'),
      });

      await schema.validate(formData, { abortEarly: false });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = {};

        error.inner.forEach(err => {
          if (err.path) errors[err.path] = err.message;
        });

        formRef.current?.setErrors(errors);
      }
    }
  }, []);

  return (
    <>
      <Form
        ref={formRef}
        onSubmit={handleSubmit}
        initialData={{
          email: 'foo@bar.com',
        }}
        id="formdata"
      >
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="name.first"
              label="First Name"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="name.last"
              label="Last Name"
              clearErrorOnFocus={false}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth name="email" label="E-mail" />
          </Grid>
          <Grid item xs={6}>
            <Select name="gender" label="Gender" variant="outlined" fullWidth>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Select
              name="yesno"
              label="Yes or No?"
              variant="outlined"
              fullWidth
            >
              <MenuItem value={0}>0 - No</MenuItem>
              <MenuItem value={1}>1 - Yes</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Select
              name="truefalse"
              label="true or false?"
              variant="outlined"
              fullWidth
              clearErrorOnFocus={false}
            >
              <MenuItem value={false}>False</MenuItem>
              <MenuItem value>True</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Form>
      <div className="action-buttons">
        <Button
          color="primary"
          type="submit"
          variant="contained"
          size="small"
          form="formdata"
        >
          Submit
        </Button>
        <Button
          color="secondary"
          type="button"
          variant="contained"
          size="small"
          onClick={() => {
            formRef?.current?.reset({ email: 'test' });
          }}
        >
          Reset
        </Button>
        <Button
          type="button"
          variant="contained"
          size="small"
          onClick={loadData}
          disabled={loading}
        >
          {loading && <CircularProgress size={18} />}
          Load data
        </Button>
      </div>
      <code>
        <pre>{JSON.stringify(data, null, 3)}</pre>
      </code>
    </>
  );
};

export default FormWrapper;

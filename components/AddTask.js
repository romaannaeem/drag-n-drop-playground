import React from 'react';
import { Formik, Field, Form } from 'formik';

export default function AddTask(props) {
  return (
    <Formik
      initialValues={{
        taskName: '',
      }}
      onSubmit={props.onFormSubmit}
    >
      <Form>
        <label htmlFor="taskName">First Name</label>
        <Field id="taskName" name="taskName" placeholder="Do the dishes" />
        <button type="submit">Add Task</button>
      </Form>
    </Formik>
  );
}

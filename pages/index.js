import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import styled from 'styled-components';
import { DragDropContext, resetServerContext } from 'react-beautiful-dnd';
import initialData from '../data';
import Column from '../components/Column';
import AddTask from '../components/AddTask';
import styles from '../styles/Home.module.css';

const Container = styled.div`
  display: flex;
`;

export default function Home() {
  const [data, setData] = useState(initialData);

  const onDragStart = () => {
    document.body.style.color = '#777';
  };

  const onDragUpdate = (update) => {
    // const { destination } = update;
    // const opacity = destination
    //   ? destination.index / Object.keys(state.tasks).length
    //   : 0;
    // document.body.style.backgroundColor = `rgba(25, 25, 150, ${opacity})`;
  };

  const onDragEnd = (result) => {
    document.body.style.color = 'inherit';
    document.body.style.backgroundColor = 'inherit';

    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
    } else {
      // Moving from one list to another
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);

      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);

      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };
      setData(newState);
    }
  };

  const onFormSubmit = (values) => {
    console.log(values);
    const oldState = data;

    const newTaskId = `task-${data.count + 1}`;

    const newState = {
      ...oldState,
      count: ++oldState.count,
      tasks: {
        ...oldState.tasks,
        [newTaskId]: { id: newTaskId, content: values.taskName },
      },
      columns: {
        ...oldState.columns,
        'column-1': {
          id: 'column-1',
          title: 'To do',
          taskIds: [...oldState.columns['column-1'].taskIds, newTaskId],
        },
      },
    };

    setData(newState);
  };

  return (
    <>
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragUpdate={onDragUpdate}
        onDragStart={onDragStart}
      >
        <Container>
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </Container>
      </DragDropContext>
      <br />
      <AddTask onFormSubmit={onFormSubmit} />
    </>
  );
}

export const getServerSideProps = async ({ query }) => {
  resetServerContext(); // <-- CALL RESET SERVER CONTEXT, SERVER SIDE

  return { props: { data: [] } };
};

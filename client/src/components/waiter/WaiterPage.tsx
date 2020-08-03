import React, { useState, useContext, useEffect } from 'react';
import WaiterLinkForm from './WaiterLinkForm';
import withServiceContext, {
  ServiceContext
} from '../../context/ServiceContext';
import { AuthContext } from '../../context/AuthContext';
import { IOrder, IDBCourse } from '../../../../types';
import WaiterOrder from './WaiterOrder';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme =>
  createStyles({
    orderList: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(1),
      width: '100%',
      maxWidth: 350,
      margin: 10
    }
  })
);

function WaiterPage() {
  const classes = useStyle();
  const { serviceRef } = useContext(ServiceContext);
  const { userId } = useContext(AuthContext);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [courses, setCourses] = useState<IDBCourse[]>([]);

  useEffect(() => {
    let unsubscribe: () => void;

    if (serviceRef) {
      unsubscribe = serviceRef
        .collection('orders')
        .where('waiterId', '==', userId)
        .onSnapshot(
          snap => {
            setOrders(snap.docs.map(doc => doc.data()) as IOrder[]);
          },
          err =>
            console.error(
              "ERROR IN GETTING WAITER'S ORDERS",
              err.message,
              err.stack
            )
        );
    }
    return () => {
      if (serviceRef) unsubscribe();
    };
  }, [serviceRef, userId]);

  useEffect(() => {
    let unsubscribe: () => void;

    if (serviceRef && orders.length !== 0) {
      unsubscribe = serviceRef
        .collection('courses')
        .where(
          'orderNum',
          'in',
          orders.map(order => order.orderNum)
        )
        .onSnapshot(
          snap => {
            setCourses(snap.docs.map(doc => doc.data()) as IDBCourse[]);
          },
          err =>
            console.error(
              "ERROR IN GETTING WAITER'S ORDERS",
              err.message,
              err.stack
            )
        );
    }
    return () => {
      if (serviceRef && orders.length !== 0) unsubscribe();
    };
  }, [serviceRef, orders]);
  return (
    <div className={classes.orderList}>
      <WaiterLinkForm />
      {orders.map(({ orderNum, tableNum }) => (
        <WaiterOrder
          key={orderNum}
          orderNum={orderNum}
          tableNum={tableNum}
          courses={courses.filter(course => course.orderNum === orderNum)}
        />
      ))}
    </div>
  );
}

export default withServiceContext(WaiterPage);

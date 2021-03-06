import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import { IDish } from '../../../../types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Typography from '@material-ui/core/Typography';
import GeneralDish from '../GeneralDish';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import { ServiceContext } from '../../context/ServiceContext';

interface IKitchenCourse {
  orderNum: number;
  courseId: string;
  note: string;
  dishes: IDish[];
}

const useStyle = makeStyles(theme =>
  createStyles({
    course: {
      width: '100%',
      padding: theme.spacing(1)
    },
    topRow: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: theme.spacing(1)
    },
    expandIcon: {
      transition: '0.2s ease-out'
    },
    note: {
      padding: theme.spacing(2)
    }
  })
);

const KitchenCourse: React.FunctionComponent<IKitchenCourse> = props => {
  const classes = useStyle();
  const { orderNum, note, dishes, courseId } = props;
  const { serviceRef } = useContext(ServiceContext);

  const makeCourseReady = () => {
    serviceRef
      .collection('courses')
      .doc(courseId)
      .set({ status: 'ready' }, { merge: true })
      .catch(err => {
        console.error(
          'ERROR IN SETTING THE COURSE READY',
          err.stack,
          err.message
        );
      });
  };

  return (
    <Paper elevation={4} className={classes.course}>
      <div className={classes.topRow}>
        <Typography color="primary" variant="h5">
          O:{orderNum}
        </Typography>
        <IconButton color="secondary" onClick={makeCourseReady}>
          <DoneIcon />
        </IconButton>
      </div>
      {dishes.map(({ shortName, qt }) => (
        <GeneralDish key={shortName} shortName={shortName} qt={qt} />
      ))}
      {note !== '' && <Typography className={classes.note}>{note}</Typography>}
    </Paper>
  );
};

export default React.memo(KitchenCourse);

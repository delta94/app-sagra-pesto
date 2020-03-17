import React, { useContext, useState } from 'react';
import { IStorageDish } from '../../../types';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import Checkbox from '@material-ui/core/Checkbox';
import { useTheme, makeStyles, createStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { StorageContext } from '../../context/StorageContext';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import { ServiceContext } from '../../context/ServiceContext';

interface IStorageDishProps {
  storageDish: IStorageDish;
}
const useStyle = makeStyles(theme =>
  createStyles({
    dish: {
      display: 'flex',
      height: 50,
      alignItems: 'center'
    }
  })
);

const StorageDish: React.FunctionComponent<IStorageDishProps> = ({
  storageDish
}) => {
  const classes = useStyle();
  const { name, price, storageQt, shortName, isInMenu } = storageDish;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const { storageDishes, storageRef } = useContext(StorageContext);
  const { service } = useContext(ServiceContext);

  const { startingDishes } = service || {};

  let startingDishQt = startingDishes?.find(
    dish => dish.shortName === shortName
  ).qt;

  const [editing, setEditing] = useState(false);
  const [inputPrice, setInputPrice] = useState(price);
  const [inputQt, setInputQt] = useState(storageQt);

  const changeInMenu = () => {
    storageDishes.find(dish => dish.name === name).isInMenu = !isInMenu;
    storageRef.set({ storageDishes });
  };

  const setQtAndPrice = () => {
    storageDishes.find(dish => dish.name === name).price = inputPrice;
    storageDishes.find(dish => dish.name === name).storageQt = inputQt;

    storageRef.set({ storageCourses: storageDishes });
  };
  return (
    <div className={classes.dish}>
      <Typography variant="body1" style={{ flex: 4 }}>
        {isMobile ? shortName : name}
      </Typography>
      <Divider orientation="vertical" />
      {editing ? (
        <TextField
          size="small"
          style={{ flex: 2 }}
          inputProps={{ min: 0, style: { textAlign: 'center' } }}
          type="number"
          value={inputQt}
          variant="outlined"
          onChange={e => setInputQt(Number(e.target.value))}
        />
      ) : (
        <Typography align="center" variant="body1" style={{ flex: 2 }}>
          {storageQt}
        </Typography>
      )}
      <Divider orientation="vertical" />
      {editing ? (
        <TextField
          size="small"
          type="number"
          style={{ flex: 2 }}
          inputProps={{ min: 0, style: { textAlign: 'center' } }}
          value={inputPrice}
          variant="outlined"
          onChange={e => setInputPrice(Number(e.target.value))}
        />
      ) : (
        <Typography align="center" variant="body1" style={{ flex: 2 }}>
          € {price}
        </Typography>
      )}
      <Divider orientation="vertical" />
      {startingDishQt ? (
        <Typography
          align="center"
          variant="body1"
          color="primary"
          style={{ flex: 2 }}
        >
          {startingDishQt - storageQt}
        </Typography>
      ) : null}
      <Divider orientation="vertical" />
      {editing ? (
        <>
          <CancelIcon
            alignmentBaseline="text-after-edge"
            color="secondary"
            style={{ flex: 1 }}
            onClick={() => {
              setEditing(false);
            }}
          />
          <CheckIcon
            alignmentBaseline="text-after-edge"
            color="secondary"
            style={{ flex: 1 }}
            onClick={() => {
              setEditing(!editing);
              setQtAndPrice();
            }}
          />
        </>
      ) : (
        <EditIcon
          alignmentBaseline="text-after-edge"
          color="secondary"
          style={{ flex: 2 }}
          onClick={() => setEditing(!editing)}
        />
      )}
      <Checkbox style={{ flex: 1 }} checked={isInMenu} onClick={changeInMenu} />
    </div>
  );
};

export default StorageDish;

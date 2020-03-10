import * as React from 'react';
import { IPrepCourse, IDish } from '../../types';

export enum ActionType {
  AddDish = 'AddDish',
  RemoveDish = 'RemoveDish'
}

export interface ICashRegisterReducerState {
  orderNum: number | undefined;
  courses: IPrepCourse[];
  dishes: IDish[];
}

export interface ICashRegisterAction {
  type: ActionType;
  payload: {
    dishShortName: string;
  };
}

export const initialCashRegsiterState: ICashRegisterReducerState = {
  orderNum: undefined,
  courses: [],
  dishes: []
};

const addDish = (
  prevState: ICashRegisterReducerState,
  dishShortName: string
): ICashRegisterReducerState => {
  const newState = { ...prevState };
  const isDishAlreadyInOrder = newState.dishes.some(
    dish => dish.shortName === dishShortName
  );

  if (isDishAlreadyInOrder)
    newState.dishes.find(dish => dish.shortName === dishShortName).qt++;
  else newState.dishes.push({ shortName: dishShortName, qt: 1 });
  return newState;
};

const removeDish = (
  prevState: ICashRegisterReducerState,
  dishShortName: string
): ICashRegisterReducerState => {
  const newState = { ...prevState };
  const isDishAlreadyInOrder = newState.dishes.some(
    dish => dish.shortName === dishShortName
  );

  if (isDishAlreadyInOrder)
    newState.dishes.find(dish => dish.shortName === dishShortName).qt--;

  return newState;
};

const CashRegisterReducer: React.Reducer<
  ICashRegisterReducerState,
  ICashRegisterAction
> = (state, action) => {
  switch (action.type) {
    case ActionType.AddDish:
      return addDish(state, action.payload.dishShortName);
    case ActionType.RemoveDish:
      return removeDish(state, action.payload.dishShortName);
    default:
      throw new Error();
  }
};

export default CashRegisterReducer;
// const ComplexState = () => {
//   const [state, dispatch] = React.useReducer<React.Reducer<IState, IAction>>(CashRegisterReducer, initialState);

//   return (
//     <div>
//       <div>Count: {state.count}</div>
//       <button onClick={
//         () => dispatch({type: ActionType.AddDish, payload: { count: 1 } })
//       }>+</button>
//       <button onClick={
//         () => dispatch({type: ActionType.RemoveDish, payload: { count: 1 }})
//       }>-</button>
//     </div>
//   );

const redux = require("redux");
const createStore = redux.createStore;
const BUY_CAKE = "BUY_CAKE";

function buycake() {
  return {
    type: "BUY_CAKE",
    info: "first redux store",
  };
}
//(previousState, action) => newState

const initialState = {
  numberOfCakes: 10,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "BUY_CAKE":
      return {
        ...state,
        numberOfCakes: state.numberOfCakes - 1,
      };
    default:
      return state;
  }
};

const store = createStore(reducer);
console.log(store.getState());
const unsubscribe = store.subscribe(() =>
  console.log("Update State", store.getState())
);
store.dispatch(buycake());
store.dispatch(buycake());
store.dispatch(buycake());
unsubscribe();

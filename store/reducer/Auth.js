import {LOGIN} from '../action/Auth';

const InitialData = [];

export default (state = InitialData, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        taikhoan: action.data.taikhoan,
        matkhau: action.data.matkhau,
      };
    default:
      return state;
  }
};

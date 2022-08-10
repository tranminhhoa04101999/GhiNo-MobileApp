import {SETDATA} from '../action/user';

const INITIALDATA = []; /// lấy tất cả user trong app

export default (state = INITIALDATA, action) => {
  switch (action.type) {
    case SETDATA: {
      return (state = action.data);
    }

    default:
      return state;
  }
};

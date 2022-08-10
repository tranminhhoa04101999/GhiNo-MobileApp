import {GETDATA} from '../action/Debt';

const INITIALDATA = {
  all: [],
  debt: [],
  loan: [],
  thanhtoan: [],
}; // lấy nợ của mình với thanh viên khác và ngược lại

export default (state = INITIALDATA, action) => {
  switch (action.type) {
    case GETDATA: {
      return {
        ...state,
        debt: action.data.dataDebt,
        loan: action.data.dataLoan,
        thanhtoan: action.data.thanhtoan,
        all: action.data.dataAll,
      };
    }
    default:
      return state;
  }
};

import {LINKBASE} from '../../App';
export const SETDATA = 'SETDATA';

export const fetchAll = () => {
  return async dispatch => {
    try {
      const response = await fetch(`${LINKBASE}/user.json`);

      if (!response.ok) {
        throw new Error('lấy dữ liệu thất bại !!');
      }

      const resData = await response.json();
      dispatch({type: SETDATA, data: resData});
    } catch (error) {
      throw error;
    }
  };
};

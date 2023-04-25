import requestCommon from '@/commons/RequestCommon';
import request from '@/utils/request';

export async function loadListPage(params, callback){
  let totalRecord = 1738;
  let data = [];
  for (let i = 0; i < totalRecord; i++) {
    let obj = {
      id: i + 1,
      type: i % 3 + 1,
      name : 'name_' + (i + 1),
    };
    data.push(obj);
  }

  let totalPage = parseInt(totalRecord - 1) / params.pageSize + 1;
  let currentPage = params.pageNum;
  if (currentPage > totalPage) {
    currentPage = totalPage;
  }

  let startIndex = (currentPage - 1) * params.pageSize;
  let endIndex = startIndex + params.pageSize;

  let response = {
    list : data.slice(startIndex, endIndex),
    total : totalRecord,
  }
  requestCommon.processResponse(response, callback);
}

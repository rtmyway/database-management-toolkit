package com.gantang.dbmt.service;

import com.gantang.dbmt.dto.PageDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;

@Service
@Slf4j
public class QueryCommonService {
    @Autowired
    private EntityManager entityManager;

    /**
     * 获得检索列表
     *
     * @param sql         查询语句
     * @param resultClass 结果类型
     * @return List<E>
     * @throws Exception
     */
    public List loadList(String sql, Class resultClass) throws Exception {
        Query query = entityManager.createNativeQuery(sql, resultClass);
        List list = query.getResultList();
        return list;
    }

    /**
     * 获得分页检索列表
     *
     * @param sql         查询语句
     * @param pageNum     起始页
     * @param pageSize    分页大小
     * @param resultClass 结果类型
     * @return PageVo<E>
     */
    public PageDto loadListPage(String sql, Integer pageNum, Integer pageSize, Class resultClass) throws Exception {
        PageDto pageDto = new PageDto();
        pageDto.setPageNum(pageNum);
        pageDto.setPageSize(pageSize);

        // 1.检索记录总数
        String aliasTable = "table_alias_" + resultClass.getSimpleName();
        String countSql = "select count(1) cnt from (" + sql + ") " + aliasTable;
        Query query = entityManager.createNativeQuery(countSql);
        pageDto.setTotal(Long.parseLong(query.getSingleResult().toString()));

        // 2.检索分页记录
        Integer start = pageSize * (pageNum - 1);
        String pageSql = sql + " limit " + start.toString() + "," + pageSize.toString();
        query = entityManager.createNativeQuery(pageSql, resultClass);
        List list = query.getResultList();
        pageDto.setList(list);
        return pageDto;
    }
}

package com.gantang.dbmt.base;

import com.gantang.dbmt.dto.PageDto;
import com.gantang.dbmt.execption.DbmtException;

import java.util.List;

public interface BaseAction<T> {
    Boolean add(T t) throws DbmtException;
    Boolean remove(T t) throws DbmtException;
    Boolean update(T t) throws DbmtException;

    Boolean enable(T t) throws DbmtException;

    Boolean disable(T t) throws DbmtException;
    List<T> list() throws DbmtException;
    PageDto listPage(PageDto pageDto) throws DbmtException;
}

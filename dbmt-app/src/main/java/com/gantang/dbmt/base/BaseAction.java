package com.gantang.dbmt.base;

import com.gantang.dbmt.dto.PageDto;

import java.util.List;

public interface BaseAction<T> {
    Boolean add(T t);
    Boolean remove(T t);
    Boolean update(T t);

    Boolean enable(T t);

    Boolean disable(T t);
    List<T> list();
    PageDto listPage(PageDto pageDto);
}

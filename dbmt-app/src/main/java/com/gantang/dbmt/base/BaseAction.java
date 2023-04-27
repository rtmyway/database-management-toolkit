package com.gantang.dbmt.base;

import java.util.List;

public interface BaseAction<T> {
    Boolean add(T t);
    Boolean delete(T t);
    Boolean update(T t);

    Boolean enable(T t);

    Boolean disable(T t);
    List<T> list();
}

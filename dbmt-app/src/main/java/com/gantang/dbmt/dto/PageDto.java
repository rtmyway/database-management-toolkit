package com.gantang.dbmt.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data

public class PageDto {
    private List list;
    private long total;
    private int pageNum;
    private int pageSize;
    private Map params;
}

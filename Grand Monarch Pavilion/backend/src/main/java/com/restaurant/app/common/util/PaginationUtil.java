package com.restaurant.app.common.util;

import java.util.Collections;
import java.util.List;

public class PaginationUtil {

    private PaginationUtil() {}

    public static <T> List<T> paginate(List<T> list, int page, int size) {
        if (list == null || list.isEmpty()) {
            return Collections.emptyList();
        }
        int validPage = Math.max(page, 0);
        int validSize = size > 0 ? size : 10;
        int fromIndex = validPage * validSize;

        if (fromIndex >= list.size()) {
            return Collections.emptyList();
        }

        int toIndex = Math.min(fromIndex + validSize, list.size());
        return list.subList(fromIndex, toIndex);
    }
}

package com.gantang.dbmt.handler;

import com.gantang.dbmt.execption.DbmtException;
import com.gantang.dbmt.vo.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;

import java.util.Locale;

@Slf4j
@ControllerAdvice
public class ControllerExceptionHandler {
    /**
     * 全局处理异常 错误返回500
     *
     * @param e
     * @param req
     * @return
     */
    @ExceptionHandler(value = { DbmtException.class, Exception.class })
    public ResponseEntity<Object> handleException(final Exception e, final ServletWebRequest req) {
        //获取接口路径
        String apiUrl = req.getRequest().getServletPath();
        
        Locale locale = LocaleContextHolder.getLocale();
        String errorMsg  = "";
        if (e instanceof DbmtException) {
            DbmtException pe = (DbmtException) e;
            errorMsg = pe.getErrorMessage();
            // 输出日志
            log.error("  【" + apiUrl + "】" + errorMsg);
        } else {
            errorMsg = "SYSTEM_ERROR";
            // 输出日志
            log.error("  【" + apiUrl + "】", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(R.error(errorMsg));
    }
}

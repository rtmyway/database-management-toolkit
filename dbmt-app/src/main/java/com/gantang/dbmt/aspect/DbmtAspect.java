package com.gantang.dbmt.aspect;


import com.gantang.dbmt.task.TaskLock;
import com.gantang.dbmt.task.TaskProcessInfo;
import com.gantang.dbmt.vo.R;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

@Slf4j
@Aspect
@Component
public class DbmtAspect {
    @Autowired
    private TaskProcessInfo taskProcessInfo;

    @Pointcut("execution(* com.gantang.dbmt.controller.*.*(..))")
    public void pointCut() {

    }
    
    /**
     * 拦截
     * @param jp
     * @return
     * @throws Throwable
     */
    @Order(1)
    @Around("pointCut()")
    public Object around(ProceedingJoinPoint jp) throws Throwable {
        RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
        HttpServletRequest req = ((ServletRequestAttributes) requestAttributes).getRequest();

        MethodSignature signature = (MethodSignature) jp.getSignature();
        TaskLock taskLock = signature.getMethod().getAnnotation(TaskLock.class);
        log.info("taskProcessInfo={}", taskProcessInfo);
        if (taskLock != null && taskProcessInfo.isProcessing()) {
            StringBuilder sb = new StringBuilder();
            sb.append(taskProcessInfo.getTaskItem().getText());
            sb.append("id=".concat(taskProcessInfo.getTaskId()));
            return R.error(sb.toString());
        }

        Object obj = jp.proceed();
        return obj;
    }
}

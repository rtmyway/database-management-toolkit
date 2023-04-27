package com.gantang.dbmt.controller;

import com.gantang.dbmt.dao.entity.FlashbackPolicyEntity;
import com.gantang.dbmt.service.FlashbackPolicyService;
import com.gantang.dbmt.vo.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("flashback-policy")
@Slf4j
public class FlashbackPolicyController {
    @Autowired
    private FlashbackPolicyService flashbackPolicyService;

    @PostMapping("add")
    public R<Boolean> add(@RequestBody FlashbackPolicyEntity flashbackPolicyEntity) {
        return R.success(flashbackPolicyService.add(flashbackPolicyEntity));
    }

    @PostMapping("update")
    public R<Boolean> update(@RequestBody FlashbackPolicyEntity flashbackPolicyEntity) {
        return R.success(flashbackPolicyService.update(flashbackPolicyEntity));
    }

    @PostMapping("remove")
    public R<Boolean> remove(@RequestBody FlashbackPolicyEntity flashbackPolicyEntity) {
        return R.success(flashbackPolicyService.remove(flashbackPolicyEntity));
    }

    @PostMapping("list")
    public R<List<FlashbackPolicyEntity>> list() {
        return R.success(flashbackPolicyService.list());
    }
}

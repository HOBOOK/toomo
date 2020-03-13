package com.hobook.tomo.service;

import com.hobook.tomo.dto.MemoDto;
import com.hobook.tomo.repository.MemoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
public class MemoService {
    private MemoRepository memoRepository;

    @Transactional
    public Long saveMemo(MemoDto memoDto){
        return memoRepository.save(memoDto.toEntity()).getId();
    }
}

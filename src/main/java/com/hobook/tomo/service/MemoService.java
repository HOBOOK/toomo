package com.hobook.tomo.service;

import com.hobook.tomo.dto.MemoDto;
import com.hobook.tomo.model.Memo;
import com.hobook.tomo.repository.MemoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class MemoService {
    private MemoRepository memoRepository;

    @Transactional
    public Long saveMemo(MemoDto memoDto){
        return memoRepository.save(memoDto.toEntity()).getId();
    }

    @Transactional
    public Long deleteMemo(MemoDto memoDto){
        return memoRepository.save(memoDto.toEntity()).getId();
    }

    @Transactional
    public List<MemoDto> getMemoList(String email){
        List<Memo> memoEntities = memoRepository.findMemosByCreator(email);
        List<MemoDto> memoDtoList = new ArrayList<>();

        for(Memo memo : memoEntities){
            MemoDto memoDto = MemoDto.builder()
                    .id(memo.getId())
                    .creator(memo.getCreator())
                    .context(memo.getContext())
                    .state(memo.getState())
                    .fix(memo.getFix())
                    .date_create(memo.getDate_create())
                    .date_update(memo.getDate_update())
                    .build();
            memoDtoList.add(memoDto);
        }
        return memoDtoList;
    }
}

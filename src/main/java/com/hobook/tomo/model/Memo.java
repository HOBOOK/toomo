package com.hobook.tomo.model;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Table(name="memos")
public class Memo extends Time{

    @Id
    @GenericGenerator(name="memo_seq",strategy="increment")
    @GeneratedValue(generator = "memo_seq")
    @Column(name="id", nullable=false)
    private Long id;

    @Column(name="creator", nullable = false, length = 50)
    private String creator;

    @Column(name="context", columnDefinition = "TEXT")
    private String context;

    @Column(name="state")
    private int state; //0:보여짐, 1:가려짐, 2>= 제거

    @Column(name="fix")
    private int fix;

    @Builder
    public Memo(Long id, String creator, String context, int state, int fix){
        this.id = id;
        this.creator = creator;
        this.context = context;
        this.state = state;
        this.fix = fix;
    }


}

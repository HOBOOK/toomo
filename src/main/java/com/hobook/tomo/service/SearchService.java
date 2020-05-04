package com.hobook.tomo.service;

import com.hobook.tomo.dto.EventDto;
import com.hobook.tomo.dto.MemoDto;
import com.hobook.tomo.model.Event;
import com.hobook.tomo.model.Memo;
import com.hobook.tomo.model.SearchItem;
import com.hobook.tomo.util.Common;
import lombok.AllArgsConstructor;
import org.apache.lucene.search.Query;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import java.util.List;

@AllArgsConstructor
@Service
public class SearchService {
    @PersistenceContext(type = PersistenceContextType.EXTENDED)
    private EntityManager entityManager;

    public void buildSearchIndex() throws InterruptedException{
        FullTextEntityManager fullTextEntityManager = Search.getFullTextEntityManager(entityManager);
        fullTextEntityManager.createIndexer().startAndWait();
    }

    @Transactional
    public List<SearchItem> search(String searchText){
        FullTextEntityManager fullTextEntityManager = Search.getFullTextEntityManager(entityManager);
        QueryBuilder qb = fullTextEntityManager.getSearchFactory().buildQueryBuilder().forEntity(SearchItem.class).get();
        Query luceneQuery = qb.keyword().fuzzy().withEditDistanceUpTo(1).withPrefixLength(1).onFields("title", "event_description", "context").matching(searchText).createQuery();
        javax.persistence.Query jpaQuery = fullTextEntityManager.createFullTextQuery(luceneQuery, SearchItem.class);

        List<SearchItem> searchItemList = null;
        try{
            List<EventDto> eventList = jpaQuery.getResultList();
            List<MemoDto> memoList = jpaQuery.getResultList();
            for(EventDto e : eventList){
                searchItemList.add(SearchItem.builder().title(e.getTitle())
                        .crator(e.getCreator()).type(1).id(e.getId()).build());
            }
            for(MemoDto m : memoList){
                searchItemList.add(SearchItem.builder().title(m.getContext())
                        .crator(m.getCreator()).type(0).id(m.getId()).build());
            }
            for(SearchItem searchItem : searchItemList){
                Common.print(searchItem.getTitle());
            }
        }catch (NoResultException e){
            ;
        }
        return searchItemList;
    }

}

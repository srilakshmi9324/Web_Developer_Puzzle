import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fetch, optimisticUpdate } from '@nrwl/angular';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map ,} from 'rxjs/operators';
import { ReadingListItem, Book } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http
          .get<ReadingListItem[]>('/api/reading-list')
          .pipe(
            map(data =>
              ReadingListActions.loadReadingListSuccess({ list: data })
            )
          )
      ),
      catchError(error =>
        of(ReadingListActions.loadReadingListError({ error }))
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  undoRemoveBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.undoRemoveFromReadingList),
      optimisticUpdate({
        run: ({ item }) => {
          const book: Book = { id: item.bookId, ...item };

          return this.http.post('/api/reading-list', book).pipe(
            map(() =>
              ReadingListActions.confirmedAddToReadingList({
                book
              })
            )
          );
        },
        undoAction: ({ item }) => {
          const book: Book = { id: item.bookId, ...item };
          return ReadingListActions.failedAddToReadingList({
            book
          });
        }
      })
    )
  );

  undoAddBook$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ReadingListActions.undoAddToReadingList),
    optimisticUpdate({
      run: ({ book }) => {
        const item: ReadingListItem = { bookId: book.id, ...book };
        return this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({
              item
            })
          )
        );
      },
      undoAction: ({ book }) => {
        const item: ReadingListItem = { bookId: book.id, ...book };
        return ReadingListActions.failedRemoveFromReadingList({
          item
        });
      }
    })
  )
);

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item })
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );
  
  

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient) {}
}

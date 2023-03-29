import { Injectable } from '@angular/core';

import {
  collection,
  doc,
  docData,
  Firestore,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  collectionData,
  query,
} from '@angular/fire/firestore';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(private firestore: Firestore) {}

  /* -------------------------
    Get Data from Firestore
  ------------------------- */

  /**
   * Get only document data (valueChanges)
   * @param path
   */
  doc$(path: string): Observable<any> {
    const docRef = doc(this.firestore, path);
    return docData(docRef, { idField: 'id' }).pipe(
      catchError(this.handleError),
      shareReplay(1)
    );
  }

  /**
   * Get collection data with doc Id
   * @param path
   * @param query
   */
  col$(path: string, queryConstraints?: any): Observable<any[]> {
    const colRef = collection(this.firestore, path);
    const queryRef = query(colRef, ...queryConstraints);
    const col = collectionData(queryRef, {
      idField: 'id',
    });
    return col.pipe(catchError(this.handleError), shareReplay(1));
  }

  /* -------------------------
        Write Data in Firestore
       ------------------------- */

  /**
   * Create or Update
   * Creates or updates data a Firestore document.
   * @param string path 'collection' or 'collection/docId'
   * @param data doc data
   */
  async save(path: string, data: Partial<any>): Promise<void> {
    const segments = path.split('/').filter((v) => v);

    if (segments.length % 2) {
      try {
        const colRef = collection(this.firestore, path);
        await addDoc(colRef, {
          createdAt: serverTimestamp(),
          ...data,
        });
        alert('Added successfully');
      } catch (error: any) {
        this.handleError(error);
      }
    } else {
      try {
        const docRef = doc(this.firestore, path);
        await setDoc(
          docRef,
          {
            updatedAt: serverTimestamp(),
            ...data,
          },
          { merge: true }
        );
        alert('Added successfully');
      } catch (error: any) {
        this.handleError(error);
      }
    }
  }

  /**
   * Add
   * @param path
   * @param data
   */
  async add(path: string, data: Partial<any>): Promise<string | null> {
    try {
      const colRef = collection(this.firestore, path);
      const docId = await addDoc(colRef, {
        createdAt: serverTimestamp(),
        ...data,
      }).then((doc: any) => doc.id);
      alert('Added successfully');
      return docId;
    } catch (error: any) {
      this.handleError(error);
      return null;
    }
  }

  /**
   * Delete
   * Delete a Firestore document
   * @param string path to document
   */
  async delete(path: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, path);
      await deleteDoc(docRef);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Handle Error
   * Emits an error notification
   * @param error
   */
  private handleError(error: Error): Observable<never> {
    return throwError(() => error);
  }
}

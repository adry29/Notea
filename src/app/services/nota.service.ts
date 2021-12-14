import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Nota} from '../model/Nota';


@Injectable({
  providedIn: 'root'
})
export class NotaService {

  private last:any=null;
  
  private myCollection:AngularFirestoreCollection;

  constructor(private db:AngularFirestore) {
    this.myCollection=db.collection<any>(environment.firebaseConfig.notasCollection);
   }


   //Sube la nota a firebase
   public addNota(nota:Nota):Promise<string>{
     return new Promise(async(resolve, reject)=>{
       try{
         let response: DocumentReference<firebase.default.firestore.DocumentData> = await this.myCollection.add({title:nota.title, description:nota.description, photo:nota.photo});
         resolve(response.id);
       }catch(error){
         reject(error);
       }
     })
   }

   public addNotaNoPhoto(nota:Nota):Promise<string>{
    return new Promise(async(resolve, reject)=>{
      try{
        let response: DocumentReference<firebase.default.firestore.DocumentData> = await this.myCollection.add({title:nota.title, description:nota.description});
        resolve(response.id);
      }catch(error){
        reject(error);
      }
    })
  }

   //Obtiene una colección de notas desde firebase, de 10 en 10
   //No se utiliza pues tenemos infinite scroll
   public getNotesByPage(all?):Observable<Nota[]> {
    if(all){
      this.last=null;
    }
    return new Observable((observer) => {
      let result: Nota[] = [];
      let query=null;
      if(this.last){
        query=this.db.collection<any>(environment.firebaseConfig.notasCollection,
          ref => ref.limit(10).startAfter(this.last));
      }else{
        query=this.db.collection<any>(environment.firebaseConfig.notasCollection,
          ref => ref.limit(10));
      }
      
        
        query.get()
        .subscribe(
          (data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
            data.docs.forEach((d: firebase.default.firestore.DocumentData) => {
              this.last=d;
              let tmp = d.data(); 
              let id = d.id; 
              result.push({ 'key': id, ...tmp });
              
            })
            observer.next(result);  
            observer.complete();
          }) 
    }); 
  }


  //consigue desde firebase una coleccion de notas
  //Obtiene todas las notas de la base de datos
  //Es el método usado con infinite scroll
public getNotes(): Observable<Nota[]> {
  return new Observable((observer) => {
    let result: Nota[] = [];
    this.myCollection.get().subscribe(
      (data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
        data.docs.forEach((d: firebase.default.firestore.DocumentData) => {
          let tmp = d.data();  
          let id = d.id;
          result.push({ 'key': id, ...tmp });
        
        })
        observer.next(result);
        observer.complete();
      })

  })
}

//Devuelve una nota según su key en firebase
public getNote(id: string):Promise<Nota> {
  return new Promise(async(resolve,reject)=>{
    let note:Nota=null;
    try {
      let result:firebase.default.firestore.DocumentData=await this.myCollection.doc(id).get().toPromise; //se podria usar un subcribe
      note = {
        id:result.id, ... result.data()
      }
      resolve(note);
    } catch (error) {
      reject(error)
    }
  
     
    })
  
}

//Elimina una nota por ID
public remove(id:string):Promise<void>{
  return this.myCollection.doc(id).delete();
}

//Actualiza una nota, recibiendo de ella su key y valores previos
public updateNote(note: Nota): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      let response: any = await this.myCollection.doc(note.key).update({title:note.title,
        description:note.description}); 
      resolve(response);
    } catch (error) {
      reject(error);
    }
  })
}



}

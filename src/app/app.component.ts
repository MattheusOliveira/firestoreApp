import { Component } from '@angular/core';
import * as firebase from "firebase";
import { FirebaseConfig } from "../environments/firebase.config"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'firestoreApp';
  private db: any;

  constructor() {
      firebase.initializeApp(FirebaseConfig.firebase);
      this.db = firebase.firestore();

      this.db.collection('usuarios').where('nome','==', 'matheus')
          .get().then((snapshot) => {
            console.log(snapshot)
            snapshot.forEach((doc) => {
              console.log(snapshot);
              console.log(doc.id, doc.data());
            });
      }).catch((err) => console.log(err));
  }
}

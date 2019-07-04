import { Component } from '@angular/core';
import * as firebase from "firebase";
import { FirebaseConfig } from "../environments/firebase.config"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'firestoreApp';
  private db: any;
  private formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
      firebase.initializeApp(FirebaseConfig.firebase);
      this.db = firebase.firestore();

      //adicionando um usuário.
      // this.db.collection('usuarios').doc().set({
      //   nome: 'vinicius',
      //   telefone: '62982269272'
      // });

      // this.db.collection('empresas').doc().set({
      //   nome: 'b/300'
      // });

      this.db.collection('usuarios').where('nome','==', 'marcos')
          .get().then((snapshot) => {
            console.log(snapshot)
            snapshot.forEach((doc) => {
              console.log(snapshot);
              console.log(doc.id, doc.data());
            });
      }).catch((err) => console.log(err));

      this.formGroup = this.formBuilder.group({
        nome: ['', [Validators.required]],
        company: ['', [Validators.required]]
      })
  }

  public saveEmployee(){
      // this.db.colletion('usuarios').doc().set({
      //   nome: this.formGroup.controls['nome'].value,
      //   company: this.formGroup.controls['company'].value
      // });
  debugger;    console.log(this.formGroup.controls['nome'].value)
      console.log(this.formGroup.controls['company'].value)
  }
}

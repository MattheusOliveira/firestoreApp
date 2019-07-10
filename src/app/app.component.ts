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
  private formulario: FormGroup;

  constructor(private formBuilder: FormBuilder) {
      firebase.initializeApp(FirebaseConfig.firebase);
      this.db = firebase.firestore();

      this.formulario = this.formBuilder.group({
        nome: ["", [Validators.required]],
        company: ["", [Validators.required]]
      })

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

      //delete company
      this.db.collection('empresas').where('nome', '==', 'b/300')
          .get().then((snapshot) => {
            snapshot.forEach((doc) => {
              this.db.collection('empresas').doc(doc.id).delete()
                  .then(() => console.log('company b/300 deleted'))
                  .catch(err => console.log(err))
            });
          })
          .catch(err => {
            console.log('falha ao deletar');
            console.log(err);
          });
  }

  public saveEmployeeAndCompany(e){
        e.preventDefault();
        // this.db.colletion('usuarios').doc().set({
        //   nome: this.formGroup.controls['nome'].value
        // });
        // this.db.collection('empresas').doc().set({
        //   company: this.formGroup.controls['company'].value
        // });
        console.log(this.formulario.controls['nome'].value);
        console.log(this.formulario.controls['company'].value);
  }
}

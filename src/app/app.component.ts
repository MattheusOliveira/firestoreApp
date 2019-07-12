import { Component } from '@angular/core';
import * as firebase from "firebase";
import { FirebaseConfig } from "../environments/firebase.config"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'firestoreApp';
  private db: any;
  private formulario: FormGroup;
  private dataUser: Array<any> = [];

  constructor(private formBuilder: FormBuilder) {
      firebase.initializeApp(FirebaseConfig.firebase);
      this.db = firebase.firestore();
      //this.getCompanyAndEmployeers();

      this.formulario = this.formBuilder.group({
        nome: ["", [Validators.required]],
        company: ["", [Validators.required]],
        telefone: ["", [Validators.required]]
      })

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
        this.db.collection('usuarios').add({
          nome: this.formulario.controls['nome'].value,
          telefone: this.formulario.controls['telefone'].value
        }).then((result) => {
          console.log('Id do documento: ', result.id);
        });

        this.db.collection('empresas').doc().set({
          company: this.formulario.controls['company'].value
        });

  }

  // private getCompanyAndEmployeers() {
  //   this.db.collection('empresas_usuarios').get().then((snapshot) => {
  //     snapshot.forEach(doc => {
  //        let data = doc.data();
  //        console.log(doc.id, "=>" , doc.data())
  //        // this.getData(doc.data());
  //        this.provider(doc.data()).then(result => {
  //          console.log(result);
  //        })
  //     });
  //   });
  // }
  //
  // private provider(data): Promise<any>{
  //   return new Promise((resolve, reject) => {
  //     console.log(data)
  //     this.db.collection('usuarios').doc(data.usuario_id.id).get().then(snapshot => {
  //       resolve(snapshot);
  //     });
  //       reject('error-transaction');
  //   });
  // }
}

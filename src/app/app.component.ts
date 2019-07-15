import { Component } from '@angular/core';
import * as firebase from "firebase";
import { FirebaseConfig } from "../environments/firebase.config"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {Subscription} from 'rxjs/Subscription';
import { Observable } from 'rxjs';



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
      this.getCompanyAndEmployeers();

      this.formulario = this.formBuilder.group({
        nome: ["", [Validators.required]],
        company: ["", [Validators.required]],
        telefone: ["", [Validators.required]]
      })

      this.db.collection('usuarios').where('nome','==', 'marcos')
          .get().then((snapshot) => {
            snapshot.forEach((doc) => {
            console.log(snapshot);
            console.log(doc.id, doc.data());
            });
      }).catch((err) => console.log(err));

      //delete company with where
      // this.db.collection('empresas').where('nome', '==', 'b/300')
      //     .get().then((snapshot) => {
      //       snapshot.forEach((doc) => {
      //         this.db.collection('empresas').doc(doc.id).delete()
      //             .then(() => console.log('company b/300 deleted'))
      //             .catch(err => console.log(err))
      //       });
      //     })
      //     .catch(err => {
      //       console.log('falha ao deletar');
      //       console.log(err);
      //     });
      //delete all
      // this.db.collection('usuarios')
      //     .get().then(snapshot => {
      //       snapshot.forEach(data => {
      //         this.db.collection('usuarios').doc(data.id).delete()
      //       });
      //     }).catch(err => console.log(err));
  }



  public submitEmployeeAndCompany(e){
        e.preventDefault();
        this.saveEmployee().then(employeeRef => {
          this.saveCompany().then(companyRef => {
            this.saveEmployeeAndCompany(employeeRef, companyRef);
          });
        }).catch(err => console.log(err));
  }

  public saveCompany():Promise<any>{
    return new Promise((resolve, reject) => {
      this.db.collection('empresas').add({
        empresa: this.formulario.controls['company'].value
      }).then((result) => {
        console.log('Id do documento-company', result);
        let companyRef = this.db.doc(`empresas/${result.id}`);
        resolve(companyRef);
      }).catch(err => reject(err));
    });
  }

  public saveEmployee():Promise<any>{
    return new Promise((resolve, reject) => {
      this.db.collection('usuarios').add({
        nome: this.formulario.controls['nome'].value,
        telefone: this.formulario.controls['telefone'].value
      }).then((result) => {
        console.log('Id do documento: ', result);
         let employeeRef = this.db.doc(`empresas/${result.id}`); //referência
         resolve(employeeRef);
      }).catch(err => reject(err));
    });
  }

  public saveEmployeeAndCompany(employeeId, companyId) {
    this.db.collection('empresas_usuarios').add({
      empresa_id: companyId,
      usuario_id: employeeId
    }).then(result => {
      this.loadTable();
      this.formulario.reset();
    }).catch(err => console.log(err));
  }

  public loadTable() {
    this.dataUser = [];
    this.getCompanyAndEmployeers();
  }

  private getCompanyAndEmployeers() {
    this.db.collection('empresas_usuarios').get().then((snapshot) => {
      snapshot.forEach(doc => {
         let data = doc.data();
         data.id = doc.id;
         console.log(doc.id, "=>" , doc.data())
         this.provider(data).then(result => {
           console.log(result);
         }).catch(err => console.log(err));
      });
    });
  }

  private provider(data): Promise<any>{
    return new Promise((resolve, reject) => {
      console.log(data)
      this.db.collection('usuarios').doc(data.usuario_id.id).get().then(snapshot => {
        this.db.collection('empresas').doc(data.empresa_id.id).get().then(snap =>
          this.dataUser.push({
            empresa_id: data.empresa_id.id,
            usuario_id: data.usuario_id.id,
            empresas_usuarios_id: data.id,
            nome: snapshot.data().nome,
            telefone: snapshot.data().telefone,
            empresa: snap.data().empresa,
          }));
        resolve(this.dataUser);
      }).catch(() => reject('error-transaction'));
    });
  }

  public removeEmployee(user) {
    console.log(user);
    let promises = [
      this.db.collection('usuarios').doc(user.usuario_id).delete(),
      this.db.collection('empresas').doc(user.empresa_id).delete(),
      this.db.collection('empresas_usuarios').doc(user.empresas_usuarios_id).delete()
    ];
    Promise.all(promises).then(result => {
      this.loadTable();
      console.log('usuarios-empresa removido')
    }).catch(err => console.log(err));
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Nota } from 'src/app/model/Nota';
import { NotaService } from 'src/app/services/nota.service';
import { UtilitiesService } from 'src/app/services/utilities.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  @Input() nota: Nota;

  public formNota: FormGroup;

  constructor(public modalController: ModalController,
    public ns: NotaService,
    private fb: FormBuilder,
    private utils:UtilitiesService
  ) { }

  ngOnInit() {
    this.formNota = this.fb.group({
      title: ["", Validators.required],
      description: [""]
    });
  }

  public closeModal() {
    this.modalController.dismiss();
  }

  public async updateNota() {

    let nota2: Nota = {
      key: this.nota.key,
      title: this.formNota.get("title").value,
      description: this.formNota.get("description").value
    }

    try {

      await this.ns.updateNote(nota2);
      await this.utils.presentToast("Nota actualizada correctamente", "success");
      this.formNota.reset();
      this.closeModal();

    } catch (err) {
      console.log(err);
      await this.utils.presentToast("Error al actualizar nota", "danger")

    }

  }
  



}

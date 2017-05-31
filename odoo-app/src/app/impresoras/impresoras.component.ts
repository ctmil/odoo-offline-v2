import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-impresoras',
  templateUrl: './impresoras.component.html',
  styleUrls: ['./impresoras.component.css']
})
export class ImpresorasComponent implements OnInit {
  message = "Impresoras";
  status:string;
  printer_name:string;
  printer:boolean = true;

  constructor() {
  }

  ngOnInit() {
    if(this.printer){
      this.status = "Conexión establecida con "+this.printer_name+".";
      document.getElementById("status").style.background="#5cb85c";
    }else{
      this.status = "ERROR, no se encuentra ninguna impresora conectada.";
      document.getElementById("status").style.background="#e5252e";
    }
  }

  test(){
    /*chrome.runtime.sendMessage(
      "dnkckjhbkggpnbekcgmioiijlnlhbnjp",
      {myCustomMessage: "Prueba Corta"},
      function(response) {
    });*/
  }

  abrir(){
    chrome.management.launchApp("oconkafegdbdklinbhkoopgbjnbgndap", function(){ //Remplazar id con id de la local-fiscal-printer
      if(chrome.runtime.lastError) console.error(chrome.runtime.lastError);
      else console.log("App launched");
    });
  }

}

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

  factura(){
    chrome.management.launchApp("oconkafegdbdklinbhkoopgbjnbgndap", function(){
      if(chrome.runtime.lastError) console.error(chrome.runtime.lastError);
      else console.log("App launched");
    });

    var options = {
      triplicated: false,
      store_description: false,
      keep_description_attributes: false,
      store_extra_descriptions: false,
    };
    var ticket = {
        partner: {
            name: "Cristian S. Rocha",
            name_2: "",
            address: "Av. Rivadavia 9858",
            address_2: "Buenos Aires",
            address_3: "Argentina",
            document_type: "D",
            document_number: "25095454",
            responsability: "F",
        },
        related_document: "",
        related_document_2: "",
        origin_document: "B0001000010000",
        lines: [ {
            item_action: "sale_item",
            as_gross: false,
            send_subtotal: false,
            check_item: false,
            collect_type: "q",
            large_label: "",
            first_line_label: "",
            description: "",
            description_2: "",
            description_3: "",
            description_4: "",
            item_description: "Item 1",
            quantity: 1,
            unit_price: 100,
            vat_rate: 21.0,
            fixed_taxes: 0,
            taxes_rate: 0,
            }, {
            item_action: "sale_item",
            as_gross: false,
            send_subtotal: false,
            check_item: false,
            collect_type: "q",
            large_label: "",
            first_line_label: "",
            description: "",
            description_2: "",
            description_3: "",
            description_4: "",
            item_description: "Item 2",
            quantity: 2,
            unit_price: 200,
            vat_rate: 20.0,
            fixed_taxes: 0,
            taxes_rate: 0,
            },
        ],
        cut_paper: true,
        electronic_answer: false,
        print_return_attribute: false,
        current_account_automatic_pay: false,
        print_quantities: false,
        tail_no: 0,
        tail_text: "Test 002 003",
        tail_no_2: 0,
        tail_text_2: "",
        tail_no_3: 0,
        tail_text_3: "",
    };

    setTimeout(function(){
      chrome.runtime.sendMessage(
        "oconkafegdbdklinbhkoopgbjnbgndap",
        {myTicket: ticket, myOption: options},
        function(response) {
      });
    }, 3000);
  }

  abrir(){
    chrome.management.launchApp("oconkafegdbdklinbhkoopgbjnbgndap", function(){
      if(chrome.runtime.lastError) console.error(chrome.runtime.lastError);
      else console.log("App launched");
    });
  }

}

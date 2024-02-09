<script setup lang="ts">
import { read, utils } from "xlsx"
import type { IPump } from "../types/IPump"
import { itemPumpForExel } from "../services/itemPumpForExel"


const loadFile = (evt) => {
  console.log(evt)
  var selectedFile = evt.target.files[0]
  var reader = new FileReader()
  reader.onload = function (event) {
    var data = event.target.result
    var workbook = read(data, {
      type: 'binary'
    })
  console.log(workbook)
       workbook.SheetNames.forEach(function (sheetName) {

      console.log(456456)

      var XL_row_object = utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
       console.log(XL_row_object)


       // проверка на ошибка

       // сюда написать проверку


       // отправка в базу
      XL_row_object.forEach((el, i) => {

      // itemPumpForExel(el)

   console.log(itemPumpForExel(el))

        // console.log(Object.values(el)[0])
        // if( Object.values(el)[0].indexOf("1.1") >=0){
        //   alert(456)
        // }


      })
    

    })

  }

   reader.readAsBinaryString(selectedFile)
}

</script>

<template>
  
  <SubHeader title="Exel" />

  <div class="download__wrapper mb-2">
     
      <div class="" id="download-file">
        <span class="">Только брокерский отчет Тинькофф: </span>
        <input @change="loadFile" type="file" id="fileUploader" name="fileUploader" accept=".xls, .xlsx" />
      </div>
    </div>
  
</template>


<style>

</style>

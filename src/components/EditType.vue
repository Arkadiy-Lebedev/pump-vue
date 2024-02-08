<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { API } from "../api/api"
import type { IType } from "../types/IType"
import { useToastStore } from '../stores/toastStore'
const useStore = useToastStore()

interface Props {
  type: {
      id: number
    image: string 
    type: string
  }
}

interface TypesItem {
      id: number
    image: string | ArrayBuffer
  type: string


}

const props = defineProps<Props>()
console.log(props)

const emit = defineEmits<{
  (e: 'closeModal', status: string): void

}>()



console.log(props)

const progress = ref()
const textBtnFile = ref("изменить")
const isErrorTypeFile = ref<boolean>(false)
const filesForAvatarEdit = ref<string>(props.type.image);
const loading = ref<boolean>(false)
const onProgress = ref<boolean>(false)

const file = ref<string | ArrayBuffer | null | Blob>(null)


const typeItemEdit = reactive<TypesItem>({
  id: props.type.id,
  image: props.type.image,
  type: props.type.type
});

const uploadImgEdit = (e:any) => {

  let fileUpload = e.target.files[0];

  if (

    fileUpload.size > 1024 * 1024 * 1
  ) {
    isErrorTypeFile.value = true;

  } else {

    isErrorTypeFile.value = false;
    var reader = new FileReader();
    reader.readAsDataURL(fileUpload);
    let that = e;
    reader.onload = function (e) {     
      if (e.target) {
         const result = e.target.result;
        if (result !== null) {
          file.value = that.target.files[0];
            // @ts-ignore
          filesForAvatarEdit.value = result;
        }
      }
      
    };
    textBtnFile.value = "Изменить";
  }
};

const submitForm = () => {
  if (isErrorTypeFile.value) {
    return
  }
  loading.value = true;
  onProgress.value = true;
  let formData = new FormData();
  for (let key in typeItemEdit) {
    const typedKey = key as keyof TypesItem // Приведение типа к keyof CategoriesItem
        // @ts-ignore
    formData.append(typedKey, typeItemEdit[typedKey]);
  }
  if (file.value) {
    // @ts-ignore
    formData.append("file", file.value);
  }
console.log(123)
  axios
    .post(`${API}api/type/update.php`, formData)
    .then((data) => {
      console.log(456)
      if (data.status) {
         useStore.showToast({ type: 'success', title: 'Успешно!', text: `Изменения внесены` })
        emit('closeModal', 'success')
       
      }


    }).catch((error) => {
      console.log(error);
      // toast.add({
      //   severity: "error",
      //   summary: "Что-то пошло не так",
      //   detail: `Ошибка: ${error.message}`,
      //   life: 3000,
      // });
    })
    .finally(() => {
      loading.value = false;
      loading.value = false;
      onProgress.value = false;
      progress.value = 100;

    });
}




</script>

<template>
  <div class="">
    <Toast />
    <form @submit.prevent="submitForm">
      <div class="">
        <div class="">
          
          <p>Изображение категории:</p>
          <label for="fileEdit" class=""><i class="pi pi-upload form__icons"></i> {{ textBtnFile }}</label>

          <input hidden id="fileEdit" class="select" ref="imgInput" type="file" accept="image/jpeg,image/jpg,image/png,.svg"
            @change="uploadImgEdit($event)" />
          <InlineMessage v-if="isErrorTypeFile" severity="error">Максимальный размер файла: 1мб</InlineMessage>
        </div>
        <div class="mt-5 mb-5 max-w-60">
          
          <img v-if="filesForAvatarEdit" :src="filesForAvatarEdit ? filesForAvatarEdit : ''" alt="Image" imageClass="image" />
        </div>
      </div> 
        <div class="input-group">
            <label class="input-group__label" for="type">Тип:</label>
            <InputText id="type" v-model="typeItemEdit.type" aria-describedby="username-help" />
          </div>
   
      <div class="mt-5">
        <Button type="submit" label="Сохранить" :loading="loading" class="p-button-raised" />
   
        
      </div>

    </form>
  </div>
</template>

<style>
.input-group {
  @apply flex flex-col max-w-xs mb-5;
}

.input-group__label {
  @apply mb-1;
}
</style>





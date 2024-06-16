<script setup lang="ts">
import SubHeader from "../components/SubHeader.vue"
import { useRouter } from 'vue-router'

const router = useRouter()


</script>

<template>
  <SubHeader title="Добавить" />
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ">
   
    
   <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Card >
        <template #content>
<p class="text-xl mb-5">Насос серии:</p>
        <div class="flex gap-5 mb-5">
          
    <Button @click="router.push({ name: 'add-pump' })" icon="pi pi-book" label="WQA" severity="primary" size="large"/>
    <Button @click="router.push({ name: 'add-pump-td' })" icon="pi pi-book" label="TD" severity="primary" size="large"/>
<Button @click="router.push({ name: 'add-pump-cdlf' })" icon="pi pi-book" label="CDLF" severity="primary" size="large"/>
    </div>
    <Divider />  
    <div class="flex gap-5 mt-5">
    <Button @click="router.push({ name: 'add-type' })" icon="pi pi-briefcase" label="Типы насосов" severity="help" size="large"/>
    </div>
        </template>
      </Card>




    </div>



  </div>
</template>


<style>
.chart-wrapper{
width: 70%;
aspect-ratio: 1 / 1;
}

.input-group {
  @apply flex flex-col max-w-xs mb-5;
}

.wrapper-content .input-group {
  @apply flex flex-col max-w-xs mb-0;
}

.input-group__label {
  @apply mb-1 w-60;
}

.input-group__label-pump {
  @apply mb-1 ;
}

@media (max-width: 480px) {
.chart-wrapper{
width: 100%;

}
}

</style>

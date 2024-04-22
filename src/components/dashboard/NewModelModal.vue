<template>
  <div id="customModal" class="modal-container" @click="event => closeModal(event)">
    <div class="modal-content">

      <div class="modal-header-top">
        <button aria-label="Close" class="btn-close" type="button" @click="() => newModelStore.setIsOpen(false)"></button>
        <div class="modal-header text-left">
          <h4>New Model</h4>
        </div>
      </div>

      <div class="modal-body-container">
        <div class="modal-body">

          <form @submit.prevent="createModel">
            <div class="mb-3">
              <input :value="getModelName" class="form-control" placeholder="Name..." required type="text"
                @change="event => newModelStore.setModelName(event.target.value)">
              <p v-if="getModelName.trim().length <= 0" class="m-0 small text-danger">The name cannot be blank!</p>
            </div>
            <div class="mb-3">
              <button class="btn btn-primary w-100" type="submit">Create</button>
            </div>
          </form>


        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useNewModelStore } from '@/stores/newModel';
import { NewModel } from "@/types/NewModel";

const newModelStore = useNewModelStore();
const { getModelName, getModelType } = storeToRefs(newModelStore);


const closeModal = (event: { target: { id: string; }; }) => {
  if (event.target.id !== 'customModal') return;
  newModelStore.setIsOpen(false);

}

const createModel = () => {
  if (getModelName.value.trim().length <= 0) return;

      const model: NewModel = {
        name: getModelName.value,
        model: getModelType.value
      }
      newModelStore.createNewModel(model);

}

</script>

<style lang="scss" scoped>
.modal-container {
  display: block;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;

  background: rgba(0, 0, 0, 0.2);
  z-index: 9999;
}

.modal-content {
  position: relative;
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: .3rem;
  outline: 0;
  background: white;
  margin: 0 0;
  width: 100% !important;
  height: 100%;
  overflow: auto;

  @media (min-width: 991px) {
    margin: 3% auto;
    /* 15% from the top and centered */
    width: 80%;
    max-width: 900px;
    height: fit-content;
    overflow: revert;
  }

  /* Animate the content of the modal */
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.5s;
  animation-name: animatetop;
  animation-duration: 0.5s
}

@-webkit-keyframes animatetop {
  from {
    top: -10px;
    opacity: 0
  }

  to {
    top: 0;
    opacity: 1
  }
}

@keyframes animatetop {
  from {
    top: -10px;
    opacity: 0
  }

  to {
    top: 0;
    opacity: 1
  }
}

.btn-close {
  position: absolute;
  right: 5px;
}

.modal-header-top {
  border-bottom: 3px solid #88ad3a;
  padding: 3px 1px;
  margin: 0 30px;

  .modal-header {
    border: 0;
    padding-left: 0;
    padding-top: 20px;

    h4 {
      font-weight: 400 !important;
      line-height: 1.5;
      font-size: 1.25rem;
      margin: 0;
      padding: 0;
    }

  }
}

.modal-body-container {
  font-size: 0.8rem;
  line-height: 1.2rem;
  padding: 5px 16px;
}
</style>

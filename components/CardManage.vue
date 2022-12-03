<template>
  <div>
    <v-card elevation="2" tile class="mb-4">
      <v-card-text>
        <FoldersSelect label="Раздел карточки" :allow-empty="false"
                       v-model="selectedFolder" :pre-selected-folder-id="preSelectedFolderId"
        />
      </v-card-text>
    </v-card>

    <v-card elevation="2" tile class="mb-4">
      <v-card-title>Лицевая сторона</v-card-title>
      <v-card-text>
        <v-form>
          <v-textarea solo v-model="frontSideValue" label="Введите вопрос" required />
        </v-form>
      </v-card-text>
    </v-card>

    <v-card elevation="2" tile class="mb-4">
      <v-card-title>Обратная сторона</v-card-title>
      <v-card-text>
        <v-form>
          <v-textarea solo v-model="backSideValue" label="Введите ответ" required />
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import FoldersSelect from "../components/FoldersSelect";
import Folder from "../repositories/folders/Folder";
import {defineComponent} from "vue";

export default defineComponent({
  components: {
    FoldersSelect

  },

  props: {
    frontSide: {
      type: String,
    },
    backSide: {
      type: String
    },
    folder: {
      type: Folder | Object
    },
    preSelectedFolderId: {
      type: String | Number
    }
  },

  data() {
    return {
      frontSideValue: '',
      backSideValue: '',
      selectedFolder: undefined,
    }
  },

  mounted() {
    this.frontSideValue = this.frontSide;
    this.backSideValue = this.backSide;
    this.selectedFolder = this.folder;
  },

  watch: {
    frontSide(newVal) {
      this.frontSideValue = this.frontSide;
    },
    backSide(newVal) {
      this.backSideValue = this.backSide;
    },
    folder(newVal) {
      this.selectedFolder = this.folder;
    },

    frontSideValue() {
      this.$emit('update:front-side', this.frontSideValue);
    },
    backSideValue() {
      this.$emit('update:back-side', this.backSideValue);
    },
    selectedFolder() {
      this.$emit('update:folder', this.selectedFolder);
    },
  }

})
</script>

<template>
  <div>
    <v-text-field type="text" v-model="folderNameValue" label="Введите имя раздела" />

    <FoldersSelect v-model="selectedFolder" :pre-selected-folder-id="preSelectedFolderId" />
  </div>
</template>

<script>
import FoldersSelect from "../components/FoldersSelect";
import Folder from "../repositories/folders/Folder";

export default {
  components: {
    FoldersSelect

  },

  props: {
    folderName: {
      type: String,
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
      folderNameValue: '',
      selectedFolder: undefined,
    }
  },

  mounted() {
    this.folderNameValue = this.folderName;
    this.selectedFolder = this.folder;
  },

  watch: {
    folderName(newVal) {
      this.folderNameValue = this.folderName;
    },
    folder(newVal) {
      this.selectedFolder = this.folder;
    },

    folderNameValue() {
      this.$emit('update:folder-name', this.folderNameValue);
    },
    selectedFolder() {
      this.$emit('update:folder', this.selectedFolder);
    },
  }

}
</script>

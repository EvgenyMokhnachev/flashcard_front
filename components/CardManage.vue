<template>
  <div>
    <FoldersSelect label="Раздел карточки" :allow-empty="false"
                   v-model="selectedFolder" :pre-selected-folder-id="preSelectedFolderId"
    />

    <CardBookmarkToggle v-model="bookmarkedValue" />

    <Wysiwyg placeholder="Лицевая сторона" v-model="frontSideValue" class="mb-4" />

    <Wysiwyg placeholder="Обратная сторона" v-model="backSideValue" class="mb-4" />
  </div>
</template>

<script>
import {defineComponent} from "vue";
import FoldersSelect from "../components/FoldersSelect";
import Folder from "../repositories/folders/Folder";
import Wysiwyg from "../components/Wysiwyg.vue";
import CardBookmarkToggle from "~/components/CardBookmarkToggle";

export default defineComponent({
  components: {
    CardBookmarkToggle,
    FoldersSelect,
    Wysiwyg
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
    },
    bookmarked: {
      type: Boolean
    },
  },

  data() {
    return {
      frontSideValue: '',
      backSideValue: '',
      selectedFolder: undefined,
      bookmarkedValue: false
    }
  },

  mounted() {
    this.frontSideValue = this.frontSide;
    this.backSideValue = this.backSide;
    this.selectedFolder = this.folder;
    this.bookmarkedValue = this.bookmarked;
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
    bookmarked(newVal) {
      this.bookmarkedValue = this.bookmarked;
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
    bookmarkedValue() {
      this.$emit('update:bookmarked', this.bookmarkedValue);
    },
  }

})
</script>

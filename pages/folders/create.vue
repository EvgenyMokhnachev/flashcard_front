<template>
  <div>
    <div class="text-h6">Создание раздела</div>

    <FolderManage :folder-name="folderName" @update:folder-name="(newVal) => this.folderName = newVal"
                  :folder="parentFolder" @update:folder="(newVal) => this.parentFolder = newVal"
                  :pre-selected-folder-id="getParentFolderIdFromQuery()"
                  class="mb-4"
    />

    <Footer>
      <template slot="buttons">
        <v-btn color="secondary" icon large @click="onClickBack">
          <v-icon>mdi-keyboard-backspace</v-icon>
        </v-btn>

        <v-btn color="primary" icon large @click="onClickCreate">
          <v-icon>mdi-folder-plus-outline</v-icon>
        </v-btn>
      </template>
    </Footer>
  </div>
</template>

<style lang="scss">

</style>

<script lang="ts">
import foldersApi from "~/repositories/folders/FoldersApi";
import FolderCreateRequest from "~/repositories/folders/FolderCreateRequest";
import FoldersSelect from "~/components/FoldersSelect.vue";
import FolderManage from "~/components/FolderManage.vue";
import Vue from "vue";

import {defineComponent} from "vue";
import Footer from "~/components/Footer.vue";
import alertsService, {Alert} from "~/services/AlertsService";

export default defineComponent({
  components: {
    Footer,
    FolderManage,
    FoldersSelect
  },

  data() {
    return {
      folderName: '',
      parentFolder: undefined,
    }
  },

  methods: {
    getParentFolderIdFromQuery() {
      return this.$route.query.parentId;
    },

    async onClickCreate() {
      try {
        const folder = await foldersApi.create(new FolderCreateRequest({
          name: this.folderName,
          parentId: this.parentFolder && this.parentFolder.id ? this.parentFolder.id : undefined
        }));
        this.$router.push("/folders/" + folder.id);
      } catch (e) {
        alertsService.addAlert(new Alert('error', e.message));
        console.error(e);
      }
    },

    onClickBack() {
      this.$router.back();
    },
  },

})
</script>

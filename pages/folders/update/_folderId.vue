<template>
  <div>
    <div class="text-h6 mb-4">
      Редактирование раздела
    </div>

    <FolderManage :folder-name="currentFolder.name" @update:folder-name="(newVal) => this.currentFolder.name = newVal"
                  @update:folder="(newVal) => this.currentFolder.parentId = newVal.id"
                  :pre-selected-folder-id="currentFolder.parentId"
                  class="mb-4"
    />

    <DialogYesNot title="Уверены, что хотите удалить раздел?"
                  text="Все подразделы и карточки перенесутся в родительский раздел удаляемого раздела!"
                  yes-btn-title="Да, удалить"
                  :on-click-yes="onClickDelete"
                  no-btn-title="Нет"
                  :on-click-no="() => this.showDeleteDialog = false"
                  :opened="showDeleteDialog"
    />

    <Footer>
      <template slot="buttons">
        <v-btn color="secondary" icon large @click="onClickBack">
          <v-icon>mdi-keyboard-backspace</v-icon>
        </v-btn>

        <v-btn color="error" icon large @click="() => this.showDeleteDialog = true">
          <v-icon>mdi-delete-empty</v-icon>
        </v-btn>

        <v-btn color="primary" icon large @click="onClickSave">
          <v-icon>mdi-content-save-check-outline</v-icon>
        </v-btn>
      </template>
    </Footer>
  </div>
</template>

<script lang="ts">
import foldersApi from "~/repositories/folders/FoldersApi";
import FolderTree from "~/repositories/folders/FolderTree";
import FolderManage from "~/components/FolderManage.vue";
import DialogYesNot from "~/components/DialogYesNot.vue";
import Vue from "vue";

import {defineComponent} from "vue";
import Footer from "~/components/Footer.vue";
import alertsService, {Alert} from "~/services/AlertsService";

export default defineComponent({
  components: {
    Footer,
    DialogYesNot,
    FolderManage,

  },

  data() {
    return {
      currentFolder: new FolderTree(),
      showDeleteDialog: false
    }
  },

  methods: {
    getCurrentFolderId(): number | undefined {
      if (this.$route.params.folderId) {
        return parseInt(this.$route.params.folderId);
      }
      return;
    },

    async fetchCurrentFolder() {
      if (this.getCurrentFolderId() !== undefined) {
        let currentFolder: FolderTree | undefined = (await foldersApi.tree({
          ids: [this.getCurrentFolderId()]
        })).first();

        if (currentFolder) {
          this.currentFolder = currentFolder;
        }
      }
    },

    onClickBack() {
      if (this.currentFolder && this.currentFolder.id) {
        this.$router.push("/folders/" + this.currentFolder.id)
      } else {
        this.$router.back();
      }
    },

    async onClickSave() {
      try {
        this.currentFolder = await foldersApi.update(this.currentFolder);
        alertsService.addAlert(new Alert('success', 'Раздел успешно обновлен'));
      } catch (e) {
        alertsService.addAlert(new Alert('error', e.message));
        console.error(e);
      }
    },

    async onClickDelete() {
      try {
        await foldersApi.delete(this.currentFolder.id);
        this.onClickBack();
        alertsService.addAlert(new Alert('success', 'Раздел успешно удален'));
      } catch (e) {
        alertsService.addAlert(new Alert('error', e.message));
        console.error(e);
      }
    }
  },

  mounted() {
    this.fetchCurrentFolder();
  }

})
</script>

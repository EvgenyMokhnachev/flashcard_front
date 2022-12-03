<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Редактирование раздела</span>
        <v-btn small color="error" @click="() => this.showDeleteDialog = true">Удалить</v-btn>
      </v-card-title>

      <v-card-text>
        <FolderManage :folder-name="currentFolder.name" @update:folder-name="(newVal) => this.currentFolder.name = newVal"
                      @update:folder="(newVal) => this.currentFolder.parentId = newVal.id"
                      :pre-selected-folder-id="currentFolder.parentId" />

        <div class="d-flex justify-space-between">
          <v-btn @click="onClickBack">Назад</v-btn>
          <v-btn @click="onClickSave" color="primary">Сохранить</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <DialogYesNot title="Уверены, что хотите удалить раздел?"
                  text="Все подразделы и карточки перенесутся в родительский раздел удаляемого раздела!"
                  yes-btn-title="Да, удалить"
                  :on-click-yes="onClickDelete"
                  no-btn-title="Нет"
                  :on-click-no="() => this.showDeleteDialog = false"
                  :opened="showDeleteDialog"
    />
  </div>
</template>

<script lang="ts">
import foldersApi from "~/repositories/folders/FoldersApi";
import FolderTree from "~/repositories/folders/FolderTree";
import FolderManage from "~/components/FolderManage.vue";
import DialogYesNot from "~/components/DialogYesNot.vue";

export default {
  components: {
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
    getCurrentFolderId() {
      return this.$route.params.folderId;
    },

    async fetchCurrentFolder() {
      let currentFolder: FolderTree = (await foldersApi.tree({
        ids: [this.getCurrentFolderId()]
      })).first();

      if (currentFolder) {
        this.currentFolder = currentFolder;
      }
    },

    onClickBack() {
      if (this.currentFolder && this.currentFolder.parentId) {
        this.$router.push("/folders/" + this.currentFolder.parentId)
      } else {
        this.$router.back();
      }
    },

    async onClickSave() {
      try {
        this.currentFolder = await foldersApi.update(this.currentFolder);
      } catch (e) {
        console.error(e);
      }
    },

    async onClickDelete() {
      try {
        await foldersApi.delete(this.currentFolder.id);
        this.onClickBack();
      } catch (e) {
        console.error(e);
      }
    }
  },

  mounted() {
    this.fetchCurrentFolder();
  }

}
</script>

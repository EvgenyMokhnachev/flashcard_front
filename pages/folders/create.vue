<template>
  <v-card>
    <v-card-title>Создание раздела</v-card-title>
    <v-card-text>
      <FolderManage :folder-name="folderName" @update:folder-name="(newVal) => this.folderName = newVal"
                    :folder="parentFolder" @update:folder="(newVal) => this.parentFolder = newVal"
                    :pre-selected-folder-id="getParentFolderIdFromQuery()" />

      <div class="d-flex justify-space-between">
        <v-btn @click="onClickBack">Назад</v-btn>
        <v-btn @click="onClickCreate" color="primary">Создать</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss">
.parent_folder_select_item {
  .parent_tree_name {
    font-size: 12px;
  }

  .parent_name {
    font-size: 16px;
  }
}
</style>

<script lang="ts">
import foldersApi from "~/repositories/folders/FoldersApi";
import FolderCreateRequest from "~/repositories/folders/FolderCreateRequest";
import FoldersSelect from "~/components/FoldersSelect.vue";
import FolderManage from "~/components/FolderManage.vue";

export default {
  components: {
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
          parentId: this.parentFolder?.id
        }));
        this.$router.push("/folders/" + folder.id);
      } catch (e) {
        // TODO
        console.error(e);
      }
    },

    onClickBack() {
      this.$router.back();
    },
  },

}
</script>

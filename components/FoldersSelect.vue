<template>
  <v-select :label="label || 'Родительский раздел'" :items="items" v-model="selectedItem" item-value="id" return-object>
    <template slot="item" slot-scope="data">
      <div class="parent_folder_select_item">
        <div class="parent_tree_name" v-if="getFolderTreeName(data.item)">
          {{ getFolderTreeName(data.item) }} /
        </div>
        <div class="parent_name">
          {{ data.item.name }}
        </div>
      </div>
    </template>

    <template slot="selection" slot-scope="data">
      <div class="parent_folder_select_item">
        <span class="parent_tree_name" v-if="getFolderTreeName(data.item)">
          {{ getFolderTreeName(data.item) }} /
        </span>
        <span class="parent_name">
          {{ data.item.name }}
        </span>
      </div>
    </template>
  </v-select>
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
import authService from "~/services/AuthService";
import FolderTree from "~/repositories/folders/FolderTree";
import Folder from "~/repositories/folders/Folder";

export default {

  props: {
    value: {
      type: Folder | undefined
    },
    preSelectedFolderId: {
      type: Number | String
    },
    label: {
      type: String
    },
    allowEmpty: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      items: [],
      selectedItem: undefined,
    }
  },

  watch: {
    preSelectedFolderId(newVal, oldVal) {
      if (!this.selectedItem && this.items && this.items.length) {
        this.selectedItem = this.items.find(folder => parseInt(folder.id) === parseInt(this.preSelectedFolderId));
      }
    },
    selectedItem(newVal, oldVal) {
      this.$emit('input', this.selectedItem);
    }
  },

  methods: {
    async fetchParentSelectItems() {
      let foldersPagination = await foldersApi.tree({
        userIds: [authService.getUserId()]
      });

      this.items = [];

      if (this.allowEmpty) {
        this.items.push({id: null, name: 'Не указывать родителя'});
      }

      this.items = [...this.items, ...foldersPagination.items]

      if (this.preSelectedFolderId) {
        this.selectedItem = this.items.find(folder => parseInt(folder.id) === parseInt(this.preSelectedFolderId));
      }
    },

    getFolderTreeToRoot(folder?: FolderTree, treeItems?: FolderTree): FolderTree[] {
      if (!treeItems) {
        treeItems = [];
      }

      if (!folder) return treeItems;

      treeItems.push(folder);

      return this.getFolderTreeToRoot(folder.parent, treeItems);
    },

    getFolderTreeName(folder: FolderTree) {
      let folderTreeToRootArray = this.getFolderTreeToRoot(folder.parent);
      folderTreeToRootArray = folderTreeToRootArray.reverse();
      return folderTreeToRootArray.map(folder => folder.name).join(" / ");
    },
  },

  created() {
    foldersApi.onFoldersCrud(() => {
      this.fetchParentSelectItems();
    })
  },

  mounted() {
    this.fetchParentSelectItems();
  }

}
</script>

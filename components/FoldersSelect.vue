<template>
  <v-select :multiple="multiply" :label="label || 'Родительский раздел'" :items="items" v-model="selectedItem" item-value="id" return-object>
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
      <div class="parent_folder_select_item" :class="{selected: multiply}">
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
  width: 99.99%;
  padding-top: 5px;
  padding-bottom: 5px;

  &.selected {
    margin-top: 5px;
    margin-bottom: 5px;
    padding: 10px;
    background-color: #ebebeb;
    border-radius: 5px;
  }


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
import Vue, {defineComponent} from "vue";

const emptyOption = {id: null, name: 'Не указывать родителя'};

export default defineComponent({

  props: {
    value: {
    },
    preSelectedFolderId: {
    },
    label: {
    },
    allowEmpty: {
      default: true
    },
    multiply: {
      default: false
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
        this.processPreSelectedFolderIds();
      }
    },
    selectedItem(newVal, oldVal) {
      if (Array.isArray(newVal)) {
        let emptyOptionIndex = newVal.indexOf(emptyOption);

        if (emptyOptionIndex > -1 && newVal.length > 0) {
          this.selectedItem = [];
        }

        this.$emit('input', this.selectedItem);
        return;
      }

      if (this.selectedItem === emptyOption) {
        this.$emit('input', undefined);
        return;
      }

      this.$emit('input', this.selectedItem);
    },
  },

  methods: {
    async fetchParentSelectItems() {
      let foldersPagination = await foldersApi.tree({
        userIds: [authService.getUserId()]
      });

      this.items = [];

      if (this.allowEmpty) {
        this.items.push(emptyOption);
      }

      this.items = [...this.items, ...foldersPagination.items]

      this.processPreSelectedFolderIds();
    },

    processPreSelectedFolderIds() {
      if (this.preSelectedFolderId) {
        if (Array.isArray(this.preSelectedFolderId)) {
          this.selectedItem = this.items.filter(folder =>
            this.preSelectedFolderId.find(preSelectedFolderId => parseInt(folder.id) === parseInt(preSelectedFolderId))
          );
        } else {
          this.selectedItem = this.items.find(folder => parseInt(folder.id) === parseInt(this.preSelectedFolderId));
        }
      }
    },

    getFolderTreeToRoot(folder?: FolderTree, treeItems?: FolderTree[]): FolderTree[] {
      let treeItemsInit: FolderTree[] = treeItems ? [...treeItems] : [];

      if (!folder) return treeItemsInit;

      treeItemsInit.push(folder);

      return this.getFolderTreeToRoot(folder.parent, treeItemsInit);
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

})
</script>

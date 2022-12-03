<template>
  <div>
    <v-card elevation="2" class="mb-4" v-for="(item, i) in items" :key="i" :to="'/folders/' + item.id">
      <v-card-text class="d-flex align-center pa-2">
        <div><v-icon class="mr-2">mdi-folder</v-icon></div>
        <div>{{item.name}}</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style>

</style>

<script lang="ts">
import FoldersFilter from "~/repositories/folders/FoldersFilter";
import foldersApi from "~/repositories/folders/FoldersApi";

export default {

  props: {
    filter: {
      type: FoldersFilter,
      required: true,
      default: {}
    },
  },

  computed: {
  },

  data() {
    return {
      items: []
    }
  },

  methods: {
    async fetchItems() {
      let itemsPagination = await foldersApi.get(this.filter);
      this.items = itemsPagination.items;
    }
  },

  created() {
    foldersApi.onFoldersCrud(() => {
      this.fetchItems();
    })
  },

  async mounted() {
    this.fetchItems();
  }

}
</script>

<template>
  <v-dialog scrollable v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-card-title>
        Фильтр карточек
      </v-card-title>

      <v-card-text>
        <FoldersSelect :multiply="true" label="Раздел карточки" :allow-empty="true"
                       v-model="foldersData" :pre-selected-folder-id="preSelectedFoldersIds"
        />

        <CardDifficultSelect :multiply="true"
                             v-model="cardsDifficultTypes"
        />

        <v-btn-toggle v-model="bookmarkedData" color="primary" group dense>
          <v-btn :value="true" small>
            <v-icon color="red">mdi-bookmark</v-icon>
            В закладках
          </v-btn>

          <v-btn :value="false" small>
            <v-icon>mdi-bookmark-outline</v-icon>
            Нет в закладках
          </v-btn>
        </v-btn-toggle>

<!--        <DatePickerRangeDialog label="Фильтр по дате создания" />-->
      </v-card-text>

      <v-card-actions class="pb-0 pr-0 pl-0">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="clickClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer />
          <v-toolbar-items>
            <v-btn dark text @click="clickStartFilter">
              Запустить
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss">

</style>

<script lang="ts">
import {defineComponent} from "vue";
import FoldersList from "~/components/FoldersList.vue";
import FoldersSelect from "~/components/FoldersSelect.vue";
import CardDifficultSelect from "~/components/CardDifficultSelect.vue";
import DatePickerRangeDialog from "~/components/DatePickerRangeDialog.vue";
import CardsFilter from "~/repositories/cards/CardsFilter";
import Folder from "~/repositories/folders/Folder";

export default defineComponent({
  components: {DatePickerRangeDialog, CardDifficultSelect, FoldersSelect, FoldersList},

  props: {
    show: {type: Boolean},
    filter: {type: CardsFilter, required: false}
  },

  data() {
    return {
      filterData: {},

      preSelectedFoldersIds: [],
      foldersData: [],
      bookmarkedData: undefined,

      cardsDifficultTypes: []
    }
  },

  watch: {
    filter(filter: CardsFilter) {
      this.filterData = {...(filter || {})}

      this.preSelectedFoldersIds = [...this.filterData.folderIds];
      this.cardsDifficultTypes = [...this.filterData.difficultTypes];
      this.bookmarkedData = this.filterData.bookmarked;
    },

    foldersData(newFolders: Folder[]) {
      this.filterData.folderIds = !newFolders ? undefined : newFolders.map(folder => folder.id);
    },

    cardsDifficultTypes(newCardDifficultTypes) {
      this.filterData.difficultTypes = [...newCardDifficultTypes];
    },

    bookmarkedData(newVal) {
      this.filterData.bookmarked = newVal;
    }
  },

  methods: {
    clickClose() {
      this.$emit('close');
    },
    clickStartFilter() {
      this.$emit('onFilterStarted', this.filterData);
      this.$emit('close');
    }
  }
})
</script>

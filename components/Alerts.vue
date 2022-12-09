<template>
  <div class="alerts_component" v-if="items && items.length">
    <v-container>
      <v-alert elevation="3" :type="item.type" v-for="(item, i) of items" :key="i">
        {{item.text}}
      </v-alert>
    </v-container>
  </div>
</template>

<style lang="scss">
.alerts_component {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 5;
}
</style>

<script>
import {defineComponent} from "vue";
import alertsService, {Alert} from "~/services/AlertsService";

export default defineComponent({
  components: {},

  data() {
    return {
      items: []
    }
  },

  mounted() {
    this.items = alertsService.getAlerts();
    alertsService.onChangedAlerts((alerts) => {
      this.items = alerts || alertsService.getAlerts();
    });
  }
})
</script>

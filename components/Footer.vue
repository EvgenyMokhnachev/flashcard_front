<template>
  <v-footer class="component_footer pa-0" fixed app>
    <v-container v-if="hasButtonsSlot" class="iphone_menu_fix_top bottom_navigation_buttons">
      <slot name="buttons"/>
    </v-container>

    <div v-if="hasCustomSlot" class="iphone_menu_fix_top">
      <slot name="custom"/>
    </div>

    <div class="iphone_menu_fix_bottom" />
  </v-footer>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  computed: {
    hasButtonsSlot() {
      return !!this.$slots.buttons;
    },

    hasCustomSlot() {
      return !!this.$slots.custom;
    }
  }
})
</script>

<style lang="scss">
.component_footer {

  .bottom_navigation_buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      flex-grow: 0;
    }
  }

  .iphone_menu_fix_top {
    width: 100%;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    margin-bottom: -20px;
    z-index: 2;
    position: relative;
    background-color: inherit;
  }

  .iphone_menu_fix_bottom {
    position: relative;
    background: black;
    width: 100%;
    height: 40px;
    z-index: 1;
  }

}
</style>

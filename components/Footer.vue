<template>
  <v-footer class="component_footer pa-0" fixed app>
    <v-container class="bottom_navigation_buttons">
      <slot name="buttons"/>
    </v-container>
    <hr style="width: 100%; margin: 0 10px 10px" />
  </v-footer>
</template>

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
}
</style>

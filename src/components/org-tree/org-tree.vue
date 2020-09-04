<template>
  <div class="org-tree-container">
    <div class="org-tree" :class="{ horizontal, collapsable }">
      <org-tree-node
        :data="data"
        :props="props"
        :horizontal="horizontal"
        :vertical="vertical"
        :label-width="labelWidth"
        :ref-label-width="refLabelWidth"
        :label-color="labelColor"
        :label-selected-color="labelSelectedColor"
        :ref-label-color="refLabelColor"
        :ref-selected-color="labelSelectedColor"
        :collapsable="collapsable"
        :render-content="renderContent"
        :label-class-name="labelClassName"
        @on-node-click-focus="
          (e, data) => $emit('on-node-click-focus', e, data)
        "
        @on-node-click-ref="(e, data) => $emit('on-node-click-ref', e, data)"
        @on-node-mouseover="(e, data) => $emit('on-node-mouseover', e, data)"
        @on-node-mouseout="(e, data) => $emit('on-node-mouseout', e, data)"
      />
    </div>
  </div>
</template>

<script>
import templateRender from "./node";

export default {
  name: "Vue2OrgTree",
  components: {
    OrgTreeNode: {
      render: templateRender,
      functional: true,
    },
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    props: {
      type: Object,
      default: () => ({
        label: "label",
        expand: "expand",
        children: "children",
      }),
    },
    horizontal: Boolean,
    vertical: Boolean,
    selectedKey: { type: String, default: () => "" },
    collapsable: Boolean,
    renderContent: {
      type: Function,
      default: () => () => {},
    },
    labelWidth: { type: [String, Number], default: () => 100 },
    refLabelWidth: { type: [String, Number], default: () => 20 },
    labelColor: { type: [String], default: () => "#fff" },
    labelSelectedColor: { type: [String], default: () => "#fff" },
    refSelectedColor: { type: [String], default: () => "#fff" },
    refLabelColor: { type: [String], default: () => "#fff" },
    labelClassName: { type: [Function, String], default: () => "" },
    selectedClassName: { type: [Function, String], default: () => "" },
  },
};
</script>

<style lang="less">
@import "../../styles/org-tree";
</style>

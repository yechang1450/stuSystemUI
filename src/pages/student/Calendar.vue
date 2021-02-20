<template>
  <div>
    <el-calendar v-model="calendar">
      <template slot="dateCell" slot-scope="{ data }">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split("-").slice(2).join("-") }}
          {{ data.isSelected ? test(data.day) : "" }}
        </p>
      </template></el-calendar
    >
  </div>
</template>
<script>
export default {
  data() {
    return {
      calendar: new Date(),
    };
  },
  methods: {
    test: function (date) {
      this.$message.info(date);
    },
  },
};
</script>
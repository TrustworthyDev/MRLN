<template>
  <div class="shadow-sidebar">
    <div :class="determineSidebarClass" @mouseleave="leaveSidebar" @mouseenter="hoverSidebar">
      <!--   Start of Navbar Header   -->
      <div class="header-sidebar">
        <template v-if="determineSidebarStyle === 'max'">
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center justify-content-start">
              <logo class="logo" />
            </div>
          </div>

          <div class="toggle-sidebar"></div>
        </template>
        <template v-else>
          <div class="d-flex align-items-center justify-content-center">
            <logo class="logo" />
          </div>
        </template>
      </div>
      <!--   End of Navbar Header   -->
      <div class="container-sidebar">
        <div class="nav-group-sidebar">
          <template v-if="accountStore.getCurrentUser.role !== UserRoles.EDITOR">
            <nav-item-sidebar item-text="Articles" route-name="Articles" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('Articles') }">
              <vue-feather type="home"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="Agencies" route-name="Agencies" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('Agencies') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="Agency Classifications" route-name="Classifications"
              :dashboard-type="determineSidebarStyle" :class="{ 'nav-link--active': linkIsActive('Classifications') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="Alert Types" route-name="AlertTypes" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('AlertTypes') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="Alert Classifications" route-name="higherlevelalertclassifications"
              :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('higherlevelalertclassifications') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="Alert Subclassifications" route-name="SubtypeClassifications"
              :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('SubtypeClassifications') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="Article Types" route-name="ArticleTypes" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('ArticleTypes') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="Filing Types" route-name="FilingTypes" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('FilingTypes') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="Published Status" route-name="PublishedStatus" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('PublishedStatus') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar
              v-if="accountStore.getCurrentUser.role === UserRoles.ADMIN || accountStore.getCurrentUser.role === UserRoles.RULE_PUBLISHER || accountStore.getCurrentUser.role === UserRoles.RULE_EDITOR"
              item-text="Rules" route-name="Rules" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('Rules') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="Sectors" route-name="Sectors" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('Sectors') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="States" route-name="States" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('States') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="Status" route-name="Status" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('Status') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="Tags" route-name="Tags" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('Tags') }">
              <vue-feather type="bookmark"></vue-feather>
            </nav-item-sidebar>

            <!-- <nav-item-sidebar item-text="Changes Log" route-name="ChangesLog" :dashboard-type="determineSidebarStyle"
              :disabled="true" :class="{ 'nav-link--active': linkIsActive('ChangesLog') }">
              <vue-feather type="list"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="All Editors" route-name="AllEditors" :dashboard-type="determineSidebarStyle"
              :disabled="true" :class="{ 'nav-link--active': linkIsActive('AllEditors') }">
              <vue-feather type="list"></vue-feather>
            </nav-item-sidebar> -->

            <nav-item-sidebar v-if="accountStore.getCurrentUser.role === UserRoles.ADMIN" item-text="Manage Users"
              route-name="ManageUsers" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('ManageUsers') }">
              <vue-feather type="users"></vue-feather>
            </nav-item-sidebar>

            <nav-item-sidebar item-text="Logout" route-name="Logout" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('Logout') }">
              <vue-feather type="log-out"></vue-feather>
            </nav-item-sidebar>
          </template>

          <template v-else>
            <nav-item-sidebar item-text="Articles" route-name="AssignedArticles" :dashboard-type="determineSidebarStyle"
              :class="{ 'nav-link--active': linkIsActive('AssignedArticles') }">
              <vue-feather type="home"></vue-feather>
            </nav-item-sidebar>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from "@/components/Logo.vue";
import NavItemSidebar from "@/components/vertical-nav-menu/NavItemSidebar.vue";
import { useAccountStore } from "@/stores/account";
import { useDashboardStore } from "@/stores/dashboard";
import { DashboardStyleType } from "@/types/DashboardStyle";
import { UserRoles } from "@/types/User";
import { computed } from "vue";
import { useRoute } from "vue-router";

const dashboardStore = useDashboardStore();
const accountStore = useAccountStore();

let userRoles: UserRoles;

const determineSidebarStyle = computed(() => {
  if (dashboardStore.getDashboardStyle.pinned) {
    return DashboardStyleType.max;
  }
  if (dashboardStore.getDashboardStyle.type === DashboardStyleType.max) {
    return DashboardStyleType.max;
  } else {
    return DashboardStyleType.min;
  }
});

const determineSidebarClass = computed(() => {
  if (dashboardStore.getDashboardStyle.pinned) {
    return "dashboard-sidebar--max";
  }
  if (dashboardStore.getDashboardStyle.type === DashboardStyleType.max) {
    return "dashboard-sidebar--max";
  } else {
    return "dashboard-sidebar--min";
  }
});

const hoverSidebar = () => {
  dashboardStore.setDashboardStyleType(DashboardStyleType.max);
};
const leaveSidebar = () => {
  dashboardStore.setDashboardStyleType(DashboardStyleType.min);
};


const linkIsActive = (routeName: string): boolean => {
  const route = useRoute();
  return route.name === routeName;
};
</script>

<style scoped lang="scss">
.shadow-sidebar {
  z-index: 12;
}

.dashboard-sidebar--max {
  background-color: #ffffff;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08) !important;
  overflow-x: hidden;
  border-radius: 0 10px 10px 0;
  z-index: 2;

  max-width: 250px;
  min-width: 250px;
  text-wrap: none;

  transition: 0.25s;

  display: flex;
  flex-flow: column;
  // height: 100%;
}

.dashboard-sidebar--min {
  background-color: #ffffff;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08) !important;
  overflow-x: hidden;
  border-radius: 0 10px 10px 0;
  z-index: 2;

  max-width: 80px;
  min-width: 80px;

  transition: 0.25s;
  text-wrap: none;
  // height: 100%;
}

.dashboard-sidebar--overlay {
  background-color: #ffffff;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08) !important;
  overflow-x: hidden;
  border-radius: 0 10px 10px 0;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 999;

  max-width: 250px;
  min-width: 250px;

  transition: 0.25s;
  text-wrap: none;
}

.header-sidebar {
  padding: 20px 19px 16px 23px;
  transition: all 0.25s ease;

  .logo {
    padding: 0;
    height: 40px;
  }

  .logo-text {
    font-size: 22px;
    font-weight: 600;
    margin-left: 5px;
    padding: 0;
  }

  .toggle-sidebar {
    cursor: pointer;
    transition: 0.25s ease;

    &:hover {
      color: #d0d0d0;
    }
  }
}

.container-sidebar {
  padding-top: 0.5rem;
  height: calc(let(--vh, 1vh) * 100 - 77px);

  .nav-group-sidebar {
    width: 100%;
    // text-align: center;
  }
}

.mobile-background {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.1);
}

.nav-link--active {
  border-radius: 4px;
  background: linear-gradient(118deg,
      rgba(136, 173, 58, 1),
      rgba(136, 173, 58, 0.7));
  color: white;
  box-shadow: 0 0 10px 1px rgba(136, 173, 58, 0.7);
}
</style>

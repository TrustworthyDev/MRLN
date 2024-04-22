<template>
  <div class="articleDashboard" style="margin-top: 15px;">
    <b-modal id="modal-prevent-closing" size="xl" ref="modal" title="Duplicates" v-model="duplicates_resetModal"
      @ok="duplicates_handleOk">
      <Multiselect v-model="selected_duplicate_columns" :options="objectForDuplicates" mode="tags" :searchable="true" />
    </b-modal>

    <div class="row">
      <div class="col-md-10">
        <div class="row row-cols-1 row-cols-lg-6 g-1 g-lg-1">
          <div class="col">
            <button type="button" class="btn btn-sm btn-success w-100 mt-1" @click="selectAllRows">
              <i class="fa fa-wrench" aria-hidden="true"></i>
              {{ select_all_text }}</button>
          </div>
          <div class="col">
            <button @click="toggleShowDuplicates" class="btn btn-sm btn-success w-100 mt-1">
              <!-- {{ showDuplicates ? "Hide Duplicates" : "Show Duplicates" }} -->
              <i class="fa fa-clone" aria-hidden="true"></i>
              Duplicates

            </button>
          </div>
          <div class="col">
            <button @click="clearAllFilters" class="btn btn-sm btn-success w-100 mt-1">
              <i class="fa fa-retweet" aria-hidden="true"></i>
              Reset Filters
            </button>
          </div>
          <div class="col">
            <button @click="showFeedbackArticles" class="btn btn-sm btn-success w-100 mt-1">
              <i class="fa fa-retweet" aria-hidden="true"></i>
              Feedbacks
            </button>
          </div>
          <div class="col">
            <button type="button" class="btn btn-sm btn-success w-100 mt-1" @click="toggle">
              <i class="fa fa-arrows-alt" aria-hidden="true"></i>
              Fullscreen</button>
          </div>
          <div class="col">
            <button type="button" class="btn btn-sm btn-success w-100 mt-1" @click="bulkStatusUpdates">
              <i class="fa fa-wrench" aria-hidden="true"></i>
              Bulk Change status</button>
          </div>

          <div class="col">
            <button type="button" class="btn btn-sm btn-success w-100 mt-1" @click="ColumnMoved">
              <i class="fa fa-cog" aria-hidden="true"></i>
              Save Postion</button>
          </div>

          <div class="col">
            <button type="button" class="btn btn-sm btn-success w-100 mt-1" @click="ResetColumnMoved">
              <i class="fa fa-undo" aria-hidden="true"></i>
              Reset Postion</button>
          </div>

        </div>
      </div>
      <div class="col-md-2">
        <p>
          <span v-for="item in editingUsers" :key="item.node" class="user">
            <span class="color-box" :style="{ backgroundColor: item.color }"></span> {{ item.name }}
          </span>
        </p>
      </div>
    </div>


    <div class="grid-container">
      <div class="page-size-options mt-2 mb-2">
        Page Size:
        <select v-model="paginationPageSize" v-on:change="onPageSizeChanged()" id="page-size" style="width: 45px;">
          <option value="40">40</option>
          <option value="40">60</option>
          <option value="40">70</option>
          <option value="80">80</option>
          <option value="100">100</option>
        </select>
      </div>
      <ag-grid-vue id="myGrid" :cacheBlockSize="cacheBlockSize" :cacheOverflowSize="cacheOverflowSize"
        :columnDefs="columnDefs" :components="components" :defaultColDef="defaultColDef" :embedFullWidthRows="true"
        :enterMovesDown="true" :enterMovesDownAfterEdit="true" :getRowId="getRowId" :maxBlocksInCache="maxBlocksInCache"
        :maxConcurrentDatasourceRequests="maxConcurrentDatasourceRequests" :pagination="true"
        :paginationPageSize="paginationPageSize" :rowModelType="rowModelType" :rowSelection="rowSelection"
        :suppressServerSideInfiniteScroll="suppressServerSideInfiniteScroll" :suppressPropertyNamesCheck="true"
        class="ag-theme-alpine mt-4" style="width: 100%; height: 100%" @cellEditingStopped="editingDone"
        :getRowStyle="getRowStyle" @paginationChanged="onPageChange" @cell-clicked="onCellClicked"
        :rowClassRules="rowClassRules" @cell-double-clicked="onCellDoubleClicked" @selectionChanged="onSelectionChanged"
        :rowMultiSelectWithClick="true" :autoGroupColumnDef="autoGroupColumnDef" :animateRows="true"
        @first-data-rendered="onFirstDataRendered" :onCellValueChanged="onCellValueChanged" :sideBar="sideBar"
        @grid-ready="onGridReady"></ag-grid-vue>

    </div>
    <!-- global modal articles -->
    <articlesModal ref="globalArticlesModal" :isMultipleSelect="articlesModal.isMultipleSelect"
      :modalTitle="articlesModal.modalTitle" :dataInputModal="articlesModal.dataInputModal"
      :options="articlesModal.options" :invalidFeedback="articlesModal.invalidFeedback"
      :typeInput="articlesModal.typeInput" @submit="submitArticlesModal" @reset="resetArticlesModal" />

    <b-modal v-model="show_edit_summary_title" no-close-on-backdrop size="lg"
      :title="`Edit (${this.summaryTitleModal.articleId} - ${this.summaryTitleModal.regalytics_alert_id})`"
      @ok="handle_edit_summary_title_Ok">
      <div>
        <label for="arcticle-input">Title </label>
        <b-form-textarea id="arcticle-input" debounce="0" type="search" v-model="summaryTitleModal.title.value">
        </b-form-textarea>
      </div>

      <div class="mt-2">
        <label for="textarea-summary">AI Summary </label>
        <b-form-textarea v-if="summaryTitleModal.ai_summary.value && summaryTitleModal.ai_summary.value.length"
          id="textarea-summary" v-model="summaryTitleModal.ai_summary.value" max-rows="15" rows="3"></b-form-textarea>
        <div>
          <span v-if="!summaryTitleModal.ai_summary.value || summaryTitleModal.ai_summary.value.length == 0">This
            article
            has no AI Summary.</span>
        </div>
      </div>
      <div class="mt-2">
        <label for="textarea-summary">Summary </label>
        <b-form-textarea id="textarea-summary" v-model="summaryTitleModal.summary.value" max-rows="15"
          rows="3"></b-form-textarea>
      </div>

      <div class="mt-2">
        <label for="textarea-ai-sentiment">AI Sentiment </label>
        <b-form-textarea id="textarea-ai-sentiment" v-model="summaryTitleModal.ai_sentiment.value" disabled
          max-rows="15" rows="3"></b-form-textarea>
      </div>

      <div class="mt-2">
        <label for="textarea-ai-title">AI Title </label>
        <b-form-textarea id="textarea-ai-title" v-model="summaryTitleModal.ai_title.value" disabled max-rows="15"
          rows="1"></b-form-textarea>
      </div>

      <div class="mt-2">
        <label for="textarea-source-language">Source Language </label>
        <b-form-textarea id="textarea-source-language" v-model="summaryTitleModal.source_language.value" disabled
          max-rows="15" rows="1"></b-form-textarea>
      </div>

      <div class="mt-2">
        <label for="textarea-ai-date">AI Translated Date </label>
        <p>{{ summaryTitleModal.ai_translated_date.value }} </p>
      </div>

      <hr>




      <div class="mt-2 input-summary-modal">
        <div class="row">
          <div class="col-sm-4">
            <div class="section-wrap-inner">
              <div class="mt-2">
                <label for="arcticle-input">Proposed Comments Due Date </label>
                <VueDatePicker format="yyyy-MM-dd" model-type="yyyy-MM-dd" :enable-time-picker="false"
                  v-model="summaryTitleModal.proposed_comments_due_date.value"></VueDatePicker>
              </div>

              <div class="mt-2">
                <label for="arcticle-input">Rule Effective Date </label>
                <VueDatePicker format="yyyy-MM-dd" model-type="yyyy-MM-dd" :enable-time-picker="false"
                  v-model="summaryTitleModal.rule_effective_date.value"></VueDatePicker>
              </div>

              <div class="mt-2">
                <label for="arcticle-input">Original Publication Date </label>
                <VueDatePicker format="yyyy-MM-dd" model-type="yyyy-MM-dd" :enable-time-picker="false"
                  v-model="summaryTitleModal.original_publication_date.value"></VueDatePicker>
              </div>

              <div class="mt-2 form-check form-check-inline">
                <input type="checkbox" class="form-check-input" v-model="summaryTitleModal.flag.value">
                <label>Flag?</label>
              </div>

              <div class="mt-2">
                <b-form-input id="arcticle-input" debounce="0" type="text" placeholder="Reason"
                  v-model="summaryTitleModal.reason.value">
                </b-form-input>
              </div>
            </div>
          </div>

          <div class="col-sm-8">
            <div class="section-wrap-inner">
              <h4>Event Info</h4>
              <div class="row">
                <div class="col-sm-6">
                  <div class="mt-2">
                    <label for="arcticle-input">Event Start Date </label>
                    <VueDatePicker format="yyyy-MM-dd" model-type="yyyy-MM-dd" :enable-time-picker="false"
                      v-model="summaryTitleModal.event_start_date.value"></VueDatePicker>
                  </div>

                  <div class="mt-2">
                    <label for="arcticle-input">Event End Date </label>
                    <VueDatePicker format="yyyy-MM-dd" model-type="yyyy-MM-dd" :enable-time-picker="false"
                      v-model="summaryTitleModal.event_end_date.value"></VueDatePicker>
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="mt-2">
                    <label for="arcticle-input">Event Start Time </label>
                    <VueDatePicker time-picker format="HH:mm:ss" model-type="HH:mm:ss"
                      v-model="summaryTitleModal.event_start_time.value">
                    </VueDatePicker>
                  </div>

                  <div class="mt-2">
                    <label for="arcticle-input">Event End Time </label>
                    <VueDatePicker time-picker format="HH:mm:ss" model-type="HH:mm:ss"
                      v-model="summaryTitleModal.event_end_time.value">
                    </VueDatePicker>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <div class="mt-2">
                    <label for="arcticle-input">Event Location </label>
                    <b-form-input id="arcticle-input" debounce="0" type="search"
                      v-model="summaryTitleModal.event_location.value">
                    </b-form-input>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-6">
                  <div class="mt-2">
                    <label for="arcticle-input">Published Status </label>
                    <v-select v-model="summaryTitleModal.published_status.value" :options="published_status"
                      :push-tags="true" :reduce="(data) => data.id || data" :required="true" label="name" />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="mt-2">
                    <label for="arcticle-input">URL </label>
                    <div class="row">
                      <div class="col-sm-10">
                        <b-form-input id="arcticle-input" debounce="0" type="text"
                          v-model="summaryTitleModal.pdf_url.value">
                        </b-form-input>
                      </div>
                      <div class="col-sm-2 copy-icon-wrap">
                        <vue-feather type="copy" @click="copyURL(summaryTitleModal.pdf_url.value)"></vue-feather>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </b-modal>

    <b-modal v-model="show_bulk_status_update" no-close-on-backdrop size="lg" title="Bulk UI Published Status"
      @ok="handle_ui_bulk_status_update_Ok">
      <div>
        <label for="arcticle-input">Published Status: </label>
        <v-select v-model="bulk_published_status" :options="published_status" :push-tags="true"
          :reduce="(data) => data.id || data" :required="true" label="name" />
      </div>
    </b-modal>

    <b-modal v-model="show_history_logs" no-close-on-backdrop size="xl" :title="`Article History`"
      @ok="handle_edit_summary_Ok" @close="handle_history_log_close" @cancel="handle_history_log_close">
      <div>
        <b-table :fields="history_fields" :items="history_items" hover show-empty striped>
          <template #empty="scope">
            <h4>{{ scope.emptyText }}</h4>
          </template>
          <template #emptyfiltered="scope">
            <h4>{{ scope.emptyFilteredText }}</h4>
          </template>

          <template #cell(old_value)="row">
            {{ fetch_values(row.item, "old_value") }}
          </template>
          <template #cell(new_value)="row">
            {{ fetch_values(row.item, "new_value") }}
          </template>

          <template #cell(created_at)="row">
            {{ new Date(row.item.created_at).toDateString() }}
          </template>

          <template #cell(trigger)="row">
            <div v-if="isEditRulePath(row.item.trigger)">
              <!-- <a :href="getEditRulePath(row.item.trigger)" target="_blank">{{ getEditRulePath() }}</a> -->
              <a :href="getEditRulePathAndName(row.item).path" target="_blank">
                {{ getEditRulePathAndName(row.item).ruleName || 'Rule' }}
              </a>
            </div>
            <div v-else>
              {{ row.item.trigger }}
            </div>
          </template>

          <template #cell(action)="row">
            <b-button class="mr-1 btn btn-outline-success text-white" size="sm" @click="revert_changes(row.item)">
              Revert Changes <i aria-hidden="true" class="fa fa-undo"></i>
            </b-button>
          </template>
        </b-table>
      </div>
    </b-modal>

    <b-modal v-model="show_feedback" no-close-on-backdrop size="xl"
      :title="`Article Feedback (${opened_feedback_article_title})`" @ok="handle_edit_summary_Ok"
      @close="handle_history_log_close" @cancel="handle_history_log_close">
      <div>
        <Feedback ref="feedBackModal" />

        <button class="btn btn-success btn-sm mb-3 btn-block" @click="openFeedbackModal(undefined, true)">
          <vue-feather type="plus"></vue-feather>
          <span>New Feedback</span>
        </button>

        <b-table :fields="feedback_fields" :items="feedback_items" hover show-empty striped>
          <template #cell(feedback)="row">
            {{ row.item?.messages[row.item?.messages?.length - 1]?.message }}
          </template>

          <template #cell(action)="row">
            <div class="actions_wrapper">
              <b-button class="mr-1 btn btn-success text-white" size="sm" @click="openFeedbackModal(row.item)">
                View
              </b-button>
              <b-button v-if="row.item.status !== feedbackStatusOptions.RESOLVED"
                class="mr-1 btn btn-success text-white" size="sm" @click="resolveFeedback(row.item)">
                Resolve
              </b-button>
              <b-button v-if="row.item.status === feedbackStatusOptions.NEW" class="mr-1 btn btn-success text-white"
                size="sm" @click="takeUpFeedback(row.item)">
                Take Up
              </b-button>
            </div>
          </template>
        </b-table>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { AgGridVue } from "@ag-grid-community/vue3";
import "@ag-grid-enterprise/server-side-row-model";
import { isProxy, toRaw } from "vue";

// import { AllModules } from "@ag-grid-enterprise/all-modules";
import {
  AgencyApi,
  AlertTypeApi,
  Articles,
  FeedbackApi,
  HistoryLogs
} from "@/api";
import TimePickerEditor from '@/components/ag-grid-custom-cell-editors/cellTimeEditor.vue';
import customFeedbacksFilter from '@/components/ag-grid-custom-filters/customFeedbacksFilter.vue';
import customTimeFilter from '@/components/ag-grid-custom-filters/customTimeFilter.vue';
import articlesModal from "@/components/articles/articles-modal/articles-modal-select";
import { showConfirmationAlert } from "@/helpers/SweetAlert";
import { useAccountStore } from "@/stores/account";
import { useNotificationStore } from "@/stores/notifications";
import { FeedbackStatusOptions } from "@/types/Feedback";
import { UserPermissions } from "@/types/User";
import AgencyRender from "@/views/dashboard/articles/CellRenderList.vue";
import ClassificationRender from "@/views/dashboard/articles/ClassificationRendered";
import Feedback from "@/views/dashboard/articles/Feedback.vue";
import FilingTypesRendered from "@/views/dashboard/articles/FilingTypesRendered";
import RelatedArticles from "@/views/dashboard/articles/RelatedArticles";
import RulesRender from "@/views/dashboard/articles/RulesRendered";
import SectorRender from "@/views/dashboard/articles/SectorRendered";
import StatesRendered from "@/views/dashboard/articles/StatesRendered";
import StatusRendered from "@/views/dashboard/articles/StatusRendered";
import SubtypeClassificationRendered from "@/views/dashboard/articles/SubtypeClassificationRendered";
import TagsRendered from "@/views/dashboard/articles/TagsRendered";
import HistoryLogActionButton from "@/views/dashboard/articles/historyLogActionButton.vue";
import Multiselect from '@vueform/multiselect';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { diff } from "json-diff";
import Card from "primevue/card";
import { io } from 'socket.io-client';
import { api as fullscreen } from 'vue-fullscreen';

const store = useAccountStore();

window.getDatePicker = function getDatePicker() {
  class Datepicker {
    constructor() { }
    init(params) {
      this.eInput = document.createElement("input");
      this.eInput.value = params.value;
      this.eInput.classList.add("ag-input");
      this.eInput.style.height = "100%";
      // eslint-disable-next-line no-undef
      $(this.eInput).datepicker({ dateFormat: "dd/mm/yy" });
    }
    getGui() {
      return this.eInput;
    }
    afterGuiAttached() {
      this.eInput.focus();
      this.eInput.select();
    }
    getValue() {
      return this.eInput.value;
    }
    destroy() { }
    isPopup() {
      return false;
    }
  }

  return Datepicker;
};

const filterDateParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    // console.log("filter date param");
    const dateAsString = cellValue;
    if (dateAsString == null) return -1;
    const dateParts = dateAsString.split("/");
    const cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );

    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }

    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }

    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
  minValidYear: 2000,
  maxValidYear: 2100,
  inRangeFloatingFilterDateFormat: "Do MMM YYYY",
};

const EDIT_ALERT_PERMISSION = UserPermissions.EDIT_ALERT;
const PUBLISH_ALERT_PERMISSION = UserPermissions.PUBLISH_ALERT;

const notificationStore = useNotificationStore();

export default {
  mixins: [Articles, AgencyApi, AlertTypeApi, HistoryLogs, FeedbackApi],
  components: {
    Multiselect: Multiselect,
    "ag-grid-vue": AgGridVue,
    AgencyRender: AgencyRender,
    SectorRender: SectorRender,
    RelatedArticles: RelatedArticles,
    RulesRender: RulesRender,
    historyLogActionButton: HistoryLogActionButton,
    articlesModal: articlesModal,
    ClassificationRender: ClassificationRender,
    FilingTypesRendered: FilingTypesRendered,
    StatusRendered: StatusRendered,
    StatesRendered: StatesRendered,
    TagsRendered: TagsRendered,
    SubtypeClassificationRendered: SubtypeClassificationRendered,
    Feedback: Feedback,
    Card: Card,
    customTimeFilter,
    customFeedbacksFilter,
    VueDatePicker,
    'time-picker-editor': TimePickerEditor,
  },
  data() {
    return {
      select_all_text: 'Select All',
      grid_selected_rows: [],
      selected_duplicate_columns: [],
      objectForDuplicates: [],
      fullscreen: false,
      duplicates_resetModal: false,
      teleport: true,
      isCellDoubleClicked: false,
      selectedNodeId: null,
      highlightedCell: null,
      editingUsers: [],
      showDuplicates: false,
      feedbackStatusOptions: FeedbackStatusOptions,
      isFeedback: false,
      history_selected_id: "",
      all_agencies: [],
      history_items: [],
      feedback_items: [],
      all_sectors: [],
      user_rules: [],
      all_users: [],
      classifications: [],
      alert_types: [],
      rule_classifications: [],
      article_types: [],
      subtype_classifications: [],
      tags: [],
      states: [],
      published_status: [],
      filing_types: [],
      status: [],
      filter_options_agencies: [],
      filter_options_rules: [],
      filter_options_sectors: [],
      history_fields: [
        // {
        //   key: 'id',
        //   sortable: true
        // },
        {
          key: "field_name",
          sortable: false,
        },
        {
          key: "old_value",
          sortable: false,
        },
        {
          key: "new_value",
          sortable: false,
        },
        {
          key: "user",
          sortable: false,
        },
        {
          key: "created_at",
          sortable: true,
        },
        {
          key: "trigger",
          sortable: true,
        },
        {
          key: "action",
          sortable: false,
        },
      ],
      feedback_fields: [
        {
          key: "id",
          sortable: false,
        },
        {
          key: "created_by_name",
          label: "Created By",
          sortable: false,
        },
        {
          key: "feedback",
          tdClass: "feedback_text",
          sortable: false,
        },
        {
          key: "status",
          sortable: false,
        },
        {
          key: "assigned_to_name",
          label: "Assigned To",
          sortable: false,
        },
        {
          key: "action",
          tdClass: "actions_column",
          sortable: false,
        },
      ],
      edit_feedback: {
        id: "",
        feedback: "",
      },
      edit_alert_type: {
        name: "",
        id: "",
        selected_alert_type: "",
      },
      edit_classification: {
        name: "",
        id: "",
        selected_classification: "",
      },
      edit_agency_form: {
        name: "",
        id: "",
        selected_agencies: [],
      },
      edit_sector_form: {
        name: "",
        id: "",
        selected_sectors: [],
      },
      edit_agency_form_state: {
        name: "",
        selected_agencies: "",
      },
      edit_sector_form_state: {
        name: "",
        selected_sectors: "",
      },
      edit_summary_form: {
        name: "",
        id: "",
        summary: "",
      },
      edit_summary_form_state: {
        name: "",
        summary: "",
      },
      rowClassRules: {
        'red-row': params => {
          return params.data && params.data.new_feedbacks && params.data.new_feedbacks.new_feedback;
        },
      },
      show_edit_agency: false,
      show_edit_sector: false,
      show_history_logs: false,
      show_feedback: false,
      opened_feedback_article_id: null,
      opened_feedback_article_title: null,
      show_edit_summary_title: false,
      show_bulk_status_update: false,
      // modules: AllModules,
      pageNumber: 1,
      totalPages: null,
      suppressServerSideInfiniteScroll: null,
      detailCellRenderer: null,
      groupDefaultExpanded: null,
      filterDataSet: [],
      components: null,
      columnDefs: [
        {
          headerName: "New Feedback",
          field: "new_feedbacks",
          hide: true,
          filter: "customFeedbacksFilter"
        },
        {
          headerName: "",
          tooltipValueGetter: this.tooltipGetter,
          field: "selected",
          minWidth: 40,
          resizable: false,
          pinned: 'left',
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
        },
        {
          field: "id",
          tooltipValueGetter: this.tooltipGetter,
          filter: "agTextColumnFilter",
          headerName: "ID",
          pinned: 'left',
          editable: false,
          inputType: "text-input",
        },
        {
          field: "pdf_url",
          tooltipValueGetter: this.tooltipGetter,
          filter: "agTextColumnFilter",
          headerName: "URL",
          inputType: "text-input",
        },
        {
          field: "article_type",
          tooltipValueGetter: this.tooltipGetter,
          minWidth: 190,
          headerName: "Article Type",
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const article_types = this.article_types;
            return {
              values: function (params) {
                const filter_article_types = [];
                article_types.map((v, k) => {
                  filter_article_types.push(v.name);
                });
                params.success(filter_article_types);
              },
              showTooltips: true,
            };
          },
          inputType: "dropdown",
        },
        {
          field: "alert_type",
          tooltipValueGetter: this.tooltipGetter,
          minWidth: 190,
          headerName: "Alert Type",
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const alert_types = this.alert_types;
            return {
              values: function (params) {
                const filter_alert_types = [];
                alert_types.map((v, k) => {
                  filter_alert_types.push(v.name);
                });
                params.success(filter_alert_types);
              },
              showTooltips: true,
            };
          },
          inputType: "dropdown",
        },
        {
          field: "rule_classification",
          tooltipValueGetter: this.tooltipGetter,
          minWidth: 190,
          headerName: "Rule Classification",
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const rule_classifications = this.rule_classifications;
            return {
              values: function (params) {
                const filter_rule_classifications = [];
                rule_classifications.map((v, k) => {
                  filter_rule_classifications.push(v.name);
                });
                params.success(filter_rule_classifications);
              },
              showTooltips: true,
            };
          },
          inputType: "dropdown",
        },
        {
          field: "classification",
          tooltipValueGetter: this.tooltipGetter,
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const classifications = this.classifications;
            return {
              values: function (params) {
                const filter_classifications = [];
                classifications.map((v, k) => {
                  filter_classifications.push(v.name);
                });
                params.success(filter_classifications);
              },
              showTooltips: true,
            };
          },
          // cellRenderer: "ClassificationRender",
          headerName: "Agency Classification",
          autoHeight: true,
          // isMultipleSelect: true,
          inputType: "dropdown",
        },
        {
          field: "title",
          filter: "agTextColumnFilter",
          // wrapText: true,
          width: 500,
          headerName: "Title",
          inputType: "text-input",
        },
        {
          field: "ai_sentiment",
          filter: "agTextColumnFilter",
          // wrapText: true,
          width: 500,
          headerName: "AI Sentiment",
          inputType: "text-input",
        },
        {
          field: "ai_title",
          filter: "agTextColumnFilter",
          // wrapText: true,
          width: 500,
          headerName: "AI Title",
          inputType: "text-input",
        },
        {
          field: "source_language",
          filter: "agTextColumnFilter",
          // wrapText: true,
          width: 500,
          headerName: "Source Language",
          inputType: "text-input",
        },
        {
          field: "ai_translated_date",
          filter: "agTextColumnFilter",
          // wrapText: true,
          width: 500,
          headerName: "Translated Date",
          inputType: "dropdown",
        },

        {
          field: "ai_summary",
          filter: "agTextColumnFilter",
          width: 800,
          headerName: "AI Summary",
          inputType: "text-area",
        },

        {
          field: "summary",
          filter: "agTextColumnFilter",
          width: 800,
          headerName: "Summary",
          inputType: "text-area",
        },
        {
          field: "sector_type",
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const sectors = this.all_sectors;
            return {
              values: function (params) {
                const filter_sectors = [];
                sectors.map((v, k) => {
                  filter_sectors.push(v.name);
                });
                params.success(filter_sectors);
              },
              showTooltips: true,
            };
          },
          cellRenderer: "SectorRender",
          autoHeight: true,
          width: 200,
          isMultipleSelect: true,
          headerName: "Sector Type",
          inputType: "dropdown",
        },
        {
          field: "agencies",
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const all_agencies = this.all_agencies;
            return {
              values: function (params) {
                const filter_agencies = [];
                all_agencies.map((v, k) => {
                  filter_agencies.push(v.name);
                });
                params.success(filter_agencies);
              },
              showTooltips: true,
            };
          },
          cellRenderer: "AgencyRender",
          autoHeight: true,
          width: 200,
          isMultipleSelect: true,
          headerName: "Agencies",
          inputType: "dropdown",
        },
        {
          field: "filing_type",
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const filing_types = this.filing_types;
            return {
              values: function (params) {
                const filter_filing_types = [];
                filing_types.map((v, k) => {
                  filter_filing_types.push(v.name);
                });
                params.success(filter_filing_types);
              },
              showTooltips: true,
            };
          },
          autoHeight: true,
          headerName: "Filing Type",
          editable: false,
          inputType: "dropdown",
        },
        {
          field: "in_federal_register",
          filter: "agTextColumnFilter",
          headerName: "In Federal Register",
          inputType: "text-input",
        },
        {
          field: "original_publication_date",
          filter: "agDateColumnFilter",
          filterParams: filterDateParams,
          headerName: "Original Publication Date",
          // wrapText: true,
          width: 150,
          inputType: "dropdown"
        },
        {
          field: "status",
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const status = this.status;
            return {
              values: function (params) {
                const filter_status = [];
                status.map((v, k) => {
                  filter_status.push(v.name);
                });
                params.success(filter_status);
              },
              showTooltips: true,
            };
          },
          autoHeight: true,
          headerName: "Status",
          inputType: "dropdown",
        },
        {
          field: "latest_update",
          filter: "agDateColumnFilter",
          filterParams: filterDateParams,
          headerName: "Latest Update",
          editable: this.hasPermissions(EDIT_ALERT_PERMISSION),
          width: 150,
          cellEditor: "datePicker",
          inputType: "date-picker",
        },
        {
          field: "rules",
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const user_rules = this.user_rules;
            return {
              values: function (params) {
                const filter_user_rules = [];
                user_rules.map((v, k) => {
                  filter_user_rules.push(v.name);
                });
                params.success(filter_user_rules);
              },
              showTooltips: true,
            };
          },
          cellRenderer: "RulesRender",
          autoHeight: true,
          width: 200,
          headerName: "Rules",
          isMultipleSelect: true,
          inputType: "dropdown",
        },
        {
          field: "bill_identifier",
          filter: "agTextColumnFilter",
          headerName: "Bill Identifier",
          editable: false,
          width: 150,
          inputType: "text-input",
        },
        {
          field: "docket_file_number",
          filter: "agTextColumnFilter",
          inputType: "text-input",
          headerName: "Docket File Number",
          width: 150,
        },
        {
          field: "federal_register_number",
          filter: "agTextColumnFilter",
          headerName: "Federal Register Number",
          editable: this.hasPermissions(EDIT_ALERT_PERMISSION),
          width: 150,
          inputType: "text-input",
        },
        {
          field: "federal_register_publication_date",
          filter: "agDateColumnFilter",
          filterParams: filterDateParams,
          width: 200,
          headerName: "Federal Register Publication Date",
          // wrapText: true,
          editable: this.hasPermissions(EDIT_ALERT_PERMISSION),
          cellEditor: "datePicker",
          inputType: "date-picker",
        },
        {
          field: "order_notice",
          filter: "agTextColumnFilter",
          inputType: "text-input",
          headerName: "Order Notice",
          width: 150,
        },
        {
          field: "proposed_comments_due_date",
          filter: "agDateColumnFilter",
          filterParams: filterDateParams,
          // wrapText: true,
          width: 200,
          headerName: "Proposed Comments Due Date",
          inputType: "dropdown",
        },
        {
          field: "regalytics_alert_id",
          filter: "agTextColumnFilter",
          headerName: "Regalytics Alert Id",
          editable: false,
          width: 150,
          inputType: "text-input",
        },
        {
          field: "rule_effective_date",
          filter: "agDateColumnFilter",
          filterParams: filterDateParams,
          // wrapText: true,
          width: 200,
          headerName: "Rule Effective Date",
          inputType: "dropdown",
        },
        {
          field: "sec_release_number",
          filter: "agTextColumnFilter",
          inputType: "text-input",
          headerName: "Sec Release Number",
        },
        {
          field: "subtype_classification",
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const subtype_classifications = this.subtype_classifications;
            return {
              values: function (params) {
                const filter_subtype_classifications = [];
                subtype_classifications.map((v, k) => {
                  filter_subtype_classifications.push(v.name);
                });
                params.success(filter_subtype_classifications);
              },
              showTooltips: true,
            };
          },
          cellRenderer: "SubtypeClassificationRendered",
          autoHeight: true,
          headerName: "Alert Subclassification",
          isMultipleSelect: true,
          inputType: "dropdown",
        },
        {
          field: "states",
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const states = this.states;
            return {
              values: function (params) {
                const filter_states = [];
                states.map((v, k) => {
                  filter_states.push(v.name);
                });
                params.success(filter_states);
              },
              showTooltips: true,
            };
          },
          cellRenderer: "StatesRendered",
          autoHeight: true,
          headerName: "States",
          isMultipleSelect: true,
          inputType: "dropdown",
        },
        {
          field: "tags",
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const tags = this.tags;
            return {
              values: function (params) {
                const filter_tags = [];
                tags.map((v, k) => {
                  filter_tags.push(v.name);
                });
                params.success(filter_tags);
              },
              showTooltips: true,
            };
          },
          cellRenderer: "TagsRendered",
          autoHeight: true,
          headerName: "Tags",
          isMultipleSelect: true,
          inputType: "dropdown",
        },
        {
          field: "event_start_date",
          filter: "agDateColumnFilter",
          filterParams: filterDateParams,
          // wrapText: true,
          width: 200,
          headerName: "Event Start Date",
          cellEditor: "datePicker",
          inputType: "dropdown",
        },
        {
          field: "event_start_time",
          filter: "customTimeFilter",
          width: 200,
          headerName: "Event Start Time",
          cellEditor: "time-picker-editor",
          inputType: "dropdown",
        },
        {
          field: "event_end_date",
          filter: "agDateColumnFilter",
          filterParams: filterDateParams,
          // wrapText: true,
          width: 200,
          headerName: "Event End Date",
          cellEditor: "datePicker",
          inputType: "dropdown",
        },
        {
          field: "event_end_time",
          filter: "customTimeFilter",
          width: 200,
          headerName: "Event End Time",
          cellEditor: "time-picker-editor",
          inputType: "dropdown",
        },
        {
          field: "event_location",
          filter: "agTextColumnFilter",
          // wrapText: true,
          width: 200,
          headerName: "Event Location",
          inputType: "text-input",
        },
        {
          field: "fine_amount_total",
          filter: "agTextColumnFilter",
          // wrapText: true,
          width: 200,
          headerName: "Fine Amount Total",
          editable: this.hasPermissions(EDIT_ALERT_PERMISSION),
          inputType: "text-input",
        },
        {
          field: "to_be_published",
          filter: "agSetColumnFilter",
          // wrapText: true,
          width: 120,
          headerName: "To Be Published",
          editable: false,
          filterParams: {
            values: [true, false],
          },
        },
        {
          field: "to_be_published_at",
          filter: "agDateColumnFilter",
          filterParams: filterDateParams,
          // wrapText: true,
          width: 200,
          headerName: "To Be Published At",
          cellEditor: "datePicker",
          editable: false,
          inputType: "date-picker",
        },
        {
          field: "last_edited_by",
          filter: "agSetColumnFilter",
          // wrapText: true,
          width: 120,
          headerName: "Last Edited By",
          valueGetter: function (params) {
            return `${params.data.last_edited_by?.first_name || ''} ${params.data.last_edited_by?.last_name || ''}`;
          },
          filterParams: (params) => {
            const users = this.all_users;
            return {
              values: function (params) {
                const filter_users = [];
                users.map((v, k) => {
                  const fullname = `${v.first_name} ${v.last_name}`
                  filter_users.push(fullname);
                });
                params.success(filter_users);
              },
              showTooltips: true,
            };
          },
          editable: false,
        },
        {
          field: "reviewed_by",
          filter: "agSetColumnFilter",
          valueGetter: function (params) {
            return `${params.data.reviewed_by?.first_name || ''} ${params.data.reviewed_by?.last_name || ''}`;
          },
          filterParams: (params) => {
            const users = this.all_users;
            return {
              values: function (params) {
                const filter_users = [];
                users.map((v, k) => {
                  const fullname = `${v.first_name} ${v.last_name}`
                  filter_users.push(fullname);
                });
                params.success(filter_users);
              },
              showTooltips: true,
            };
          },
          // wrapText: true,
          width: 120,
          headerName: "Reviewed By",
          editable: false,
        },
        {
          field: "published_status",
          filter: "agSetColumnFilter",
          filterParams: (params) => {
            const published_status = this.published_status;
            return {
              values: function (params) {
                const filter_published_status = [];
                published_status.map((v, k) => {
                  filter_published_status.push(v.name);
                });
                params.success(filter_published_status);
              },
              showTooltips: true,
            };
          },
          width: 150,
          headerName: "Published Status",
          inputType: "dropdown",
        },
        {
          field: "ls_bill_id",
          filter: "agTextColumnFilter",
          autoHeight: true,
          width: 200,
          headerName: "Ls Bill Id",
          editable: false,
        },
        {
          field: "sourced_at",
          filter: "agTextColumnFilter",
          autoHeight: true,
          width: 200,
          headerName: "Sourced At",
          editable: false,
        },
        {
          field: "related_articles",
          filter: "agTextColumnFilter",
          cellRenderer: "RelatedArticles",
          autoHeight: true,
          minWidth: 300,
          width: 300,
          isMultipleSelect: true,
          headerName: "Related Articles",
          editable: false,
        },
        {
          field: "history",
          minWidth: 290,
          cellRenderer: "historyLogActionButton",
        },
      ],
      gridApi: null,
      sideBar: null,
      columnApi: null,
      defaultColDef: {
        flex: 1,
        minWidth: 150,
        sortable: true,
        resizable: true,
        enablePivot: true,
        cellClassRules: {
          duplicate: this.isDuplicate,
        },
      },
      rowSelection: null,
      isRowSelectable: null,
      rowModelType: null,
      cacheOverflowSize: null,
      maxConcurrentDatasourceRequests: null,
      infiniteInitialRowCount: null,
      maxBlocksInCache: null,
      paginationPageSize: 40,
      cacheBlockSize: null,
      getRowId: null,
      selected_row_id: null,
      articlesModal: {
        modalTitle: "",
        dataInputModal: "",
        options: "",
        invalidFeedback: "",
        typeInput: "",
      },
      summaryTitleModal: {
        articleId: null,
        regalytics_alert_id: null,
        summary: {
          colId: "summary",
          value: null
        },
        ai_summary: {
          colId: "ai_summary",
          value: null
        },
        title: {
          colId: "title",
          value: null
        },
        ai_sentiment: {
          colId: "ai_sentiment",
          value: null
        },
        ai_title: {
          colId: "ai_title",
          value: null
        },
        source_language: {
          colId: "source_language",
          value: null
        },
        ai_translated_date: {
          colId: "ai_translated_date",
          value: null
        },

        proposed_comments_due_date: {
          colId: "proposed_comments_due_date",
          value: null
        },
        rule_effective_date: {
          colId: "rule_effective_date",
          value: null
        },
        original_publication_date: {
          colId: "original_publication_date",
          value: null
        },
        pdf_url: {
          colId: "pdf_url",
          value: null
        },
        published_status: {
          colId: "published_status",
          value: null
        },
        reason: {
          colId: "reason",
          value: null
        },
        flag: {
          colId: "flag",
          value: false
        },
        event_start_date: {
          colId: "event_start_date",
          value: null
        },
        event_end_date: {
          colId: "event_end_date",
          value: null
        },
        event_start_time: {
          colId: "event_start_time",
          value: null
        },
        event_end_time: {
          colId: "event_end_time",
          value: null
        },
        event_location: {
          colId: "event_location",
          value: null
        }
      },
      bulk_published_status: null
    };
  },
  beforeMount() {
    this.detailRowHeight = 70;
    this.groupDefaultExpanded = 1;
    this.rowSelection = "multiple";
    this.rowModelType = "serverSide";
    this.suppressServerSideInfiniteScroll = "partial";
    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 4;
    this.infiniteInitialRowCount = 1;
    this.maxBlocksInCache = 2;
    this.paginationPageSize = 40;
    this.cacheBlockSize = 40;
    this.getRowId = (item) => {
      return item.data.id;
    };
  },
  created() {
    // eslint-disable-next-line no-undef
    this.components = { datePicker: getDatePicker() };

    this.socket = io(process.env.VUE_APP_API_SOCKET_URL);

    // Listen for 'serverEvent' event from the server
    this.socket.on("editing-users-updated", (editingUsers) => {
      const arrayOfObjects = Object.keys(editingUsers).map(key => editingUsers[key]);

      this.editingUsers = []
      arrayOfObjects.map((v, k) => {
        if (v.user != this.getCurrentUser().id) {
          this.editingUsers.push({ "node": v.node, "color": v.color, "name": v.name })
        }
      });
      this.gridApi.redrawRows();

    });

    this.socket.on("article_updated", ({ isBulkUpdate, id, data }) => {
      if (isBulkUpdate) {
        const { col_name, col_value } = data

        id.forEach(indId => {
          const rowNode = this.gridApi.getRowNode(`${indId}`);
          rowNode.setDataValue(col_name, col_value);
        });
        this.gridApi.redrawRows();

        if (this.articlesModal && this.articlesModal.dataInputModal && this.articlesModal.dataInputModal.data) {
          const openedRowId = id.find(idd => idd == this.articlesModal.dataInputModal.data.id)
          if (openedRowId) {
            const rowNode = this.gridApi.getRowNode(`${openedRowId}`);
            const newData = rowNode.data;
            newData[col_name] = col_value;
            this.articlesModal.dataInputModal.value = newData[this.articlesModal.dataInputModal.colId];
            this.$refs.globalArticlesModal.openModal();
          }
        }
      } else {
        const rowNode = this.gridApi.getRowNode(`${id}`);
        rowNode.setData(data);
        this.gridApi.redrawRows();

        if (this.articlesModal && this.articlesModal.dataInputModal && this.articlesModal.dataInputModal.data && this.articlesModal.dataInputModal.data.id == id) {
          this.articlesModal.dataInputModal.value = data[this.articlesModal.dataInputModal.colId];
          this.$refs.globalArticlesModal.openModal();
        }

        if (this.show_edit_summary_title && this.summaryTitleModal.articleId == id) {
          this.summaryTitleModal.summary.value = data.summary;
          this.summaryTitleModal.ai_summary.value = data.ai_summary;
          this.summaryTitleModal.title.value = data.title;
          this.summaryTitleModal.proposed_comments_due_date.value = data.proposed_comments_due_date;
          this.summaryTitleModal.rule_effective_date.value = data.rule_effective_date;
          this.summaryTitleModal.original_publication_date.value = data.original_publication_date;
          this.summaryTitleModal.pdf_url.value = data.pdf_url;
          this.summaryTitleModal.published_status.value = data.published_status;
          this.summaryTitleModal.event_start_date.value = data.event_start_date;
          this.summaryTitleModal.event_end_date.value = data.event_end_date;
          this.summaryTitleModal.event_start_time.value = data.event_start_time;
          this.summaryTitleModal.event_end_time.value = data.event_end_time;
          this.summaryTitleModal.event_location.value = data.event_location;
          this.summaryTitleModal.reason.value = data.reason;
          this.summaryTitleModal.flag.value = data.flag;
        }
      }
    });

    // Get the value of "currentPage" from localStorage
    let currentPage = localStorage.getItem("currentPage");

    // Check if the value is null or undefined
    if (currentPage === 'null' || currentPage === undefined) {
      // Set "currentPage" to 0 if it is null or undefined
      currentPage = 0;
      localStorage.setItem("currentPage", currentPage);
    }

  },
  mounted() {
    this.$bus.$on("showHistoryModal", this.showHistoryLogs);
    this.$bus.$on("showFeedback", this.showFeedback);
    this.$bus.$on("newFeedbackCreated", this.newFeedbackCreated);

    // setInterval(this.refreshStore, 2000);

  },
  unmounted() {
    // Disconnect from the WebSocket server
    this.socket.disconnect();
  },
  beforeRouteLeave(to, from, next) {
    // Display alert here
    localStorage.setItem("currentPage", this.gridApi.paginationGetCurrentPage())
    // Proceed to the next route
    next();
  },
  methods: {
    tooltipGetter(params) {
      const rowData = params.data;
      return `${(rowData.new_feedbacks && rowData.new_feedbacks.message) || ''}`;
    },
    handlePasteSummary(event) {
      const pastedText = event.clipboardData.getData('text')
      const cleanedText = pastedText.replace(/(\r\n|\n|\r)/gm, " ");
      event.preventDefault();
      this.summaryTitleModal.summary.value = cleanedText;
    },
    onPageSizeChanged() {
      const value = document.getElementById('page-size').value;
      this.paginationPageSize = Number(value);
      // this.gridApi.paginationSetPageSize(Number(value));
      this.gridApi.setFilterModel(null);
      this.gridApi.onFilterChanged();
    },
    selectAllRows() {
      const selectedRows = [];
      let allSelected = true;

      this.gridApi.forEachNode(node => {
        console.log(node)
        console.log(node.isSelected())
        if (node.isSelected()) {
          this.select_all_text = "Select all"
          allSelected = false;
          node.setSelected(false);
        } else {
          node.setSelected(true);
          this.select_all_text = "Unselect all"
          selectedRows.push(node.data);
        }
      });

      // if (allSelected) {
      //   this.gridApi.deselectAll();
      //   selectedRows.length = 0;
      // }
    },
    ColumnMoved() {
      const savedState = this.gridColumnApi.getColumnState();
      console.log(savedState)
      window.localStorage.setItem("applyColumnState", JSON.stringify(savedState))
      this.update_col_def({ "cold_def": savedState }, this.getCurrentUser().id).then((resp) => {
        const notification = {
          message: "Column Location Saved",
          type: "success",
        };
        notificationStore.addNotification(notification);
      })
    },
    ResetColumnMoved() {
      this.gridColumnApi.resetColumnState();
      const savedState = this.gridColumnApi.getColumnState();
      console.log(savedState)
      window.localStorage.setItem("applyColumnState", JSON.stringify(savedState))
      this.update_col_def({ "cold_def": savedState }, this.getCurrentUser().id).then((resp) => {
        const notification = {
          message: "Column Location Reset",
          type: "success",
        };
        notificationStore.addNotification(notification);
      })
    },
    duplicates_handleOk() {
      // console.log(this.selected_duplicate_columns);
      // this.showDuplicates = !this.showDuplicates;

      this.showDuplicates = true;
      this.gridApi.redrawRows();
    },
    async toggle() {
      await fullscreen.toggle(this.$el.querySelector('.fullscreen-wrapper'), {
        teleport: this.teleport,
        callback: (isFullscreen) => {
          //this.fullscreen = isFullscreen
        },
      })
      this.fullscreen = fullscreen.isFullscreen
    },
    bulkStatusUpdates() {
      this.bulk_published_status = null;
      if (this.grid_selected_rows && this.grid_selected_rows.length > 0) {
        this.show_bulk_status_update = true;
      } else {
        const notification = {
          message: 'Please select atleast one row',
          type: 'warning'
        }
        notificationStore.addNotification(notification);
      }
    },
    onSelectionChanged(event) {
      // Handle the row selection change here
      const selectedRows = event.api.getSelectedRows();
      this.grid_selected_rows = selectedRows
      console.log('Selected Rows:', selectedRows);
    },

    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    getRowStyle(params) {
      // console.log(this.editingUsers, "hererer", this.getCurrentUser())
      // if (this.editingUsers.includes(params.node.id)) {
      //   return { background: this.getRandomColor(), border: "1px solid black" };
      // }
      const item = this.editingUsers.find(item => item.node === params.node.id);
      if (item) {
        const { color } = item;
        return { background: color, border: "1px solid black" };
      }
      return null;
    },
    getCurrentUser() {
      const accountStore = useAccountStore();
      return accountStore.getCurrentUser;
    },
    onCellValueChanged() {
      console.log('a')
    },
    isFiltersEnabled() {
      return this.grid.getFilterState().filters.length > 0;
    },
    clearAllFilters() {
      this.gridApi.setFilterModel(null);
      this.gridApi.onFilterChanged();
    },
    showFeedbackArticles() {
      this.gridApi.setFilterModel({
        new_feedbacks: { value: "New" },
      });
      this.gridApi.onFilterChanged();
    },

    toggleShowDuplicates() {


      this.duplicates_resetModal = true;
      this.objectForDuplicates = this.columnDefs
        .filter(obj => obj.headerName !== undefined && obj.headerName !== "")
        .map(obj => ({
          label: obj.headerName,
          value: obj.field,
        }));
    },
    generateColor(seed) {
      const color = (Math.abs(Math.sin(seed) * 16777215) % 16777215).toString(
        16
      );
      return "#" + "0".repeat(6 - color.length) + color;
    },
    isDuplicate(params) {
      if (!this.showDuplicates) {
        return false;
      }
      const value = params.value;
      const rowIndex = params.node.rowIndex;
      const column = params.column;
      // console.log(column.colId, this.selected_duplicate_columns.includes(column.colId))
      const rowData = params.api.getRenderedNodes();
      if (value == null || value == undefined) {
        return false;
      }
      // if (this.selected_duplicate_columns.length > 0) {
      //   if (this.selected_duplicate_columns.includes(column.colId)) {

      //   } else {
      //     return false;
      //   }
      // } else {
      //   return false;
      // }
      if (!this.selected_duplicate_columns.includes(column.colId)) {
        return false;
      }
      return (
        rowData.filter((node) => {
          return (
            node.rowIndex !== rowIndex && node.data[column.colId] === value
          );
        }).length > 0
      );

    },

    showSpinner() {
      this.$bus.$emit("showSpinner", true);
    },
    hideSpinner() {
      this.$bus.$emit("showSpinner", false);
    },
    getArticleFeedback() {
      return this.getArticleFeedbacks(this.opened_feedback_article_id);
    },
    refreshArticleFeedbackData() {
      this.getArticleFeedback(this.opened_feedback_article_id).then((resp) => {
        this.feedback_items = resp.data;
        this.show_feedback = true;
        this.hideSpinner();
      });
    },
    openFeedbackModal(data, isNew) {
      this.$refs.feedBackModal.openModal(
        this.opened_feedback_article_id,
        data,
        isNew
      );
    },
    async takeUpFeedback(data) {
      const result = await showConfirmationAlert(
        "Confirm",
        "Do you want to take up this feedback?"
      );
      if (result.isConfirmed) {
        const feedbackId = data.id;
        const updatePayload = {
          assigned_to: store.getCurrentUser.id,
          status: FeedbackStatusOptions.INPROGRESS,
        };

        // this.showSpinner();
        this.updateFeedback(feedbackId, updatePayload).then((resp) => {
          this.refreshArticleFeedbackData();
        });
      }
    },
    async resolveFeedback(data) {
      const result = await showConfirmationAlert(
        "Confirm",
        "Do you want to resolve this feedback?"
      );
      if (result.isConfirmed) {
        const feedbackId = data.id;
        const updatePayload = {
          assigned_to: store.getCurrentUser.id,
          status: FeedbackStatusOptions.RESOLVED,
        };

        // this.showSpinner();
        this.updateFeedback(feedbackId, updatePayload).then((resp) => {
          this.getArticle(resp.data.article).then(res => {
            const rowNode = this.gridApi.getRowNode(`${resp.data.article}`);
            rowNode.setData(res.data.article);
            this.gridApi.redrawRows();
          });
          this.refreshArticleFeedbackData();
        });
      }
    },
    newFeedbackCreated(feedback) {
      this.getArticle(this.opened_feedback_article_id).then(res => {
        const rowNode = this.gridApi.getRowNode(`${this.opened_feedback_article_id}`);
        rowNode.setData(res.data.article);
        this.gridApi.redrawRows();
      });
      this.refreshArticleFeedbackData();
    },
    submitArticlesModal(data) {
      const notification = {
        message: data.colId + " Updated.",
        type: "success",
      };
      const value =
        typeof data.value === "string" ? data.value : toRaw(data.value);
      const request_data = {
        col_name: data.colId,
        col_value: value,
      };
      // console.log("request_data", request_data)
      this.updateArticleEntity(data.id, request_data).then(() => {
        let updatedRowOld;
        this.gridApi.forEachNode(node => {
          if (node.id == data.id) {
            updatedRowOld = node.data;
          }
        });

        const options = this.collectOptions(data.colId);
        let valuesFinal;

        if (typeof value === 'object' && value !== null && Array.isArray(value)) {
          valuesFinal = options.filter(option => value.includes(option) || value.includes(option.id))
        } else if (typeof value === 'string') {
          valuesFinal = value;
        } else {
          valuesFinal = options.find(opt => opt == value || opt.id == value);
          if (valuesFinal) {
            valuesFinal = valuesFinal.name || valuesFinal;
          }
        }

        updatedRowOld[data.colId] = valuesFinal;
        this.socket.emit('article_updated', { id: data.id, data: updatedRowOld })
        notificationStore.addNotification(notification);
        this.gridApi.onFilterChanged();
        // this.refreshStore();
      });
    },
    resetArticlesModal() {
      this.articlesModal = {
        modalTitle: "",
        dataInputModal: {},
        options: [],
        invalidFeedback: "",
        typeInput: "",
      };
    },
    load_agency_filter() {
      return this.filter_options_agencies;
    },
    fetch_values(row, type) {
      const associatedOptions = this.collectOptions(row.field_name);
      if (associatedOptions && associatedOptions.length) {
        const row_values = eval(row[type]);
        if (Array.isArray(row_values)) {
          return row_values
            .map((v, k) => {
              const matchedOption = associatedOptions.find((i, j) => {
                return i.id == v;
              });
              return matchedOption ? matchedOption["name"] : '';
            })
            .join(', ');
        } else {
          const matchedOption = associatedOptions.find((i, j) => {
            return i.id == row_values;
          });
          return matchedOption ? matchedOption["name"] : '';
        }
      } else {
        return row[type];
      }
    },
    isEditRulePath(value) {
      return value.includes('rule');
    },
    // getEditRulePath(value) {
    //   const id = value.split('/edit-rule/')[1];
    //   return { name: 'Edit Rule', params: { id } };
    // },
    // getEditRulePath(trigger) {
    //   // Assuming the trigger contains the ID needed for the URL
    //   const id = trigger.split('/edit-rule/')[1];
    //   // Adjust the base URL ('/dashboard/articles/') as necessary to match your application's structure.
    //   const path = `/dashboard/edit-rule/${id}`;
    //   // If your application is not hosted at the root, you may need to include the base URL of your app.
    //   return window.location.origin + path;
    // },
    getEditRulePathAndName(item) {
      let id;
      let ruleName = ''; // Default empty string for rule name

      let triggerObj;
      if (item?.trigger?.toLowerCase() == 'rule') {
        triggerObj = item.rule;
        id = triggerObj.id;
        ruleName = triggerObj.rule_name || '';
      } else {
        try {
          triggerObj = JSON.parse(item.trigger);
          if (triggerObj && triggerObj.rule_id) {
            id = triggerObj.rule_id.split('/edit-rule/')[1];
            ruleName = triggerObj.rule_name || ''; // Extract rule name if available
          }
        } catch (error) {
          id = item.trigger.split('/edit-rule/')[1];
        }
      }

      const path = `/dashboard/edit-rule/${id}`;
      const fullPath = window.location.origin + path;

      // Return both path and rule name
      return { path: fullPath, ruleName: ruleName };
    },

    getRule_name(trigger) {
      let name;
      try {
        const parsedTrigger = JSON.parse(trigger);
        if (parsedTrigger && parsedTrigger.rule_name) {
          name = parsedTrigger.rule_name;
        }
      } catch (error) {
        name = trigger
      }
      return name;
    },
    getEditRulePath(trigger) {
      let id;

      try {
        const parsedTrigger = JSON.parse(trigger);
        if (parsedTrigger && parsedTrigger.rule_id) {
          id = parsedTrigger.rule_id;
        }
      } catch (error) {
        id = trigger.split('/edit-rule/')[1];
      }

      const path = `/dashboard/edit-rule/${id}`;

      return window.location.origin + path;
    },
    return_json_key(json_obj) {
      return Object.keys(json_obj.fields)[0];
    },
    return_json_diff(json_data1, json_data2) {
      return diff(json_data2, json_data1);
    },
    format_diff(data, get_old = false) {
      const fields_data = data.fields;
      const key_data = Object.keys(data.fields)[0];
      if (key_data == "agencies") {
        const value_data = Object.values(data.fields)[0];
        let col_data = "";
        if (get_old) {
          col_data = value_data
            .filter((v, k) => {
              if (v.includes(" ")) {
                return v.toString();
              }
            })
            .toString()
            .split(",")
            .filter(function (element) {
              return element !== "undefined" && element !== " ";
            });
          col_data = col_data.map((v, k) => {
            return this.all_agencies.filter((i, j) => {
              return i.id == v;
            })[0]["name"];
          });
          return col_data;
        } else {
          col_data = value_data
            .filter((v, k) => {
              if (v.includes("+") || v.includes(" ")) {
                return v.toString();
              }
            })
            .toString()
            .replaceAll("+", "")
            .split(",")
            .filter(function (element) {
              return (
                element !== "undefined" && element !== " " && element !== ""
              );
            });
          col_data = col_data.map((v, k) => {
            return this.all_agencies.filter((i, j) => {
              return i.id == v;
            })[0]["name"];
          });
          return col_data;
        }
      } else {
        const value_data = Object.values(data.fields)[0];
        const col_data = "";
        if (get_old) {
          return value_data.__old;
        } else {
          return value_data.__new;
        }
      }
    },
    revert_changes(row) {
      const selected_id = this.selected_row_id;
      const selected_reversion_id = row.id;
      this.revertHistory(selected_reversion_id).then(() => {
        this.reload_history(this.history_selected_id);
        const notification = {
          message: `The article is reverted successfully to ${selected_reversion_id}`,
          type: "success",
        };
        notificationStore.addNotification(notification);
      });
    },
    reload_history(id) {
      this.history_items = [];
      this.selected_row_id = id;
      this.getHistoryLog(id).then((resp) => {
        this.history_items = resp.data;
      });
    },
    showHistoryLogs(val) {
      const id = typeof val === "object" ? val.id : val;
      const type = typeof val === "object" ? val.type : "";
      this.history_selected_id = id;
      this.history_items = [];
      this.show_history_logs = false;
      this.selected_row_id = id;
      this.getHistoryLog(id).then((resp) => {
        this.history_items = resp.data;
        this.show_history_logs = true;
      });
    },
    showFeedback(val) {
      this.opened_feedback_article_id = val.id;
      this.opened_feedback_article_title = val.title;
      // this.showSpinner();
      this.getArticleFeedback(this.opened_feedback_article_id).then((resp) => {
        this.feedback_items = resp.data;
        this.show_feedback = true;
        this.hideSpinner();
      });
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
      const pageToNavigate = JSON.parse(localStorage.getItem('currentPage'));
      params.api.paginationGoToPage(pageToNavigate);
    },
    handeSingleCellClick(data) {
      const data_rowIndex = data.rowIndex;
      const data_column = data.column;
      this.socket.emit("cell-editing-started", {
        row: data_rowIndex,
        column: data_column.getColId(),
        node: data.node.id,
        user: this.getCurrentUser().id,
        color: this.getCurrentUser().color,
        name: this.getCurrentUser().name,
      });
      console.log("emited", {
        row: data_rowIndex,
        column: data_column.getColId(),
        node: data.node.id,
        user: this.getCurrentUser().id,
        color: this.getCurrentUser().color,
        name: this.getCurrentUser().name,
      });
      const clicked_entity = data;
      // console.log(clicked_entity, 'clicked_entity')

      if (clicked_entity.column.colId == "pdf_url") {
        if (clicked_entity.value) {
          window.open(clicked_entity.value, '_blank');
        }
        return;
      }

      if (clicked_entity.column.colId == "regalytics_alert_id") {
        this.copyColumnData(clicked_entity.colDef.headerName, clicked_entity.value);
        return;
      }

      if (clicked_entity.column.colId == "bill_identifier") {
        this.copyColumnData(clicked_entity.colDef.headerName, clicked_entity.value);
        return;
      }

      if (clicked_entity.column.colId == "ls_bill_id") {
        this.copyColumnData(clicked_entity.colDef.headerName, clicked_entity.value);
        return;
      }

      if (!this.hasPermissions(EDIT_ALERT_PERMISSION)) {
        return;
      }

      if (
        clicked_entity.colDef.editable == false ||
        clicked_entity.column.colId == "history" ||
        clicked_entity.column.colId == "selected" ||
        clicked_entity["colDef"]["inputType"] == "date-picker" ||

        clicked_entity["colDef"]["inputType"] == "timePickerEditor"
      )
        return;

      if (clicked_entity.column.colId == this.summaryTitleModal.ai_translated_date.colId || clicked_entity.column.colId == this.summaryTitleModal.source_language.colId ||
        clicked_entity.column.colId == this.summaryTitleModal.ai_title.colId || clicked_entity.column.colId == this.summaryTitleModal.ai_summary.colId || clicked_entity.column.colId == this.summaryTitleModal.ai_sentiment.colId || clicked_entity.column.colId == this.summaryTitleModal.ai_summary.colId || clicked_entity.column.colId == this.summaryTitleModal.summary.colId || clicked_entity.column.colId == this.summaryTitleModal.title.colId
        || clicked_entity.column.colId == this.summaryTitleModal.proposed_comments_due_date.colId || clicked_entity.column.colId == this.summaryTitleModal.rule_effective_date.colId
        || clicked_entity.column.colId == this.summaryTitleModal.event_start_date.colId || clicked_entity.column.colId == this.summaryTitleModal.event_end_date.colId
        || clicked_entity.column.colId == this.summaryTitleModal.event_start_time.colId || clicked_entity.column.colId == this.summaryTitleModal.event_end_time.colId
        || clicked_entity.column.colId == this.summaryTitleModal.event_location.colId || clicked_entity.column.colId == this.summaryTitleModal.reason.colId
        || clicked_entity.column.colId == this.summaryTitleModal.flag.colId || clicked_entity.column.colId == this.summaryTitleModal.original_publication_date.colId
        || clicked_entity.column.colId == this.summaryTitleModal.pdf_url.colId || clicked_entity.column.colId == this.summaryTitleModal.published_status.colId
      ) {
        const data = clicked_entity["data"];

        if (data.original_publication_date && data.original_publication_date.includes("/")) {
          const year = data.original_publication_date.split("/")[2] + "-";
          const month = data.original_publication_date.split("/")[1] + "-";
          const day = data.original_publication_date.split("/")[0];
          data.original_publication_date = year + month + day;
        }

        this.summaryTitleModal.summary.value = data.summary;
        this.summaryTitleModal.ai_summary.value = data.ai_summary;
        this.summaryTitleModal.title.value = data.title;
        this.summaryTitleModal.articleId = data.id;
        this.summaryTitleModal.regalytics_alert_id = data.regalytics_alert_id;
        this.summaryTitleModal.proposed_comments_due_date.value = data.proposed_comments_due_date;
        this.summaryTitleModal.rule_effective_date.value = data.rule_effective_date;
        this.summaryTitleModal.original_publication_date.value = data.original_publication_date;
        this.summaryTitleModal.pdf_url.value = data.pdf_url;
        this.summaryTitleModal.published_status.value = data.published_status;
        this.summaryTitleModal.event_start_date.value = data.event_start_date;
        this.summaryTitleModal.event_end_date.value = data.event_end_date;
        this.summaryTitleModal.event_start_time.value = data.event_start_time;
        this.summaryTitleModal.event_end_time.value = data.event_end_time;
        this.summaryTitleModal.event_location.value = data.event_location;
        this.summaryTitleModal.reason.value = data.reason;
        this.summaryTitleModal.flag.value = data.flag;

        this.summaryTitleModal.ai_title.value = data.ai_title;
        this.summaryTitleModal.ai_sentiment.value = data.ai_sentiment;
        this.summaryTitleModal.source_language.value = data.source_language;
        this.summaryTitleModal.ai_translated_date.value = data.ai_translated_date;

        this.show_edit_summary_title = true;
        return;
      }

      const wrapData = new Promise((resolve, reject) => {
        const colDef = clicked_entity["colDef"];
        const obj = {};
        obj["value"] = clicked_entity["value"];
        obj["data"] = clicked_entity["data"];
        obj["field"] = colDef["field"];
        obj["colId"] = clicked_entity["column"]["colId"];

        const options = this.collectOptions(clicked_entity["column"]["colId"]);

        this.articlesModal["modalTitle"] = colDef["headerName"];
        this.articlesModal["dataInputModal"] = obj;
        this.articlesModal["options"] = options;
        this.articlesModal["invalidFeedback"] = [];
        this.articlesModal["typeInput"] = colDef["inputType"];
        this.articlesModal["isMultipleSelect"] = colDef["isMultipleSelect"];

        resolve();
      });
      wrapData.then(() => this.$refs.globalArticlesModal.openModal());
      // var rowIndex = data.rowIndex;
      // var column = data.column;
      // // console.log(rowIndex, column, data)
      // // console.log(this.getCurrentUser(), "getCurrentUser", this.getCurrentUser.name)
      // this.socket.emit("cell-editing-started", {
      //   row: rowIndex,
      //   column: column.getColId(),
      //   node: data.node.id,
      //   user: this.getCurrentUser().id,
      //   color: this.getCurrentUser().color,
      //   name: this.getCurrentUser().name,
      // });
    },
    onCellClicked(data) {
      setTimeout(() => {
        if (this.isCellDoubleClicked == true) {
          return;
        } else {
          this.handeSingleCellClick(data);
        }
      }, 200)
    },
    onCellDoubleClicked(data) {
      this.isCellDoubleClicked = true;
      setTimeout(() => { this.isCellDoubleClicked = false }, 300);
      const clicked_entity = data;

      if (!this.hasPermissions(EDIT_ALERT_PERMISSION)) {
        return;
      }

      if (clicked_entity.column.colId == "pdf_url") {
        const wrapData = new Promise((resolve, reject) => {
          const colDef = clicked_entity["colDef"];
          const obj = {};
          obj["value"] = clicked_entity["value"];
          obj["data"] = clicked_entity["data"];
          obj["field"] = colDef["field"];
          obj["colId"] = clicked_entity["column"]["colId"];

          const options = this.collectOptions(clicked_entity["column"]["colId"]);

          this.articlesModal["modalTitle"] = colDef["headerName"];
          this.articlesModal["dataInputModal"] = obj;
          this.articlesModal["options"] = options;
          this.articlesModal["invalidFeedback"] = [];
          this.articlesModal["typeInput"] = colDef["inputType"];
          this.articlesModal["isMultipleSelect"] = colDef["isMultipleSelect"];

          resolve();
        });
        wrapData.then(() => this.$refs.globalArticlesModal.openModal());
        const { rowIndex, column } = data;

        this.socket.emit("cell-editing-started", {
          row: rowIndex,
          column: column.getColId(),
          node: data.node.id,
          user: this.getCurrentUser().id,
          color: this.getCurrentUser().color,
          name: this.getCurrentUser().name,
        });
      }
    },
    hasPermissions: function (requiredPermission) {
      const userPermissions = store.getCurrentUser.permissions;
      return userPermissions.includes(`${requiredPermission}`);
    },
    collectOptions(colID) {
      let options = [];
      switch (colID) {
        case "agencies":
          options = this.all_agencies;
          break;
        case "sector_type":
          options = this.all_sectors;
          break;
        case "tags":
          options = this.tags;
          break;
        case "subtype_classification":
          options = this.subtype_classifications;
          break;
        case "states":
          options = this.states;
          break;
        case "rules":
          options = this.user_rules;
          break;
        case "alert_type":
          options = this.alert_types;
          break;
        case "rule_classification":
          options = this.rule_classifications;
          break;
        case "classification":
          options = this.classifications;
          break;
        case "filing_type":
          options = this.filing_types;
          break;
        case "status":
          options = this.status;
          break;
        case "article_type":
          options = this.article_types;
          break;
        case "reviewed_by":
          options = this.all_users;
          break;
        case "last_edited_by":
          options = this.all_users;
          break;
        case "published_status":
          if (this.hasPermissions(PUBLISH_ALERT_PERMISSION)) {
            options = this.published_status;
          } else {
            options = this.published_status.filter(st => st.name.toLowerCase() != 'ready to publish');
          }
          break;

        default:
          break;
      }

      let rawData = options;
      if (isProxy(options)) {
        rawData = toRaw(options);
      }
      return rawData;
    },

    autoSizeAll(skipHeader) {
      const allColumnIds = [];
      this.gridColumnApi.getColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
    },
    onPageChange(params) {
      if (params.newPage) {
        const currentPage = params.api.paginationGetCurrentPage();

        localStorage.setItem('currentPage', JSON.stringify(currentPage));
      }
      let currentPage = localStorage.getItem("currentPage");

      // Check if the value is null or undefined
      if (currentPage === 'null' || currentPage === undefined) {
        // Set "currentPage" to 0 if it is null or undefined
        currentPage = 0;
        localStorage.setItem("currentPage", currentPage);
      }

    },
    onGridReady(params) {
      const localColDef = window.localStorage.getItem('applyColumnState')
      console.log(localColDef)
      if (JSON.parse(localColDef) && JSON.parse(localColDef).length > 1) {
        params.columnApi.applyColumnState({
          state: JSON.parse(localColDef),
          applyOrder: true,
        });
      }
      this.fetchArticlesRelatedData();
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.gridApi.sizeColumnsToFit();
      let currentPage = localStorage.getItem("currentPage");

      // Check if the value is null or undefined
      if (currentPage === 'null' || currentPage === undefined) {
        // Set "currentPage" to 0 if it is null or undefined
        currentPage = 0;
        localStorage.setItem("currentPage", currentPage);
      }

      this.dataSource = {
        getRows: async (params) => {
          let response;
          try {
            if (this.$route.params.id) {
              response = await this.getAllArticleRules(params.request,
                this.gridApi.paginationGetCurrentPage() + 1,
                this.$route.params.id, this.paginationPageSize);

            } else {
              response = await this.getAllArticles(
                params.request,
                this.gridApi.paginationGetCurrentPage() + 1, this.paginationPageSize
              );
            }
            console.log(localStorage.getItem("currentPage"))

            if (response && response.data && response.data.results) {
              // const data = response.data.results.map((v, k) => {
              //   const original_publication_date = new Date(
              //     v.original_publication_date
              //   );
              //   if (v.original_publication_date) {
              //     const org_date = v.original_publication_date.split("-");
              //     v.original_publication_date =
              //       org_date[1] + "/" + org_date[2] + "/" + org_date[0];
              //   }

              //   // eslint-disable-next-line no-var
              //   const day = original_publication_date.getDate() + "/";
              //   const month = original_publication_date.getMonth() + 1 + "/";
              //   const year = original_publication_date.getFullYear();
              //   const latest_update = new Date(v.latest_update);
              //   const day_latest_update =
              //     original_publication_date.getDate() + "/";
              //   const month_latest_update =
              //     original_publication_date.getMonth() + 1 + "/";
              //   const year_latest_update =
              //     original_publication_date.getFullYear();

              //   if (v.latest_update) {
              //     const lat_update = v.latest_update.split("-");
              //     v.latest_update =
              //       lat_update[1] + "/" + lat_update[2] + "/" + lat_update[0];
              //   }

              //   return v;
              // });
              params.successCallback(response.data.results, response.data.count);

            }
          } catch (error) {
            params.successCallback([], 0);
            return [];
          }

        },
      };
      this.gridApi.setServerSideDatasource(this.dataSource);
      this.autoSizeAll();
      this.sideBar = {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
              suppressRowGroups: true,
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true,
              suppressColumnFilter: true,
              suppressColumnSelectAll: true,
              suppressColumnExpandAll: true,
            },
          },
        ],
        defaultToolPanel: 'columns',
      };

    },
    refreshStore() {
      this.gridApi.refreshServerSideStore({ purge: false });
      this.gridApi.hideOverlay(); // Hide loader overlay
    },
    fetchArticlesRelatedData() {
      try {
        this.getAllArticlesRelatedData()
          .then((response) => {
            this.all_agencies = response.data.agencies;
            this.all_sectors = response.data.sectors;
            this.all_users = response.data.users;
            this.user_rules = response.data.user_rules;
            this.classifications = response.data.classifications;
            this.alert_types = response.data.alert_types;
            this.rule_classifications = response.data.rule_classifications;
            this.article_types = response.data.article_types;
            this.subtype_classifications = response.data.subtype_classifications;
            this.published_status = response.data.published_status;
            this.states = response.data.states;
            this.tags = response.data.tags;
            this.filing_types = response.data.filing_types;
            this.status = response.data.status;
            this.refreshCol2();
          })
          .catch((err) => {
            this.all_agencies = [];
            this.all_sectors = [];
            this.all_users = [];
            this.user_rules = [];
            this.classifications = [];
            this.alert_types = [];
            this.article_types = [];
            this.subtype_classifications = [];
            this.published_status = [];
            this.states = [];
            this.tags = [];
            this.filing_types = [];
            this.status = [];
            return [];
          });
      } catch (error) {
        //
      }
    },
    get_filter_data() {
      const model = this.gridApi.getFilterModel();

      if (Object.keys(model).length === 0) {
        alert("No filters are selected");
      }
    },
    refreshCol2() {
      const ageFilter = this.gridApi.getFilterInstance("agencies");
      ageFilter.refreshFilterValues();
    },
    editingDone(data) {
      const resp = data;
      if (resp.oldValue !== resp.newValue) {
        const notification = {
          message: resp.column.colId + " Updated.",
          type: "success",
        };
        const request_data = {
          col_name: resp.column.colId,
          col_value: resp.newValue,
        };
        if (
          resp.column.colId == "original_publication_date" ||
          resp.column.colId == "event_end_date" ||
          resp.column.colId == "latest_update" ||
          resp.column.colId == "proposed_comments_due_date" ||
          resp.column.colId == "federal_register_publication_date" ||
          resp.column.colId == "rule_effective_date" ||
          resp.column.colId == "event_start_date"
        ) {
          const year = resp.newValue.split("/")[2] + "-";
          const month = resp.newValue.split("/")[1] + "-";
          const day = resp.newValue.split("/")[0];
          request_data.col_value = year + month + day;
        }
        this.updateArticleEntity(resp.data.id, request_data).then(() => {
          let updatedRowOld;
          this.gridApi.forEachNode(node => {
            if (node.id == resp.data.id) {
              updatedRowOld = node.data;
            }
          });

          updatedRowOld[resp.column.colId] = resp.newValue;
          this.socket.emit('article_updated', { id: resp.data.id, data: updatedRowOld })
          notificationStore.addNotification(notification);
          this.gridApi.onFilterChanged();
        });
      }
    },
    handle_history_log_close() {
      this.isFeedback = false;
      this.edit_feedback = {
        id: "",
        feedback: "",
      };
    },
    handle_edit_summary_title_Ok() {
      const notification = {
        message: "Data Updated.",
        type: "success",
      };

      const savePayload = {
        [this.summaryTitleModal.title.colId]: this.summaryTitleModal.title.value,
        [this.summaryTitleModal.proposed_comments_due_date.colId]: this.summaryTitleModal.proposed_comments_due_date.value,
        [this.summaryTitleModal.rule_effective_date.colId]: this.summaryTitleModal.rule_effective_date.value,
        [this.summaryTitleModal.original_publication_date.colId]: this.summaryTitleModal.original_publication_date.value,
        [this.summaryTitleModal.pdf_url.colId]: this.summaryTitleModal.pdf_url.value,
        [this.summaryTitleModal.published_status.colId]: typeof this.summaryTitleModal.published_status.value == 'number' ? this.summaryTitleModal.published_status.value : null,
        [this.summaryTitleModal.event_start_date.colId]: this.summaryTitleModal.event_start_date.value,
        [this.summaryTitleModal.event_end_date.colId]: this.summaryTitleModal.event_end_date.value,
        [this.summaryTitleModal.event_start_time.colId]: this.summaryTitleModal.event_start_time.value,
        [this.summaryTitleModal.event_end_time.colId]: this.summaryTitleModal.event_end_time.value,
        [this.summaryTitleModal.event_location.colId]: this.summaryTitleModal.event_location.value,
        [this.summaryTitleModal.reason.colId]: this.summaryTitleModal.reason.value,
        [this.summaryTitleModal.flag.colId]: this.summaryTitleModal.flag.value,
        [this.summaryTitleModal.summary.colId]: this.summaryTitleModal.summary.value,
        [this.summaryTitleModal.ai_summary.colId]: this.summaryTitleModal.ai_summary.value,
      }

      const finalPayload = Object.fromEntries(Object.entries(savePayload).filter(([key, value]) => value != null && value != ""))

      this.updateArticleEntity(this.summaryTitleModal.articleId, finalPayload).then(res => {
        let updatedRowOld;
        this.gridApi.forEachNode(node => {
          if (node.id == this.summaryTitleModal.articleId) {
            updatedRowOld = node.data;
          }
        });

        updatedRowOld[this.summaryTitleModal.title.colId] = this.summaryTitleModal.title.value;
        updatedRowOld[this.summaryTitleModal.proposed_comments_due_date.colId] = this.summaryTitleModal.proposed_comments_due_date.value;
        updatedRowOld[this.summaryTitleModal.rule_effective_date.colId] = this.summaryTitleModal.rule_effective_date.value;
        updatedRowOld[this.summaryTitleModal.original_publication_date.colId] = this.summaryTitleModal.original_publication_date.value;
        updatedRowOld[this.summaryTitleModal.pdf_url.colId] = this.summaryTitleModal.pdf_url.value;
        updatedRowOld[this.summaryTitleModal.published_status.colId] = this.getPublishedStatusFromValue(this.summaryTitleModal.published_status.value);
        updatedRowOld[this.summaryTitleModal.event_start_date.colId] = this.summaryTitleModal.event_start_date.value;
        updatedRowOld[this.summaryTitleModal.event_end_date.colId] = this.summaryTitleModal.event_end_date.value;
        updatedRowOld[this.summaryTitleModal.event_start_time.colId] = this.summaryTitleModal.event_start_time.value;
        updatedRowOld[this.summaryTitleModal.event_end_time.colId] = this.summaryTitleModal.event_end_time.value;
        updatedRowOld[this.summaryTitleModal.event_location.colId] = this.summaryTitleModal.event_location.value;
        updatedRowOld[this.summaryTitleModal.reason.colId] = this.summaryTitleModal.reason.value;
        updatedRowOld[this.summaryTitleModal.flag.colId] = this.summaryTitleModal.flag.value;
        updatedRowOld[this.summaryTitleModal.summary.colId] = this.summaryTitleModal.summary.value;
        updatedRowOld[this.summaryTitleModal.ai_summary.colId] = this.summaryTitleModal.ai_summary.value;
        this.socket.emit('article_updated', { id: this.summaryTitleModal.articleId, data: updatedRowOld });

        notificationStore.addNotification(notification);
        // this.refreshStore();
      });

      // const request_data_title = {
      //   col_name: this.summaryTitleModal.title.colId,
      //   col_value: this.summaryTitleModal.title.value,
      // };
      // const request_data_summary = {
      //   col_name: this.summaryTitleModal.summary.colId,
      //   col_value: this.summaryTitleModal.summary.value,
      // };

      // const summaryReq = this.updateArticleEntity(this.summaryTitleModal.articleId, request_data_summary);

      // Promise.all([titleReq, summaryReq]).then(res => {
      //   notificationStore.addNotification(notification);
      //   this.refreshStore();
      // });
      this.gridApi.onFilterChanged();
    },
    handle_ui_bulk_status_update_Ok() {
      if (this.bulk_published_status != undefined && this.bulk_published_status != null && this.bulk_published_status != "") {
        const selectedRowsIDs = this.grid_selected_rows.map(itm => itm.id);
        const payload = {
          ids: selectedRowsIDs,
          col_name: "published_status",
          col_value: this.bulk_published_status
        }
        const notification = {
          message: "Published Status bulk update successfull.",
          type: "success",
        };
        this.bulkUpdateArticles(payload).then(
          () => {
            notificationStore.addNotification(notification);

            const valuesFinal = this.getPublishedStatusFromValue(this.bulk_published_status);
            this.gridApi.onFilterChanged();
            this.socket.emit('article_updated', {
              isBulkUpdate: true,
              id: selectedRowsIDs,
              data: {
                col_name: "published_status",
                col_value: valuesFinal
              }
            })
          }
        );
      } else {
        const notification = {
          message: "UI Published Status not updated",
          type: "danger",
        };
        notificationStore.addNotification(notification);
      }
    },
    handle_edit_summary_Ok(bvModalEvt) {
      this.isFeedback = false;
      const selected_agencies = [];
      const request_data = {
        col_name: "summary",
        col_value: this.edit_summary_form.summary,
      };
      const notification = {
        message: "Summary Updated.",
        type: "success",
      };
      this.updateArticleEntity(this.edit_summary_form.id, request_data).then(
        () => {
          notificationStore.addNotification(notification);
        }
      );
      this.gridApi.onFilterChanged();
      // this.refreshStore();
      this.show_edit_agency = false;
    },
    async copyURL(url) {
      try {
        await navigator.clipboard.writeText(url);
        const notification = {
          message: "URL copied.",
          type: "success",
        };
        notificationStore.addNotification(notification);
      } catch ($e) {
        alert('Cannot copy');
      }
    },
    async copyColumnData(colHeaderName, value) {
      try {
        await navigator.clipboard.writeText(value);
        const notification = {
          message: colHeaderName + " copied.",
          type: "success",
        };
        notificationStore.addNotification(notification);
      } catch ($e) {
        alert('Cannot copy');
      }
    },
    getPublishedStatusFromValue(published_status) {
      const options = this.collectOptions("published_status");
      let valuesFinal;

      if (typeof published_status === 'object' && published_status !== null && Array.isArray(published_status)) {
        valuesFinal = options.filter(option => published_status.includes(option) || published_status.includes(option.id))
      } else if (typeof published_status === 'string') {
        valuesFinal = published_status;
      } else {
        valuesFinal = options.find(opt => opt == published_status || opt.id == published_status);
        if (valuesFinal) {
          valuesFinal = valuesFinal.name || valuesFinal;
        }
      }

      return valuesFinal;
    }
  },
};
</script>

<style lang="scss">
.articleDashboard {
  height: 100%;
  overflow-x: hidden;
  /* Hide horizontal scrollbar */
}

/* Remove the width restriction from the actions column */
.actions_column {
  width: unset;
}

/* Remove the fixed width from the feedback_text class */
.feedback_text {
  max-width: unset;
}

/* Make the table responsive for horizontal scrolling */
.ag-theme-alpine {
  overflow-x: auto;
}

/* Set the maximum height for the table to fit within the view */
.ag-theme-alpine .ag-root-wrapper {
  max-height: calc(100vh - 180px);
}

.input-summary-modal {
  .v-select.vs--single.vs--searchable {
    background: white;
    height: 38px;

    .vs__dropdown-toggle {
      height: 38px;
    }
  }
}

.actions_column {
  width: 235px;

  .actions_wrapper {
    width: 100%;
    gap: 2px;
    position: relative;
    display: flex;
    justify-content: left;
  }
}

.feedback_text {
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.duplicate {
  background-color: #5ff224 !important;
  color: #212529 !important;
}

.color-box {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 3px;
  border: 1px solid black;
}

.online-icon {
  font-size: 14px;
  color: green;
  margin-right: 5px;
}

.online-count {
  font-weight: bold;
}

.user {
  margin-right: 5px;
}

.user i {
  margin-right: 3px;
}

.more {
  font-weight: bold;
  color: blue;
  cursor: pointer;
}

.ag-grid-container .ag-cell .ag-input-field-input,
.ag-grid-container .ag-cell .ag-checkbox-input {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.section-wrap-inner {
  padding: 25px;
  background-color: aliceblue;
  min-height: 400px;

  h4 {
    text-align: center;
  }
}

.red-row {
  background-color: #dc3545;
  color: white;
}

.grid-container {
  position: relative;
  width: 100%;
  height: 80%;
}

.page-size-options {
  position: absolute;
  left: 10px;
}

#myGrid {
  position: absolute;
  top: 15px;
  left: 0;
  width: 100%;
  height: 100%;
}

.copy-icon-wrap {
  line-height: 50px;

  .vue-feather--copy {
    cursor: pointer;
  }
}

.ag-header-cell-resize::after {
  width: 12px;
  height: 50%;
  top: calc(40% - var(--ag-header-column-resize-handle-height) * 0.5);
}

// /* Adjust for resolutions smaller than or equal to 768px width */
// @media (max-width: 768px) {
//   .page-size-options {
//     bottom: 56px;
//   }
// }

// /* Adjust for resolutions between 768px and 1024px width */
// @media (min-width: 769px) and (max-width: 1024px) {
//   .page-size-options {
//     bottom: 66px;
//   }
// }

// /* Adjust for resolutions greater than 1024px width */
// @media (min-width: 1025px) {
//   .page-size-options {
//     bottom: 76px;
//   }
// }</style>
<style src="@vueform/multiselect/themes/default.css"></style>
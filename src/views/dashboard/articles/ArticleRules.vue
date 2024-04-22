<template>

  <div class="mt-2" style="height: 100%">
    <ag-grid-vue id="myGrid" :cacheBlockSize="cacheBlockSize" :cacheOverflowSize="cacheOverflowSize"
      :columnDefs="columnDefs" :components="components" :defaultColDef="defaultColDef" :embedFullWidthRows="true"
      :enterMovesDown="true" :enterMovesDownAfterEdit="true" :getRowId="getRowId"
      :maxBlocksInCache="maxBlocksInCache"
      :maxConcurrentDatasourceRequests="maxConcurrentDatasourceRequests" :pagination="true"
      :paginationPageSize="paginationPageSize" :rowModelType="rowModelType" :rowSelection="rowSelection"
      :suppressServerSideInfiniteScroll="suppressServerSideInfiniteScroll" class="ag-theme-alpine" style="width: 100%; height: 100%;"
      @cellEditingStopped="editingDone" @paginationChanged="onPageChange" @cell-clicked="onCellClicked"
      @first-data-rendered="onFirstDataRendered" @grid-ready="onGridReady"></ag-grid-vue>

    <b-modal ref="edit_agency_modal" v-model="show_edit_agency" no-close-on-backdrop size="lg" title="Edit Agency"
      @hidden="reset_edit_agency_Modal" @ok="handle_edit_agency_Ok">

      <b-form-group id="input-group-2" :state="edit_agency_form_state.selected_agencies" class="mb-3"
        invalid-feedback="Agecny assigned to an article" label="Select Agencies:" label-for="input-2">
        <v-select v-model="edit_agency_form.selected_agencies" :options="all_agencies" :push-tags="true"
          :reduce="country_data => country_data.name" :required="!edit_agency_form.selected_agencies"
          :state="edit_agency_form_state.selected_agencies" label="name" multiple />

      </b-form-group>

    </b-modal>

    <b-modal ref="edit_sector_model" v-model="show_edit_sector" no-close-on-backdrop size="lg" title="Edit Sectors"
      @hidden="reset_edit_sector_Modal" @ok="handle_edit_sector_Ok">

      <b-form-group id="input-group-2" :state="edit_sector_form_state.selected_sectors" class="mb-3"
        invalid-feedback="Sector assigned to an article" label="Select Sector-Types:" label-for="input-2">
        <v-select v-model="edit_sector_form.selected_sectors" :options="all_sectors" :push-tags="true"
          :required="!edit_sector_form.selected_sectors" :state="edit_sector_form_state.selected_sectors" label="name"
          multiple />

      </b-form-group>

    </b-modal>
    <b-modal v-model="show_edit_summary" no-close-on-backdrop size="lg" title="Edit Summary"
      @ok="handle_edit_summary_Ok">

      <b-form-textarea id="textarea" v-model="edit_summary_form.summary" :state="edit_summary_form.summary"
        max-rows="15" placeholder="Enter something..." rows="3"></b-form-textarea>

    </b-modal>

    <b-modal v-model="show_history_logs" no-close-on-backdrop size="xl" title="Article History"
      @ok="handle_edit_summary_Ok">

      <div>
        <b-table :fields="history_fields" :items="history_items" hover show-empty striped>
          <template #empty="scope">
            <h4>{{ scope.emptyText }}</h4>
          </template>
          <template #emptyfiltered="scope">
            <h4>{{ scope.emptyFilteredText }}</h4>
          </template>

          <template #cell(old_value)="row">
            {{ fetch_values(row.item, 'old_value') }}
          </template>
          <template #cell(new_value)="row">
            {{ fetch_values(row.item, 'new_value') }}
          </template>

          <template #cell(created_at)="row">
            {{ new Date(row.item.created_at).toDateString() }}
          </template>
          <template #cell(action)="row">
            <b-button class="mr-1 btn btn-outline-success text-white" size="sm" @click="revert_changes(row.item)">
              Revert Changes <i aria-hidden="true" class="fa fa-undo"></i>
            </b-button>

          </template>


        </b-table>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { AgGridVue } from "@ag-grid-community/vue3";
import '@ag-grid-enterprise/server-side-row-model'
// import { AllModules } from "@ag-grid-enterprise/all-modules";
import { AgencyApi, AlertTypeApi, Articles, HistoryLogs, } from '@/api';
import AgencyRender from '@/views/dashboard/articles/CellRenderList.vue';
import SectorRender from '@/views/dashboard/articles/SectorRendered';
import RulesRender from '@/views/dashboard/articles/RulesRendered';
import { useNotificationStore } from '@/stores/notifications';
import HistoryLogActionButton from '@/views/dashboard/articles/historyLogActionButton.vue';
import { diff } from 'json-diff';
import axios from "@/axios";

window.getDatePicker = function getDatePicker() {
  class Datepicker {
    constructor() {
    }
    init(params) {
      this.eInput = document.createElement('input');
      this.eInput.value = params.value;
      this.eInput.classList.add('ag-input');
      this.eInput.style.height = '100%';
      // eslint-disable-next-line no-undef
      $(this.eInput).datepicker({ dateFormat: 'dd/mm/yy' });
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
    destroy() {
    }
    isPopup() {
      return false;
    }
  }

  return Datepicker;
};
const notificationStore = useNotificationStore();
export default {
  mixins: [
    Articles, AgencyApi, AlertTypeApi, HistoryLogs
  ],
  components: {
    'ag-grid-vue': AgGridVue,
    'AgencyRender': AgencyRender,
    'SectorRender': SectorRender,
    'RulesRender': RulesRender,
    'historyLogActionButton': HistoryLogActionButton
  },
  data() {
    return {
      history_selected_id: '',
      all_agencies: [],
      history_items: [],
      all_sectors: [],
      filter_options_agencies: [],
      filter_options_sectors: [],
      history_fields: [
        // {
        //   key: 'id',
        //   sortable: true
        // },
        {
          key: 'field_name',
          sortable: false
        },
        {
          key: 'old_value',
          sortable: false
        },
        {
          key: 'new_value',
          sortable: false
        }, {
          key: 'user_id',
          sortable: false
        }, {
          key: 'created_at',
          sortable: true
        },
        {
          key: 'action',
          sortable: false
        },
      ],
      edit_agency_form: {
        name: '',
        id: '',
        selected_agencies: [],
      },
      edit_sector_form: {
        name: '',
        id: '',
        selected_sectors: [],
      },
      edit_agency_form_state: {
        name: '',
        selected_agencies: "",
      }, edit_sector_form_state: {
        name: '',
        selected_sectors: "",
      },
      edit_summary_form: {
        name: '',
        id: '',
        summary: "",
      },
      edit_summary_form_state: {
        name: '',
        summary: "",
      },
      show_edit_agency: false,
      show_edit_sector: false,
      show_history_logs: false,
      show_edit_summary: false,
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
          field: 'alert_type',
          minWidth: 190,
          headerName: 'Alert Type',
          filter: 'agTextColumnFilter', editable: false
        },
        { field: 'classification', filter: 'agTextColumnFilter', headerName: 'Classification', editable: true },
        {
          field: 'title', filter: 'agTextColumnFilter', wrapText: true, width: 500, headerName: 'Title',
          // autoHeight: true
        },
        {
          field: 'summary', filter: 'agTextColumnFilter', width: 800, headerName: 'Summary',
          // autoHeight: true,
        },
        {
          field: 'sector_type', filter: 'agSetColumnFilter',
          filterParams: {
            values: function (params) {
              axios.get('/articles/fetch-sectors', { withCredentials: true }).then((resp) => {
                const response = resp.data.all_sector_types
                const filter_options_sectors = []
                response.map((v, k) => {
                  filter_options_sectors.push(v.name)
                })
                params.success(filter_options_sectors);
              })
            },
          },
          cellRendererFramework: 'SectorRender',
          wrapText: true,
          width: 200,
          // autoHeight: true,
          headerName: 'Sector Type',
        },
        {
          field: 'agencies',
          filter: 'agSetColumnFilter',
          filterParams: {
            values: function (params) {
              axios.get('/articles/fetch-agencies', { withCredentials: true }).then((resp) => {
                const response = resp.data.agencies
                const filter_options_agencies = []
                response.map((v, k) => {
                  filter_options_agencies.push(v.name)
                })
                params.success(filter_options_agencies);
              })
            },
          },
          cellRendererFramework: 'AgencyRender',
          wrapText: true,
          width: 200,
          // autoHeight: true,
          headerName: 'Agencies',
        },
        { field: 'filing_type', filter: 'agTextColumnFilter', headerName: 'Filing Type', editable: true },
        { field: 'in_federal_register', filter: 'agTextColumnFilter', headerName: 'In Federal Register', editable: true },
        {
          field: 'original_publication_date',
          filter: 'agTextColumnFilter',
          headerName: 'Original Publication Date',
          editable: true,
          width: 150,
          cellEditor: 'datePicker'
        },
        { field: 'status', filter: 'agTextColumnFilter', headerName: 'Status', editable: true },
        { field: 'pdf_url', filter: 'agTextColumnFilter', headerName: 'Asset Original URl', editable: true },
        {
          field: 'latest_update', filter: 'agTextColumnFilter', headerName: 'Latest Update', editable: true,
          width: 150,
          cellEditor: 'datePicker'
        },
        {
          field: 'rules',
          filter: 'agSetColumnFilter',
          filterParams: {
            values: function (params) {
              axios.get('/collections/all-rules', { withCredentials: true }).then((resp) => {
                const response = resp.data
                const filter_options_rules = []
                response.map((v, k) => {
                  filter_options_rules.push(v.name)
                })
                params.success(filter_options_rules);
              })
            },
          },
          cellRendererFramework: 'RulesRender',
          wrapText: true,
          width: 200,
          // autoHeight: true,
          headerName: 'Rules',
        },
        {
          field: "history",
          minWidth: 175,
          cellRendererFramework: "historyLogActionButton"
        }
      ],
      gridApi: null,
      columnApi: null,
      defaultColDef: {
        flex: 1,
        minWidth: 150,
        sortable: true,
        resizable: true,
        // editable: true,
      },
      rowSelection: null,
      rowModelType: null,
      cacheOverflowSize: null,
      maxConcurrentDatasourceRequests: null,
      infiniteInitialRowCount: null,
      maxBlocksInCache: null,
      paginationPageSize: null,
      cacheBlockSize: null,
      getRowId: null,
      selected_row_id: null,
    };
  },
  beforeMount() {
    this.detailRowHeight = 70;
    this.groupDefaultExpanded = 1;
    this.rowSelection = 'multiple';
    this.rowModelType = 'serverSide';
    this.suppressServerSideInfiniteScroll = 'partial';
    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 4;
    this.infiniteInitialRowCount = 1;
    this.maxBlocksInCache = 2;
    this.paginationPageSize = 25;
    this.cacheBlockSize = 25;
    this.getRowId = (item) => {
      return item.data.id;
    };
  },
  created() {
    // eslint-disable-next-line no-undef
    this.components = { datePicker: getDatePicker() };
    // this.gridApi.sizeColumnsToFit();


  },
  mounted() {
    this.fetch_all_agencies()
    this.$bus.$on('showHistoryModal', this.showHistoryLogs);
    console.log(this.$route.params.id)
  },
  methods: {
    load_agency_filter() {
      return this.filter_options_agencies
    },

    fetch_values(row, type) {
      if (row.field_name == 'agencies') {
        const row_values = eval(row[type])
        return row_values.map((v, k) => {
          return this.all_agencies.filter((i, j) => {
            return i.id == v
          })[0]['name']
        }).toString()
      } else {
        return row[type]
      }
    },
    return_json_key(json_obj) {
      return Object.keys(json_obj.fields)[0];
    },

    return_json_diff(json_data1, json_data2) {
      return diff(json_data2, json_data1)
    },
    format_diff(data, get_old = false) {
      const fields_data = data.fields
      const key_data = Object.keys(data.fields)[0]
      if (key_data == 'agencies') {
        const value_data = Object.values(data.fields)[0]
        let col_data = ''
        if (get_old) {
          col_data = value_data.filter((v, k) => {
            if (v.includes(' ')) {
              return v.toString()
            }
          }).toString().split(",").filter(function (element) {
            return element !== "undefined" && element !== ' ';
          });
          col_data = col_data.map((v, k) => {
            return this.all_agencies.filter((i, j) => {
              return i.id == v
            })[0]['name']
          })
          return col_data
        } else {
          col_data = value_data.filter((v, k) => {
            if (v.includes("+") || v.includes(' ')) {
              return v.toString()
            }
          }).toString().replaceAll("+", "").split(",").filter(function (element) {
            return element !== "undefined" && element !== ' ' && element !== '';
          });
          col_data = col_data.map((v, k) => {
            return this.all_agencies.filter((i, j) => {
              return i.id == v
            })[0]['name']
          })
          return col_data
        }
      } else {
        const value_data = Object.values(data.fields)[0]
        const col_data = ''
        if (get_old) {
          console.log("old",)
          return value_data.__old
        } else {
          return value_data.__new
        }
      }
      // console.log(Object.values(fields_data))
    },

    revert_changes(row) {
      const selected_id = this.selected_row_id
      const selected_reversion_id = row.id
      this.revertHistory(selected_reversion_id).then(() => {
        this.reload_history(this.history_selected_id)
        const notification = {
          message: `The article is reverted successfully to ${selected_reversion_id}`,
          type: 'success'
        }
        notificationStore.addNotification(notification);
      })

    },
    reload_history(id) {
      this.history_items = []
      this.selected_row_id = id
      this.getHistoryLog(id).then((resp) => {
        console.log(resp.data)
        this.history_items = resp.data

      })
    },
    showHistoryLogs(id) {
      console.log(id)
      this.history_selected_id = id
      this.history_items = []
      this.show_history_logs = false
      this.selected_row_id = id
      this.getHistoryLog(id).then((resp) => {
        this.history_items = resp.data
        console.log(this.history_items)

        this.show_history_logs = true
      });
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
    },
    onCellClicked(data) {
      const clicked_entity = data
      if (clicked_entity.column.colId == "agencies") {
        this.getArticle(clicked_entity.data.id).then(response => {
          this.edit_agency_form.selected_agencies = response.data.article.agencies
          this.edit_agency_form.id = response.data.article.id
        })
        this.show_edit_agency = true
      }
      if (clicked_entity.column.colId == "sector_type") {
        this.getArticle(clicked_entity.data.id).then(response => {
          this.edit_sector_form.selected_sectors = response.data.article.sector_type
          this.edit_sector_form.id = response.data.article.id
        })
        this.show_edit_sector = true
      }
      if (clicked_entity.column.colId == "summary") {
        this.getArticle(clicked_entity.data.id).then(response => {
          this.edit_summary_form.summary = response.data.article.summary
          this.edit_summary_form.id = response.data.article.id
        })
        this.show_edit_summary = true
      }
    },
    autoSizeAll(skipHeader) {
      const allColumnIds = [];
      this.gridColumnApi.getColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
    },
    onPageChange(params) {
      // this.gridApi = params.api;
      // this.gridColumnApi = params.columnApi;
      // this.pageNumber = this.gridApi.paginationGetCurrentPage() +1
      // console.log(params,"bhagwan")
    },
    onGridReady(params) {

      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      console.log(params.request)

      this.dataSource = {
        getRows: (params) => {
          console.log("here", params.request, params.request.filterModel.length)
          this.getAllArticleRules(params.request, this.gridApi.paginationGetCurrentPage() + 1, this.$route.params.id).then(response => {
            const data = response.data.results.map((v, k) => {
              const original_publication_date = new Date(v.original_publication_date);
              const org_date = v.original_publication_date.split("-")
              const day = original_publication_date.getDate() + "/";
              const month = (original_publication_date.getMonth() + 1) + "/";
              const year = original_publication_date.getFullYear();
              v.original_publication_date = org_date[1] + "/" + org_date[2] + "/" + org_date[0]
              const latest_update = new Date(v.latest_update);
              const lat_update = v.latest_update.split("-")
              const day_latest_update = original_publication_date.getDate() + "/";
              const month_latest_update = (original_publication_date.getMonth() + 1) + "/";
              const year_latest_update = original_publication_date.getFullYear();
              v.latest_update = lat_update[1] + "/" + lat_update[2] + "/" + lat_update[0]
              return v
            })
            this.all_agencies = response.data.agencies
            this.all_sectors = response.data.sectors
            this.refreshCol2(this.gridApi)
            params.successCallback(data, response.data.count)
          });
        }
      }

      this.gridApi.setServerSideDatasource(this.dataSource);
      this.autoSizeAll()

    },
    refreshStore() {
      this.gridApi.refreshServerSideStore({ purge: true });
    },
    refreshCol2(gridApi) {
      const ageFilter = gridApi.getFilterInstance('agencies');
      ageFilter.refreshFilterValues();
    },
    fetch_all_agencies() {
      this.getAllAgencies(1, '', 'all')
        .then(response => {
          this.all_agencies.push(...response.data.all_agencies)
        })
        .catch(() => {
          const notification = {
            message: 'There was an error fetching all agencies! Please refresh and try again.',
            type: 'danger'
          }
          notificationStore.addNotification(notification);
        });
    },
    editingDone(data) {
      const resp = data


      if (resp.oldValue !== resp.newValue) {
        const notification = {
          message: resp.column.colId + ' Updated.',
          type: 'success'
        }
        const request_data = {
          'col_name': resp.column.colId,
          'col_value': resp.newValue
        }
        if (resp.column.colId == 'original_publication_date' || resp.column.colId == 'latest_update') {
          const year = resp.newValue.split("/")[2] + "-";
          const month = resp.newValue.split("/")[1] + "-";
          const day = resp.newValue.split("/")[0];
          request_data.col_value = year + month + day
        }
        this.updateArticleEntity(resp.data.id, request_data).then(() => {
          notificationStore.addNotification(notification);
        })
      }
    },
    reset_edit_agency_Modal() {
      // this.refreshStore()
      this.show_edit_agency = false
    },
    handle_edit_agency_Ok(bvModalEvt) {
      const selected_agencies = [];
      const form_select_agencies = this.edit_agency_form.selected_agencies
      this.all_agencies.filter((v, k) => {
        if (form_select_agencies.includes(v.name)) {
          selected_agencies.push(v.id)
          return k
        }
      })
      if (selected_agencies.length > 0) {
        const data = {
          'selected_agency_ids': selected_agencies
        }
        this.updateArticleAgency(this.edit_agency_form.id, data)
      }
      console.log(selected_agencies)
      this.refreshStore()
      this.show_edit_agency = false

    },
    reset_edit_sector_Modal() {
      // this.refreshStore()
      this.show_edit_agency = false
    },
    handle_edit_sector_Ok(bvModalEvt) {
      const selected_sectors = [];
      const form_select_sectors = this.edit_sector_form.selected_sectors
      form_select_sectors.filter((v, k) => {
        console.log(form_select_sectors)
        selected_sectors.push(v.id)
        return k
      })
      console.log(form_select_sectors)
      if (selected_sectors.length > 0) {
        const data = {
          'selected_sectors_ids': selected_sectors
        }
        this.updateArticleSectors(this.edit_sector_form.id, data)
      }
      console.log(selected_sectors)
      this.refreshStore()
      this.show_edit_agency = false

    },
    handle_edit_summary_Ok(bvModalEvt) {
      const selected_agencies = [];

      const request_data = {
        'col_name': 'summary',
        'col_value': this.edit_summary_form.summary
      }
      const notification = {
        message: 'Summary Updated.',
        type: 'success'
      }
      this.updateArticleEntity(this.edit_summary_form.id, request_data).then(() => {
        notificationStore.addNotification(notification);
      })
      console.log(selected_agencies)
      this.refreshStore()
      this.show_edit_agency = false

    },
  },
};

</script>

<style>
</style>

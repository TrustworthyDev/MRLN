<template>
  <div class="container mt-5">
    <h3>All Rules</h3>
    <header_section :filter="filter" :type="type" :button_string="button_string"
      :hide_button="!hasPermissions(CREATE_RULE_PERMISSION)" />

    <div>
      <div v-if="show_rules_modal" id="customModal" class="modal-container" @click="event => closeModal(event)">
        <div class="modal-wrapper">

          <div class="modal-content">
            <div class="modal-sidebar">
              <div class="mb-3 mt-2">
                <logo width="30px" />
              </div>

              <div :class="{ 'modal-sidebar-link--active': determineIfActive(1) }" class="modal-sidebar-link"
                @click="() => changePage(1)">
                <vue-feather type="edit-3"></vue-feather>
              </div>

              <div :class="{ 'modal-sidebar-link--active': determineIfActive(2) }" class="modal-sidebar-link"
                @click="() => changePage(2)">
                <vue-feather type="square"></vue-feather>
              </div>

              <div :class="{ 'modal-sidebar-link--active': determineIfActive(3) }" class="modal-sidebar-link"
                @click="() => changePage(3)">
                <vue-feather type="calendar"></vue-feather>
              </div>


            </div>

            <div class="modal-tab-wrapper">

              <div class="modal-tab-header">
                <div>
                  <h5 v-if="!edit_mode" class="text-uppercase fw-bold text-green mb-2 mb-md-0">
                    Create Rule
                  </h5>
                  <h5 v-else class="text-uppercase fw-bold text-green mb-2 mb-md-0">
                    Update Rule
                  </h5>
                </div>

                <div class="d-flex align-items-center">
                  <div v-if="!edit_mode" class="btn btn-primary btn-sm me-2" @click="addRule">Save</div>
                  <div v-else class="btn btn-primary btn-sm me-2" @click="updateRule(selected_id)">Update</div>
                  <button aria-label="Close" class="btn-close" type="button" @click="hideModal"></button>
                </div>
              </div>

              <div v-if="getIsLoading">
                <spinner />
              </div>
              <div v-else class="modal-tab-content">
                <template v-if="page === 1">
                  <label class="small text-dark" for="name">Rule Name</label>
                  <input id="name" v-model="forms.fields.rule_name" class="form-control form-control-sm"
                    placeholder="Name..." type="text">
                  <br>
                  <h5>Action To Perform</h5>
                  <div class="my-3">


                    <div class="row">
                      <div class="col-md-4">
                        <RadioButton v-model="forms.fields.selected_action_type" inputId="ingredient2" name="ruleType"
                          value="find_and_replace" />
                        <label for="ingredient2" class="ml-2 mx-2">Find&Replace</label>
                      </div>
                      <div class="col-md-4">
                        <RadioButton v-model="forms.fields.selected_action_type" inputId="ingredient3" name="pizza"
                          value="update_relation" />
                        <label for="ingredient3" class="ml-2 mx-2">Update Relation</label>
                      </div>
                      <div class="col-md-4">
                        <RadioButton v-model="forms.fields.selected_action_type" inputId="ingredient4" name="pizza"
                          value="update_article_status" />
                        <label for="ingredient4" class="ml-2 mx-2">Change Article Status</label>
                      </div>


                    </div>
                    <div v-if="forms.fields.selected_action_type == 'find_and_replace'" class="my-2">
                      <hr>

                      <div class="row">
                        <div class="col-md-4">
                          <p class="mb-0 font-weight-bold">Select Column</p>
                          <v-select v-model="forms.fields.find_and_replace.selected_column"
                            :options="['Title', 'Summary', 'PDF_URL', 'IN_Federal_Register', 'Federal_Register_Number', 'Regalytics_Alert_Id']"
                            placeholder="Select Column..."></v-select>
                        </div>
                        <div class="col-md-4">
                          <p class="mb-0 font-weight-bold">Find</p>
                          <input id="find" v-model="forms.fields.find_and_replace.find_with"
                            class="form-control form-control-sm" placeholder="Find With..." type="text">
                        </div>
                        <div class="col-md-4">
                          <p class="mb-0 font-weight-bold">Replace</p>
                          <input id="replace" v-model="forms.fields.find_and_replace.replace_with"
                            class="form-control form-control-sm" placeholder="Replace With..." type="text">
                        </div>
                      </div>
                      <hr>

                    </div>

                    <div v-if="forms.fields.selected_action_type == 'update_relation'" class="my-2">
                      <hr>

                      <div class="row">
                        <div class="col-md-6">
                          <p class="mb-0 font-weight-bold">Select Column</p>
                          <v-select v-model="forms.fields.update_relation.selected_column"
                            :options="default_data.selected_relation_option" label="name"
                            placeholder="Select Column..."></v-select>
                        </div>
                        <div class="col-md-6">
                          <p v-if="forms.fields.update_relation.selected_column.item.key == 'agencies' || forms.fields.update_relation.selected_column.item.key == 'alert_type'"
                            class="mb-0 font-weight-bold">
                            Select value</p>
                          <v-select v-if="forms.fields.update_relation.selected_column.item.key == 'agencies'"
                            v-model="forms.fields.update_relation.agencies" :options="default_data.all_agencies"
                            label="name" multiple />
                          <v-select v-if="forms.fields.update_relation.selected_column.item.key == 'alert_type'"
                            v-model="forms.fields.update_relation.alert_type" :options="default_data.all_alerts"
                            label="name" />

                        </div>
                      </div>
                      <hr>

                    </div>
                    <div v-if="forms.fields.selected_action_type == 'update_article_status'" class="my-2">
                      <hr>

                      <div class="row">
                        <div class="col-md-4">
                          <p class="mb-0 font-weight-bold">Select Status</p>
                          <v-select v-model="forms.fields.update_article_status.selected_column" :options="['Unedited',
                            'Edited',
                            'Ready for review',
                            'Ready for publication',
                            'Published'
                          ]" placeholder="Status"></v-select>
                        </div>

                      </div>
                      <hr>

                    </div>
                    <div v-if="forms.fields.selected_action_type == 'change_overwrite_value'" class="my-2">
                      <hr>

                      <div class="row">
                        <div class="col-md-6">
                          <p class="mb-0 font-weight-bold">Select Column</p>
                          <v-select v-model="forms.fields.change_overwrite_value.selected_column"
                            :options="default_data.selected_column_option" label="name" placeholder="Column Name">
                          </v-select>
                        </div>
                        <div class="col-md-6" v-if="forms.fields.change_overwrite_value.selected_column != ''">
                          <label class="mr-2">{{ forms.fields.change_overwrite_value.selected_column.name }}: </label>
                          <input v-model="forms.fields.change_overwrite_value.selected_value" class="form-control"
                            type="date">
                        </div>
                      </div>
                      <hr>

                    </div>
                    <div v-if="forms.fields.selected_action_type == 'sector_type'" class="my-2">
                      <hr>

                      <div class="row">
                        <div class="col-md-6">
                          <p class="mb-0 font-weight-bold">Select Sectors</p>
                          <v-select v-model="forms.fields.sector_type.selected_column" :options="default_data.all_sectors"
                            label="name" placeholder="Sector Name"></v-select>
                        </div>

                      </div>
                      <hr>

                    </div>
                  </div>
                  <h5>Keywords</h5>
                  <div class="my-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <p class="mb-0 font-weight-bold">Includes (any of these words):</p>
                      <PopOver icon="icon">
                        Searches for Articles that contain any keywords in either the title, summary or agencies.
                        Example: bank, money (Returns any Articles that contain either "bank" or "money")
                      </PopOver>
                    </div>
                    <v-select v-model="search_filters.orIncludes" :noDrop="true" multiple
                      placeholder="Enter keyword and press enter..." taggable />
                  </div>
                  <div class="my-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <p class="mb-0 font-weight-bold">Includes (all of these words):</p>
                      <PopOver icon="icon">
                        Searches for Articles that contain all keywords in either the title, summary or agencies.
                        Example: bank, money (Returns any Articles that contain both "bank" and "money")
                      </PopOver>
                    </div>
                    <v-select v-model="search_filters.includes" :noDrop="true" multiple
                      placeholder="Enter keyword and press enter..." taggable />
                  </div>
                  <div class="my-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <p class="mb-0 font-weight-bold">Excludes (any of these words):</p>
                      <pop-over icon="icon">
                        Exclude any Articles that contain any keywords in either the title, summary or agencies.
                        Example: bank, money (Ignores any Articles that contain either "bank" and/or "money")
                      </pop-over>
                    </div>

                    <v-select v-model="search_filters.excludes" :noDrop="true" multiple
                      placeholder="Enter keyword and press enter..." taggable />
                  </div>
                </template>

                <template v-if="page === 2">
                  <h5>Article Details</h5>
                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">Agencies</p>
                    <v-select v-model="search_filters.agency" :options="default_data.all_agencies" label="name"
                      multiple />
                  </div>
                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">States</p>
                    <v-select v-model="search_filters.state" :options="default_data.all_states" label="name" multiple />
                  </div>
                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">Countries</p>
                    <v-select v-model="search_filters.country" :options="default_data.all_countries" label="name"
                      multiple />
                  </div>
                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">Alert Types</p>
                    <v-select v-model="search_filters.alertType" :options="default_data.all_alerts" label="name"
                      multiple />
                  </div>
                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">Alert Classification</p>
                    <v-select v-model="search_filters.higher_order_alert_classification"
                      :options="default_data.higher_order_alert_classification" label="name" multiple />
                  </div>

                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">Alert Subclassification</p>
                    <v-select v-model="search_filters.subtype_classification"
                      :options="default_data.subtype_classification" label="name" multiple />
                  </div>

                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">Tags</p>
                    <v-select v-model="search_filters.tags" :options="default_data.tags" label="name" multiple />
                  </div>

                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">Agency Classification</p>
                    <div class="form-check form-check-inline">
                      <input type="checkbox" class="form-check-input" v-model="search_filters.classification.sro">
                      <label>SRO</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input type="checkbox" class="form-check-input" v-model="search_filters.classification.federal">
                      <label>Federal</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input type="checkbox" class="form-check-input" v-model="search_filters.classification.state">
                      <label>State</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input type="checkbox" class="form-check-input" v-model="search_filters.classification.territory">
                      <label>Territory</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input type="checkbox" class="form-check-input"
                        v-model="search_filters.classification.multinational">
                      <label>Multinational</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input type="checkbox" class="form-check-input" v-model="search_filters.classification.county">
                      <label>County</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input type="checkbox" class="form-check-input"
                        v-model="search_filters.classification.international">
                      <label>International</label>
                    </div>
                  </div>
                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">Status</p>
                    <div class="form-check form-check-inline">
                      <input v-model="search_filters.status.new" class="form-check-input" type="checkbox">
                      <label>New</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input v-model="search_filters.status.updated" class="form-check-input" type="checkbox">
                      <label>Updated</label>
                    </div>
                  </div>

                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">In Federal Register</p>
                    <div class="form-check form-check-inline">
                      <input v-model="search_filters.inFederalRegister.yes" class="form-check-input" type="checkbox">
                      <label>Yes</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input v-model="search_filters.inFederalRegister.not_yet" class="form-check-input" type="checkbox">
                      <label>Not Yet</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input v-model="search_filters.inFederalRegister.not_expected" class="form-check-input"
                        type="checkbox">
                      <label>Not Expected</label>
                    </div>
                  </div>

                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">Docket File Number</p>
                    <input v-model="search_filters.docket_file_number" class="form-control form-control-sm" type="text">
                  </div>
                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">Order Notice ID</p>
                    <input v-model="search_filters.order_notice" class="form-control form-control-sm" type="text">
                  </div>
                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">SEC Release Number</p>
                    <input v-model="search_filters.sec_release_number" class="form-control form-control-sm" type="text">
                  </div>
                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">Federal Register Number</p>
                    <input v-model="search_filters.federalRegisterNumber" class="form-control form-control-sm"
                      type="text">
                  </div>
                  <div class="my-3">
                    <p class="mb-0 font-weight-bold">RegAlytics Alert ID</p>
                    <input v-model="search_filters.regAlyticsAlertId" class="form-control form-control-sm" type="text">
                  </div>
                </template>

                <template v-if="page === 3">
                  <h5>Dates</h5>
                  <div class="my-3">
                    <p class="mb-1 fw-bold">Latest Update</p>
                    <div class="d-flex justify-content-between">
                      <div class="form-inline me-4">
                        <label class="mr-2">Starting Date: </label>
                        <input v-model="search_filters.latestUpdate.start" class="form-control" type="date">
                      </div>
                      <div class="form-inline">
                        <label class="mr-2">Ending Date:</label>
                        <input v-model="search_filters.latestUpdate.end" class="form-control" type="date">
                      </div>
                    </div>
                  </div>
                  <hr>
                  <div class="my-3">
                    <p class="mb-1 fw-bold">Originally Published</p>
                    <div class="d-flex justify-content-between">
                      <div class="form-inline me-4">
                        <label class="mr-2">Starting Date: </label>
                        <input v-model="search_filters.originallyPublished.start" class="form-control" type="date">
                      </div>
                      <div class="form-inline">
                        <label class="mr-2">Ending Date:</label>
                        <input v-model="search_filters.originallyPublished.end" class="form-control" type="date">
                      </div>
                    </div>
                  </div>
                  <hr>
                  <div class="my-3">
                    <p class="mb-1 fw-bold">Proposed Comments Due</p>
                    <div class="d-flex justify-content-between">
                      <div class="form-inline me-4">
                        <label class="mr-2">Starting Date: </label>
                        <input v-model="search_filters.proposedCommentsDue.start" class="form-control" type="date">
                      </div>
                      <div class="form-inline">
                        <label class="mr-2">Ending Date:</label>
                        <input v-model="search_filters.proposedCommentsDue.end" class="form-control" type="date">
                      </div>
                    </div>
                  </div>
                  <hr>
                  <div class="my-3">
                    <p class="mb-1 fw-bold">Rule Effective</p>
                    <div class="d-flex justify-content-between">
                      <div class="form-inline me-4">
                        <label class="mr-2">Starting Date: </label>
                        <input v-model="search_filters.ruleEffective.start" class="form-control" type="date">
                      </div>
                      <div class="form-inline">
                        <label class="mr-2">Ending Date:</label>
                        <input v-model="search_filters.ruleEffective.end" class="form-control" type="date">
                      </div>
                    </div>
                  </div>
                  <hr>
                  <div class="my-3">
                    <p class="mb-1 fw-bold">Published In Federal Register</p>
                    <div class="d-flex justify-content-between">
                      <div class="form-inline me-4">
                        <label class="mr-2">Starting Date: </label>
                        <input v-model="search_filters.publishedInFederalReserve.start" class="form-control" type="date">
                      </div>
                      <div class="form-inline">
                        <label class="mr-2">Ending Date:</label>
                        <input v-model="search_filters.publishedInFederalReserve.end" class="form-control" type="date">
                      </div>
                    </div>
                  </div>
                </template>


              </div>
            </div>
          </div>

        </div>
      </div>
      <b-modal size="xl" v-model="show_schedule_modal" @ok="handleOk">
        <div class="card">
          <div class="card-body">
            <b-form-group label="Execute Rule" v-slot="{ ariaDescribedby }">
              <b-form-radio-group id="radio-group-1" v-model="RuleExecuteselected" :options="RuleExecuteoptions"
                :aria-describedby="ariaDescribedby" name="radio-options"></b-form-radio-group>
            </b-form-group>
          </div>
        </div>
      </b-modal>

      <b-modal v-model="showHistoryModal" title="History" @hidden="closeHistoryModal" size="xl">
        <div>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Applied At</th>
                <th>Applied By</th>
                <th>Articles Affected</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="historyItem in historyData" :key="historyItem.id">
                <td>{{ historyItem.applied_at ? new Date(historyItem.applied_at).toLocaleString() : '' }}</td>
                <td>{{ historyItem.applied_by }}</td>
                <td>{{ historyItem.articles_affected }}</td>
                <td>
                  <b-button class="mx-2 btn btn-danger" size="sm" @click="revertHistory(historyItem)"
                    :disabled="historyItem.loading">
                    <vue-feather v-if="!historyItem.applyFlag && !historyItem.loading" type="activity"></vue-feather>
                    <b-spinner small type="grow" v-else></b-spinner>
                    <span>Revert History</span>
                  </b-button>


                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <template #modal-footer>
          <b-button variant="secondary" @click="closeHistoryModal">Close</b-button>
        </template>
      </b-modal>

      <div>

        <b-table :fields="fields" :busy="isBusy" :items="getPaginatedRules" hover sticky-header>
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template #cell(name)="row">
            {{ row.item.rule_name }}<br>
          </template>
          <template #cell(Action)="row">
            <b-button class="mx-2 btn btn-success" size="sm" @click="editRule(row.item.id)"
              v-if="hasPermissions(EDIT_RULE_PERMISSION)">
              <vue-feather type="edit-3"></vue-feather>
              <span>Edit</span>
            </b-button>
            <b-button class="mx-2 btn btn-danger" size="sm" @click="applyRule(row.item.id)"
              v-if="hasPermissions(APPLY_RULE_PERMISSION)" :disabled="row.item.applyFlag">
              <vue-feather v-if="!row.item.applyFlag" type="play"></vue-feather>
              <b-spinner small type="grow" v-else></b-spinner>
              <span>Apply</span>
            </b-button>
            <b-button class="mx-2 btn btn-danger" size="sm" @click="showScheduleModal(row.item)">
              <vue-feather type="clock"></vue-feather>
              <span>Schedule</span>
            </b-button>
            <b-button class="mx-2 btn btn-danger" size="sm" @click="view_rule_article(row.item.id)">
              <vue-feather type="eye"></vue-feather>
              <span>Articles</span>
            </b-button>
            <b-button class="mx-2 btn btn-primary" size="sm" @click="cloneRule(row.item.id)">
              <vue-feather type="copy"></vue-feather>
              <span>Clone</span>
            </b-button>
            <b-button class="mx-2 btn btn-danger" size="sm" @click="deleteRule(row.item.id)">
              <vue-feather type="trash-2"></vue-feather>
              <span>Delete</span>
            </b-button>

            <b-button class="mx-2 btn btn-primary" size="sm" @click="openHistoryModal(row.item.id)">
              <vue-feather type="aperture"></vue-feather>
              <span>History</span>
            </b-button>
          </template>
        </b-table>
        <div v-if="items.length > 0" class="mt-3">
          <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"></b-pagination>
        </div>
        <b-modal v-model="cloneModal" title="Clone Rule" hide-footer>
          <div>
            <label for="clone-rule-name">New Rule Name:</label>
            <b-form-input v-model="newRuleName" id="clone-rule-name"></b-form-input>
          </div>
          <div class="mt-2">
            <b-button variant="secondary" @click="closeCloneModal">Cancel</b-button>
            <b-button variant="primary" @click="handleClone" class="mx-2">Clone</b-button>
          </div>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import {
RulesApi
} from "@/api";
import axios from "@/axios";
import logo from "@/components/Logo.vue";
import PopOver from "@/components/articles/articles-search-options/PopOver.vue";
import DataRow from "@/components/articles/data-row/DataRow.vue";
import header_section from "@/components/inner-layouts/crud-header-section";
import bs_table from "@/components/inner-layouts/table.vue";
import { useAccountStore } from "@/stores/account";
import { useKeywordStore } from '@/stores/keywords';
import { useNewModelStore } from '@/stores/newModel';
import { useNotificationStore } from '@/stores/notifications';
import { getAllStatesAgenciesAndAlertTypes } from "@/stores/services/articleService";
import RadioButton from 'primevue/radiobutton';

const accountStore = useAccountStore();
const reset_data = {
  status: {
    new: false,
    updated: false
  },
  classification: {
    sro: false,
    federal: false,
    state: false,
    territory: false,
    county: false,
    international: false,
    multinational: false

  },
  filingType: {
    single: false,
    joint: false
  },

  inFederalRegister: {
    yes: false,
    not_yet: false,
    not_expected: false
  },
  regAlyticsAlertId: '',
  federalRegisterNumber: '',
  sec_release_number: '',
  docket_file_number: '',
  order_notice: '',
  state: [],
  country: [],
  agency: [],
  alertType: [],
  sector_type: [],
  tags: [],
  subtype_classification: [],
  higher_order_alert_classification: [],
  includes: [],
  orIncludes: [],
  excludes: [],
  latestUpdate: {
    start: null,
    end: null
  },

  originallyPublished: {
    start: null,
    end: null
  },

  proposedCommentsDue: {
    start: null,
    end: null
  },

  ruleEffective: {
    start: null,
    end: null
  },

  publishedInFederalReserve: {
    start: null,
    end: null
  }
}
const default_form_data = {
  fields: {
    selected_action_type: '',
    rule_name: '',
    find_and_replace: {
      selected_column: '',
      find_with: '',
      replace_with: '',
      allIncludeKeywords: ''
    }, update_article_status: {
      selected_column: '',
      selected_status: '',

    }, change_overwrite_value: {
      selected_column: {
        item: ''
      },
      selected_value: '',

    }, update_relation: {
      selected_column: {
        item: {
          key: ''
        }
      },
      selected_type: '',
      agencies: [],
      sector_types: [],
      alert_type: []
    },
    sector_type: {
      selected_value: '',
    }

  }
}
export default {
  name: "Rules",
  mixins: [RulesApi],
  components: {
    DataRow, bs_table, logo, PopOver, RadioButton, header_section
  },
  data() {
    return {
      filter: "",
      type: "rules",
      button_string: "New Rule",
      showHistoryModal: false,
      historyData: [],   // empty array initially
      APPLY_RULE_PERMISSION: 'Publish a rule',
      CREATE_RULE_PERMISSION: 'Create a rule',
      EDIT_RULE_PERMISSION: 'Edit a rule',
      RuleExecuteselected: null,
      selected_rule_from_list: null,
      RuleExecuteoptions: [
        { text: 'During Data Pull', value: 'pull' },
        { text: 'During Data Push', value: 'push' },
        { text: 'None selected', value: 'none' },
      ],
      cloneModal: false,
      newRuleName: "",
      edit_mode: false,
      isBusy: false,
      currentPage: 1,
      perPage: 25,
      selected_id: null,
      show_rules_modal: false,
      show_schedule_modal: false,
      getIsLoading: false,
      page: 1,
      fields: [
        { key: 'name', label: 'Name', tdClass: 'name-col' },
        { key: 'Action', label: 'Action', tdClass: 'action-col' }
      ],
      default_data: {
        all_agencies: [],
        all_states: [],
        all_countries: [],
        all_alerts: [],
        all_sectors: [],
        selected_relation_option: [
          { item: { key: 'alert_type', type: 'o2o' }, name: 'Alert Type' },
          { item: { key: 'sector_types', type: 'm2m' }, name: 'Sector Type' },
          { item: { key: 'status', type: 'm2m' }, name: 'Status' },
          { item: { key: 'classification', type: 'm2m' }, name: 'Classification' },
          { item: { key: 'article_type', type: 'o2o' }, name: 'Article Type' },
          { item: { key: 'filing_type', type: 'm2m' }, name: 'Filing Type' },
          { item: { key: 'tags', type: 'm2m' }, name: 'Tags' },
          { item: { key: 'subtype_classification', type: 'm2m' }, name: 'Subtype Classification' },
          { item: { key: 'agencies', type: 'm2m' }, name: 'Agencies' }
        ],
        selected_column_option: [
          { item: 'latest_update', name: 'Latest Update Date' },
          { item: 'original_publication_date', name: 'Originally Published Date' },
          { item: 'proposed_comments_due_date', name: 'Proposed Comments Due Date' },
          { item: 'rule_effective_date', name: 'Rule Effective' },
          { item: 'federal_register_publication_date', name: 'Published In Federal Register' },
        ]
      },
      search_filters: {
        status: {
          new: false,
          updated: false
        },
        classification: {
          sro: false,
          federal: false,
          state: false,
          territory: false,
          county: false,
          international: false,
          multinational: false

        },
        filingType: {
          single: false,
          joint: false
        },

        inFederalRegister: {
          yes: false,
          not_yet: false,
          not_expected: false
        },
        regAlyticsAlertId: '',
        federalRegisterNumber: '',
        sec_release_number: '',
        docket_file_number: '',
        order_notice: '',
        state: [],
        country: [],
        agency: [],
        alertType: [],
        sector_type: [],
        tags: [],
        subtype_classification: [],
        higher_order_alert_classification: [],
        includes: [],
        orIncludes: [],
        excludes: [],
        latestUpdate: {
          start: null,
          end: null
        },

        originallyPublished: {
          start: null,
          end: null
        },

        proposedCommentsDue: {
          start: null,
          end: null
        },

        ruleEffective: {
          start: null,
          end: null
        },

        publishedInFederalReserve: {
          start: null,
          end: null
        }
      },
      forms: {
        fields: {
          selected_action_type: '',
          rule_name: '',
          find_and_replace: {
            selected_column: '',
            find_with: '',
            replace_with: '',
            allIncludeKeywords: ''
          }, update_article_status: {
            selected_column: '',
            selected_status: '',

          }, change_overwrite_value: {
            selected_column: '',
            selected_value: '',

          }, update_relation: {
            selected_column: {
              item: {
                key: ''
              }
            },
            selected_type: '',
            agencies: [],
            sector_types: [],
            alert_type: []
          }, sector_type: {
            selected_column: {
              item: {
                key: ''
              }
            }
          }

        }
      },
      items: [
        { isActive: true, age: 40, rule_name: 'Dickerson', last_name: 'Macdonald' },
        { isActive: false, age: 21, rule_name: 'Larsen', last_name: 'Shaw' },
        { isActive: false, age: 89, rule_name: 'Geneva', last_name: 'Wilson' },
        { isActive: true, age: 38, rule_name: 'Jami', last_name: 'Carney' }
      ],
    }
  },
  mounted() {
    this.$bus.$on("on_search_rules", this.onSearch);
    this.$bus.$on("create_new_model_rules", this.create_new_rule);
  },
  computed: {
    getRules() {

      const keyWordStore = useKeywordStore();
      return keyWordStore.getRules;
    },
    totalRows() {
      return this.getRules.length;
    },
    getPaginatedRules() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.getRules.slice(start, end);
    },

  },

  methods: {
    onSearch(value) {
      // temporarily implemented local search but needs to be paginated from backend
      this.filter = value;
      this.currentPage = 1;
      const keyWordStore = useKeywordStore();
      keyWordStore.filterRules(this.filter);
    },
    sortHistoryData() {
      // Sort historyData in descending order based on 'applied_at'
      this.historyData.sort((a, b) => {
        return new Date(b.applied_at) - new Date(a.applied_at);
      });
    },
    openHistoryModal(itemId) {
      this.getRuleHistory(itemId)
        .then(response => {
          this.historyData = response.data || [];
          this.sortHistoryData();
        })
        .catch(error => {
          console.error('Error fetching history data:', error);
        })
        .finally(() => {
          this.showHistoryModal = true;
        });
    },
    closeHistoryModal() {
      // Reset historyData when closing the modal
      this.historyData = [];
      this.showHistoryModal = false;
    },
    revertHistory(historyItem) {
      this.revertRuleHistory(historyItem.rule_id, { operation_uuid: historyItem.operation_uuid })
        .then(response => {
          const taskId = response.data.id;

          const callback = function (taskStatus, rule_id) {
            switch (taskStatus) {
              case "SUCCESS": {
                const notification = {
                  message: `Rule reverted successfully`,
                  type: 'success'
                }
                clearInterval(timerId);
                historyItem.loading = false;
                const notificationStore = useNotificationStore();
                notificationStore.addNotification(notification);
                return false;
              }

              case "FAILURE": {
                const notification = {
                  message: `There was an error reverting this rule`,
                  type: 'danger'
                }
                clearInterval(timerId);
                historyItem.loading = false;
                const notificationStore = useNotificationStore();
                notificationStore.addNotification(notification);
                return false;
              }

              default:
                // do-nothing
                break;
            }
          }

          const timerId = setInterval(() => {
            this.checkApplyRuleStatus(taskId, historyItem.rule_id, callback);
          }, 3000);

        })
        .catch(error => {
          console.error('Error reverting history data:', error);
        })
        .finally(() => {
          historyItem.loading = true;
        });
    },

    async deleteRule(ruleId) {
      if (confirm("Are you sure you want to delete this rule?")) {
        try {
          await axios.post(`/collections/delete-rule/${ruleId}/`, {},{ withCredentials: true });
          // Refresh the table or update the rules list after successful deletion
          this.on_load_init();
        } catch (error) {
          console.error("Error deleting rule:", error);
        }
      }
    },
    async cloneRule(ruleId) {
      this.cloneModal = true;
      this.ruleToCloneId = ruleId;
    },

    async handleClone() {
      if (!this.newRuleName) {
        return;
      }

      try {
        const response = await axios.post("/collections/clone-rule/", {
          ruleId: this.ruleToCloneId,
          newRuleName: this.newRuleName,
        }, { withCredentials: true });

        // Handle successful cloning
        console.log("Rule cloned:", response.data);
        const notification = {
          message: 'Rule cloned',
          type: 'success'
        }
        const notificationStore = useNotificationStore()
        notificationStore.addNotification(notification);
        // Close the modal and reset inputs
        this.closeCloneModal();
        this.on_load_init();
      } catch (error) {
        console.error("Error cloning rule:", error);
      }
    },

    closeCloneModal() {
      this.cloneModal = false;
      this.newRuleName = "";
      this.ruleToCloneId = null;
    },
    setIsOpen(payload) { // parameter type boolean
      const newModelStore = useNewModelStore();
      newModelStore.setIsOpen(payload);
    },
    hasPermissions: function (requiredPermission) {
      const userPermissions = accountStore.getCurrentUser.permissions;
      return userPermissions.includes(`${requiredPermission}`);
    },

    setModelType(payload) { // parameter type ModelTypes
      const newModelStore = useNewModelStore();
      newModelStore.setModelType(payload);

    },

    resetModal() {

    },
    fetchAllSectors() {
      return axios.get('/articles/fetch-sectors', { withCredentials: true })
    },
    view_rule_article(id) {
      window.open('/dashboard/rules/articles/' + id, "_blank");
    },
    showScheduleModal(data) {
      console.log(data.scheduled_at)
      this.RuleExecuteselected = null;
      this.show_schedule_modal = true;
      this.selected_rule_from_list = data.id;
      this.RuleExecuteselected = data.scheduled_at;
    },
    applyRule(id) {
      const keyWordStore = useKeywordStore();
      keyWordStore.addRulesData({ id: id, flag: true });
      this.applyRule_(id, {})
        .then(response => {
          const taskId = response.data.id;

          const callback = function (taskStatus, rule_id) {
            switch (taskStatus) {
              case "SUCCESS": {
                const notification = {
                  message: `Rule applied successfully`,
                  type: 'success'
                }
                clearInterval(timerId);
                const keyWordStore = useKeywordStore();
                keyWordStore.addRulesData({ id: rule_id, flag: false });
                const notificationStore = useNotificationStore();
                notificationStore.addNotification(notification);
                return false;
              }

              case "FAILURE": {
                const notification = {
                  message: `There was an error applying this rule`,
                  type: 'danger'
                }
                clearInterval(timerId);
                const keyWordStore = useKeywordStore();
                keyWordStore.addRulesData({ id: rule_id, flag: false });
                const notificationStore = useNotificationStore();
                notificationStore.addNotification(notification);
                return false;
              }

              default:
                // do-nothing
                break;
            }
          }

          const timerId = setInterval(() => {
            this.checkApplyRuleStatus(taskId, id, callback);
          }, 3000);

        })
        .catch((err) => {
          console.log(err)
          const keyWordStore = useKeywordStore();
          keyWordStore.addRulesData({ id: id, flag: true });
          const notification = {
            message: 'There was an error applying Rule',
            type: 'danger'
          }
          const notificationStore = useNotificationStore()
          notificationStore.addNotification(notification);
        });
    },
    checkApplyRuleStatus(taskId, rule_id, callback) {
      this.checkTaskStatus(taskId)
        .then(response => {
          const taskStatus = response.data.task_status;
          callback(taskStatus, rule_id);
        });
    },

    editRule(id) {
      // axios.get('/collections/rule-detail/' + id, { withCredentials: true })
      //   .then(response => {
      //     this.selected_id = id
      //     const search_filter_added = JSON.parse(response.data.rule.parameters.replace(/'/g, '"').replaceAll('False', 'false').replaceAll('True', 'true').replaceAll('None', null)).searchFilters
      //     const form_fields = JSON.parse(response.data.rule.action_metadata.replace(/'/g, '"').replaceAll('False', 'false').replaceAll('True', 'true').replaceAll('None', null))
      //     this.search_filters = search_filter_added
      //     this.forms.fields = form_fields
      //     this.show_rules_modal = true
      //     this.edit_mode = true
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //     const notification = {
      //       message: 'There was an error fetching Rule',
      //       type: 'danger'
      //     }
      //     const notificationStore = useNotificationStore();
      //     notificationStore.addNotification(notification);
      //   });
      // this.$router.push('/dashboard/edit-rule/'+id);
      this.$router.push({ name: 'Edit Rule', params: { id: id } });

    },
    hideModal() {
      this.show_rules_modal = false
    },
    updateRule(id) {
      if (this.forms.fields.rule_name !== '') {
        const data = {
          searchValue: "",
          itemId: id,
          searchFilters: this.search_filters,
          action_meta_data: this.forms.fields
        }
        // all-rules
        axios.put('/collections/all-rules', data, { withCredentials: true })
          .then(response => {
            this.on_load_init()
            this.show_rules_modal = false
            const notification = {
              message: 'Rule Edited Successfully for ' + response.data.article_count + ' alerts',
              type: 'success'
            }
            const notificationStore = useNotificationStore();
            notificationStore.addNotification(notification);
          })
          .catch(() => {
            const notification = {
              message: 'There was an error creating Rule',
              type: 'danger'
            }
            const notificationStore = useNotificationStore();
            notificationStore.addNotification(notification);
          });
        console.log(data)
      } else {
        const notification = {
          message: 'Please add a rule name',
          type: 'danger'
        }
        const notificationStore = useNotificationStore();
        notificationStore.addNotification(notification);
      }
    },
    addRule() {
      if (this.forms.fields.rule_name !== '') {
        const data = {
          searchValue: "",
          searchFilters: this.search_filters,
          action_meta_data: this.forms.fields
        }
        // all-rules
        axios.post('/collections/all-rules', data, { withCredentials: true })
          .then(response => {
            this.on_load_init()
            this.show_rules_modal = false
          })
          .catch(() => {
            const notification = {
              message: 'There was an error creating Rule',
              type: 'danger'
            }
            const notificationStore = useNotificationStore();
            notificationStore.addNotification(notification);
          });
        console.log(data)
      } else {
        const notification = {
          message: 'Please add a rule name',
          type: 'danger'
        }
        const notificationStore = useNotificationStore();
        notificationStore.addNotification(notification);
      }


    },
    resetSearchOptions() {

    },
    closeModal(event) {
      if (event.target.id === 'customModal') {
        this.show_rules_modal = false
      }
    },
    closeScheduleModal(event) {
      if (event.target.id === 'customModal') {
        this.show_rules_modal = false
      }
    },
    changePage(pageNumber) {
      this.page = pageNumber;
    },
    determineIfActive(pageNumber) {
      return pageNumber === this.page;
    },
    handleOk() {
      console.log(this.RuleExecuteselected, this.selected_rule_from_list);
      axios.post('/collections/rules/update-schedule?rule=' + this.selected_rule_from_list, { 'scheduled_at': this.RuleExecuteselected }, { withCredentials: true })
        .then(response => {
          const taskId = response.data.id;
          this.on_load_init();
        })
    },
    create_new_rule() {
      // this.show_rules_modal = true
      // this.edit_mode = false
      // Object.assign(this.search_filters, reset_data)
      // Object.assign(this.forms, default_form_data)
      // this.$router.push('/dashboard/create-rule');
      this.$router.push({ name: 'Create Rule', query: { clear: 'true' } });
    },
    on_load_init() {
      this.isBusy = true
      const keyWordStore = useKeywordStore();
      keyWordStore.fetchAllRules();
      getAllStatesAgenciesAndAlertTypes().then(response => {
        console.debug(response.data);
        Object.assign(this.default_data, response.data)
      })
      this.fetchAllSectors().then(response => {
        this.default_data.all_sectors = response.data.all_sector_types
      });
      this.isBusy = false
    }

  },

  created() {
    this.on_load_init();
  }

}

</script>

<style lang="scss">
.name-col {
  width: 30%;
}

.action-col {
  widows: 70%;
}

.page-item.active .page-link {
  background-color: #88ad3a !important;
  border-color: #88ad3a !important;
}

.keyword-container {
  background-color: white;
}

.close {
  color: black;
  background: transparent;
  border: navajowhite;
  font-size: 33px;
  font-weight: bold;
}

.modal-container {
  display: block;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;

  background: rgba(0, 0, 0, 0.2);
  z-index: 9999;
}

.modal-wrapper {
  position: relative;
  border: none;
  border-radius: 0;
  outline: 0;
  background: white;
  margin: 0 0;
  width: 100% !important;
  height: 100%;

  @media (min-width: 991px) {
    border: 1px solid rgba(0, 0, 0, .2);
    border-radius: 10px;
    margin: 3% auto;
    /* 15% from the top and centered */
    width: 80%;
    max-width: 900px;
    height: fit-content;
  }


  /* Animate the content of the modal */
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.5s;
  animation-name: animatetop;
  animation-duration: 0.5s
}

.modal-content {
  display: flex;
  border-radius: 10px;
}

.modal-sidebar {
  border-radius: 10px 0 0 10px;
  width: 80px;
  min-height: 100vh;
  background: white;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11), 0 5px 15px 0 rgba(0, 0, 0, 0.08) !important;

  @media (min-width: 991px) {
    min-height: 500px;
  }

  justify-content: center;
  text-align: center;

  padding: 10px 0;

}

.modal-sidebar-link {
  padding: 14px 5px;

  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background-color: #eaeaea;
  }
}

.modal-sidebar-link--active {
  border-left: 2px solid #88ad3a;
  background-color: #f8f8f8;
}

.modal-tab-wrapper {
  width: 100%;
  padding: 15px 20px;
}

.modal-tab-content {
  margin-top: 15px;
}

.modal-tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  background-color: white;
  //border: gainsboro 1px solid;

  @media(min-width: 768px) {
    flex-direction: row;
  }
}

.custom-searchbar {
  width: 100%;
  border: 0;
  padding: .4rem 0;
  font-size: 1.5rem;

  &:focus {
    border: none;
    outline: none;
  }
}

@-webkit-keyframes animatetop {
  from {
    top: -10px;
    opacity: 0
  }

  to {
    top: 0;
    opacity: 1
  }
}

@keyframes animatetop {
  from {
    top: -10px;
    opacity: 0
  }

  to {
    top: 0;
    opacity: 1
  }
}
</style>
<template>
    <b-modal v-model="show_modal_feedback" no-close-on-backdrop size="xl" :title="isNew ? 'Add New Feedback' : 'Feedback'"
        hide-footer @close="handle_feedback_close">

        <div class="feedback">
            <div class="comment-holder">
                <div class="review-comment">
                    <template v-for="(item, key) in dataFeedback" :key="key">
                        <div class="comment-item">
                            <template v-if="item.picture">
                                <img :src="item.picture" :alt="`@${item.name}`" size="24" height="24" width="24"
                                    data-view-component="true" class="avatar avatar-user mt-1 float-left">
                            </template>
                            <template v-else>
                                <div class="avatar avatar-user no-picture">
                                    <!-- <span>{{ item.name.charAt(0) }}</span> -->
                                </div>
                            </template>

                            <div class="review-comment-contents js-suggested-changes-contents">
                                <h4 class="f5 text-normal d-inline">
                                    <strong>
                                        <a class="author Link--primary css-truncate-target" href="#">{{ item.name }}</a>
                                    </strong>
                                    <span class="color-fg-muted">
                                        {{ formatDateString_(item.created_at) }}
                                    </span>
                                </h4>

                                <span aria-label="You are the author of this pull request." data-view-component="true"
                                    class="Label tooltipped tooltipped-multiline tooltipped-s person-name-label">
                                    {{ item.created_by_name }}
                                </span>

                                <div class="comment-body markdown-body soft-wrap  js-comment-body">
                                    <p dir="auto">{{ item.message }}</p>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div :class="`reply ${toggleFeedback ? 'open' : ''}`">
                <div class="inline-comment-form-actions">
                    <div class="d-table width-full">
                        <div class="d-table-cell">
                            <a class="d-inline-block" href="/"><img class="avatar avatar-user"
                                    src="https://avatars.githubusercontent.com/u/23514360?s=56&amp;v=4" width="28"
                                    height="28" alt="@donaderoyan"></a>
                        </div>
                        <div class="d-table-cell col-12">
                            <button type="button" @click="addFeedback"
                                class="review-thread-reply-button width-full color-fg-muted text-left form-control js-toggle-inline-comment-form">
                                Write your feedback
                            </button>
                        </div>
                    </div>
                </div>
                <div class="inline-comment-form-box">
                    <b-form-group class="mb-3" label="Write your feedback" label-for="textarea-feedback">
                        <b-form-textarea id="textarea-feedback" v-model="edit_feedback.message"
                            :state="edit_feedback.message" max-rows="15" rows="3"></b-form-textarea>
                    </b-form-group>
                </div>
                <div class="button-group">
                    <button class="btn btn-link btn-sm text-decoration-none fw-bold text-primary" @click="cancelHandler">
                        Cancel
                    </button>
                    <button class="btn btn-link btn-sm text-decoration-none fw-bold text-primary" @click="submitHandler">
                        Submit
                    </button>
                </div>
            </div>
        </div>

    </b-modal>
</template>
<script>
import { is } from '@babel/types'
import { FeedbackApi } from "@/api";
import { useAccountStore } from '@/stores/account';
const store = useAccountStore();
import { formatDateString } from "@/helpers/stringHelpers";
import { FeedbackStatusOptions } from "@/types/Feedback";

export default {
    mixins: [FeedbackApi],
    data() {
        return {
            articleId: null,
            isNew: false,
            feedbackObject: null,
            show_modal_feedback: false,
            dataFeedback: [],
            edit_feedback: {
                name: "",
                message: ""
            },
            toggleFeedback: false
        }
    },
    methods: {
        showSpinner() {
            this.$bus.$emit('showSpinner', true)
        },
        hideSpinner() {
            this.$bus.$emit('showSpinner', false)
        },
        formatDateString_(date) {
            return formatDateString(date)
        },
        addFeedback() {
            this.toggleFeedback = !this.toggleFeedback
        },
        openModal(articleId, data, isNew) {
            this.resetComponent();
            if (!isNew) {
                this.feedbackObject = JSON.parse(JSON.stringify(data));
                this.dataFeedback = this.feedbackObject.messages;
            }

            this.articleId = articleId;
            this.show_modal_feedback = true
            this.isNew = isNew || false;
        },
        handle_feedback_close() {
            this.resetComponent()
            this.show_modal_feedback = false
        },
        resetInputBox() {
            this.edit_feedback = {
                name: "",
                message: ""
            }
        },
        resetComponent() {
            this.edit_feedback = {
                name: "",
                message: ""
            }
            this.dataFeedback = []
        },
        cancelHandler() {
            this.toggleFeedback = false
            this.show_modal_feedback = false
            this.resetComponent()
        },
        createNewFeedback(feedbackItem, message) {
            this.showSpinner();
            this.postFeedback(feedbackItem).then(response => {
                const createdFeedback = response.data;
                this.createNewMessage(createdFeedback.id, createdFeedback.created_by, message).then(response => {
                    this.hideSpinner();
                    this.$bus.$emit('newFeedbackCreated', {})
                    this.handle_feedback_close();
                }).catch(err => {
                    console.log(err)
                });
            }).catch(err => {
                console.log(err)
            });
        },
        createNewMessage(feedbackId, createdById, message) {
            const messagePayload = {
                feedback: feedbackId,
                message: message,
                created_by: createdById
            }
            return this.postFeedbackMessage(messagePayload);
        },
        submitHandler() {
            if (this.edit_feedback['message'] == "") { return }
            const message = this.edit_feedback['message'];

            if (this.isNew) {
                const newFeedbackItem = {
                    "status": FeedbackStatusOptions.NEW,
                    "created_by": store.getCurrentUser.id,
                    "created_at": new Date().toISOString(),
                    "modified_at": new Date().toISOString(),
                    "article": this.articleId
                }
                this.createNewFeedback(newFeedbackItem, message);
            } else {
                if (this.feedbackObject.id) {
                    this.showSpinner();
                    this.createNewMessage(this.feedbackObject.id, store.getCurrentUser.id, message).then(response => {
                        this.hideSpinner();
                        if (response.status === 200 || response.status === 201) {
                            this.$bus.$emit('newFeedbackCreated', {})
                            this.dataFeedback.unshift(response.data)
                        }
                    }).catch(err => {
                        console.log(err)
                    });
                }
            }
            this.resetInputBox()
        }
    }
}
</script>
<style>
.feedback {
    border: 1px solid var(--bs-border-color);
    border-radius: 0.3rem;
}

.comment-holder {
    padding: 8px 16px;
}

.reply {
    padding: 8px 16px;
    border-top: 1px solid var(--ag-row-border-color);
    border-radius: 0 0 6px 6px;
    margin-bottom: 0.3rem;
}

.inline-comment-form-actions {
    display: block;
}

.inline-comment-form-box {
    display: none;
}

.reply.open .inline-comment-form-actions {
    display: none;
}

.reply.open .inline-comment-form-box {
    display: block;
}

.d-table {
    display: table !important;
}

.d-table-cell {
    display: table-cell !important;
}

.d-inline-block {
    display: inline-block !important;
}

.avatar {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: var(--primer-borderRadius-medium, 6px);
    box-shadow: 0 0 0 1px var(--color-avatar-border);
    display: inline-block;
    flex-shrink: 0;
    line-height: 1;
    overflow: hidden;
    vertical-align: middle;
}

.avatar-user {
    border-radius: 50% !important;
}

.avatar.no-picture {
    width: 24px;
    height: 24px;
    border: 1px solid var(--bs-border-color);
    background: var(--bs-border-color);
    text-align: center;
    margin-top: 0.2rem;
}

.avatar.no-picture span {
    line-height: .1rem;
    text-transform: capitalize;
    font-size: .6rem;
}

.review-thread-reply-button {
    display: inline-block;
    min-height: 28px;
    padding: 4px 8px;
    margin-left: 8px;
    cursor: text;
}

.text-left {
    text-align: left !important;
}

.color-fg-muted {
    /* color: var(--color-fg-muted) !important; */
}

.inline-comment-form {
    border: 1px solid #dfe2e5;
    border-radius: 6px;
}

.comment-item {
    position: relative;
    display: flex;
    /* margin-bottom: 1rem; */
}

.comment-item:last-of-type {
    margin-bottom: 0;
}

.review-comment-contents {
    padding-left: 1rem;
}

.review-comment-contents h4 {
    font-size: .9rem;
}

.feedback .button-group {
    display: flex;
    justify-content: end;
}

.person-name-label {
    margin-left: 5px;
}
</style>
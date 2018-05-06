import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

import { BpmnDefinitions } from "../imports/BpmnDefinitions";

console.log(BpmnDefinitions);

const bpmnSchema = new SimpleSchema({
  title: String,
  data: {
    type: String,
    autoform: {
      type: 'bpmn',
    }
  },
  updatedAt: {
    type: Date,
    autoform: {
      type: 'hidden',
    }
  },
});

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.preview = new ReactiveVar();
  this.current = new ReactiveVar();
  this.create = new ReactiveVar();
});

Template.hello.helpers({
  create() {
    return Template.instance().create.get();
  },
  counter() {
    return Template.instance().counter.get();
  },
  schema() {
    return bpmnSchema;
  },
  hasPreview(id) {
    return Template.instance().preview.get() === id;
  },
  preview(id) {
    const doc = BpmnDefinitions.findOne(id);
    //return JSON.stringify(doc, null, 2);
    return doc.data;
  },
  isCurrent(id) {
    const current = Template.instance().current.get();
    return current && current === id;
  },
  current() {
    return Template.instance().current.get();
  },
  doc() {
    const current = Template.instance().current.get();
    return BpmnDefinitions.findOne(current);
  },
  definitions() {
    return BpmnDefinitions.find();
  },
  toDate(date) {
    return new Date(date).toLocaleString();
  },
});

Template.hello.events({
  'submit #bpmnForm'(event, templateInstance) {
    event.preventDefault();
    const form = AutoForm.getFormValues('bpmnForm');
    const { insertDoc } = form;
    insertDoc.updatedAt = new Date();
    BpmnDefinitions.insert(insertDoc);
    templateInstance.create.set(false);
  },

  'submit #bpmnUpdateForm'(event, templateInstance) {
    event.preventDefault();
    const form = AutoForm.getFormValues('bpmnUpdateForm');
    const { updateDoc } = form;
    updateDoc.$set.updatedAt = new Date();

    const docId = templateInstance.current.get();
    BpmnDefinitions.update(docId, { $set: updateDoc.$set });
    templateInstance.current.set(null);
  },

  'click .edit-file'(event, templateInstance) {
    event.preventDefault();
    const target = $(event.currentTarget).attr('data-target');
    templateInstance.create.set(false);
    templateInstance.current.set(target);
  },

  'click .delete-file'(event, templateInstance) {
    event.preventDefault();
    const target = $(event.currentTarget).attr('data-target');

    if (BpmnDefinitions.remove(target)) {
      const current = templateInstance.current.get();
      if (target === current) templateInstance.current.set(null);

      const currentPreview = templateInstance.preview.get();
      if (target === currentPreview) templateInstance.preview.set(null);
    }
  },

  'click #createbutton'(event, templateInstance) {
    event.preventDefault();
    templateInstance.current.set(null)
    templateInstance.create.set(true);
  },

  'click .toggle-preview'(event, templateInstance) {
    event.preventDefault();
    const target = $(event.currentTarget).attr('data-target');
    const currentPreview = templateInstance.preview.get();
    templateInstance.preview.set(currentPreview === target ? null : target);
  }
});


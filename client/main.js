import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import SimpleSchema from 'simpl-schema';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

SimpleSchema.extendOptions(['autoform']);

const bpmnSchema = new SimpleSchema({
  data: {
    type: String,
    autoform: {
      type: 'bpmn',
    }
  }
});

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.xml = new ReactiveVar('');
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  schema() {
    return bpmnSchema;
  },
  xml() {
    return Template.instance().xml.get();
  }
});

Template.hello.events({
  'submit #bpmnForm'(event, templateInstance) {
    event.preventDefault();
    const form = AutoForm.getFormValues('bpmnForm');
    templateInstance.xml.set(form.insertDoc.data);
  },
});


import { Controller } from "stimulus";

export default class extends Controller {

  static targets = [ "checkbox" ]

  connect() {
    this.element[this.identifier] = this;
  }

  get checked() {
    return this.checkboxTargets.filter(e => e.checked).map(e => e.value);
  }
}

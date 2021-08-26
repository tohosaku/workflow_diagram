import { Controller } from "stimulus";

export default class extends Controller {

  static targets = [ "element" ]

  connect() {
    this.element[this.identifier] = this;
  }

  get value() {
      return this.elementTarget.value
  }
}

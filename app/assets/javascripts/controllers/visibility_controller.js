import { Controller } from "stimulus";

export default class extends Controller {

  static targets = [ "element" ]
  static classes = [ "hidden" ];

  connect() {
    $(this.element).on('select2:select', (e) => {
      const el = e.params.data.element.parentElement
      const event = new Event('change', { bubbles: true })
      el.dispatchEvent(event);
    })
  }

  toggle(evt) {
    evt.preventDefault();
    this.elementTargets.forEach(elm => {
      elm.classList.toggle(this.hiddenClass);
    })
  }
}
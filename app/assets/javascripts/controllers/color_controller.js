import { Controller } from "stimulus";

export default class extends Controller {

    static values = { bgcolor: String, bordercolor: String }
    static targets = [ 'marker', 'checkbox' ];

    connect() {
        this.element[this.identifier] = this;
        if (this.bgcolorValue == '') {
            this.bgcolorValue = '#fff'
        }
        if (this.bordercolorValue == '') {
            this.bordercolorValue = '#bcc3ce'
        }
    }

    colorize(e) {
        const value = e.target.value
        const idx = this.checkboxTargets.findIndex((n) => n.value === value)
        const marker = this.markerTargets[idx]

        const color = e.target.dataset.color;

        if (e.target.checked) {
            marker.style.backgroundColor = color
            marker.style.borderColor = color
        } else {
            marker.style.backgroundColor = this.bgcolorValue
            marker.style.borderColor = this.bordercolorValue
        }
    }
}
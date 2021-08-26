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
        this.confirm()
    }

    colorize(e) {
        const value = e.target.value
        const idx = this.checkboxTargets.findIndex((n) => n.value === value)
        const marker = this.markerTargets[idx]

        const color = e.target.dataset.color;

        this.setColor(e.target.checked, marker, color)
    }

    confirm() {
        this.checkboxTargets.forEach((n, i) => {
            const marker = this.markerTargets[i];
            const color = n.dataset.color;
            this.setColor(n.checked, marker, color)
        })
    }

    setColor(checked, marker, color) {
        if (checked) {
            marker.style.backgroundColor = color
            marker.style.borderColor = color
        } else {
            marker.style.backgroundColor = this.bgcolorValue
            marker.style.borderColor = this.bordercolorValue
        }
    }

    get colormap() {
        const func = (cmap, n) => {
            cmap[n.value] = n.dataset.color
            return cmap
        }
        return this.checkboxTargets.reduce(func, {})
    }
}
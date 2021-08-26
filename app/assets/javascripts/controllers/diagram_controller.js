import { Controller } from "stimulus";
import { setGraph } from '../graph';

export default class extends Controller {

  static targets = [ 'filter', 'checker' ]
  static values = { url: String, container: String }

  apply(e) {
    e.stopPropagation();
    const state = this.getState()
    this.showGraph(this.urlValue, this.containerValue, state.data, state.colormap)
  }

  getState() {
    const keyname = this.filter.dataset.keyname;
    const key = this.filter.filter.value;

    const values = this.checker.checkbox.checked;
    const colormap = this.checker.color.colormap

    return {
       data: { keyname: keyname, key: key, values: values},
       colormap: colormap
    }
  }

  showGraph(url, container_id, data, colormap) {
    $.ajax({
      url: url,
      type: 'get',
      data: data
    }).done((graph) =>
        setGraph(container_id, graph, colormap)
    );
  }

  get filter() {
    return this.filterTargets.find(e => e.visibility.visible());
  }

  get checker() {
    return this.checkerTargets.find(e => e.visibility.visible());
  }
}

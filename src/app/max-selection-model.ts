import { SelectionModel } from '@angular/cdk/collections';

export class MaxSelectionModel<T> extends SelectionModel<T> {
  constructor(
    multiple = false,
    initiallySelectedValues?: T[],
    emitChanges = false,
    private _max?: number,
    private _level?: number) {
    super(multiple, initiallySelectedValues, emitChanges);
    if (this._max === undefined || this._max === null) {
      this._max = -1;
    }
    if (this._level === undefined || this._level === null) {
      this._level = -1;
    }
  }

  select(value: T): void {
    if (!this.checkAdd(value)) {
      return;
    }
    /*if (this.selected.length === this._max) {
      this.deselect(this.selected[0]);
    }*/
    super.select(value);
  }

  checkAdd(value: T) {
    if (this._max === -1) {
      return true;
    }
    if (this._level === -1) {
      if (this.selected.length < this._max) {
        return true;
      } else {
        return false;
      }
    } else {
      const featureSelected = new Array();
      this.selected.forEach((sel: any) => {
        if (featureSelected.indexOf(sel.idFeature) === -1) {
          featureSelected.push(sel.idFeature);
        }
      });
      if (featureSelected.indexOf(value['idFeature']) == -1 && featureSelected.length >= this._max) {
        return false;
      } else {
        return true;
      }
    }

  }

  setMax(max: number): void {
    if (max !== undefined && max != null && max > -1) {
      this._max = max;
    }
  }

  setLevel(level: number): void {
    // console.log('setlevel');
    if (level !== undefined && level != null && level > -1) {
      this._level = level;
    }
  }

  getNumSelected() {
    return this.selected.length;
  }

  getSelected() {
    return this.selected;
  }

  getNumSelectedLevel() {
    if (this._level > -1) {
      const featureSelected = new Array();
      this.selected.forEach((sel: any) => {
        if (featureSelected.indexOf(sel.idFeature) === -1) {
          featureSelected.push(sel.idFeature);
        }
      });
      return featureSelected.length;
    }
    return this.selected.length;
  }

  getFeatureSelected(node) {
    const featureSelected = new Array();
    this.selected.forEach((sel: any) => {
      if (featureSelected.indexOf(sel.idFeature) === -1) {
        featureSelected.push(sel.idFeature);
      }
    });
    return featureSelected.indexOf(node.idFeature) !== -1;
  }
}

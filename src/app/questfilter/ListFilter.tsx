import {noop} from 'lodash-es';
import {h, RenderableProps, VNode} from 'preact';
import {memo} from 'preact/compat';
import {listUnstyled} from '../bs-partial.scss';
import {LabeledCheckbox} from '../util/LabeledCheckbox';
import {listFilter as containerCss} from './ListFilter.scss';

interface Props<T> {
  options: [T, string][];

  value: T[] | null;

  onChange?(v: T[] | null): void;
}

function ListFilter<T>({value, options, onChange}: RenderableProps<Props<T>>): VNode {
  if (!value) {
    value = [];
  }

  return (
    <ul class={`${listUnstyled} ${containerCss}`}>{
      options.map(([v, label]) => {
        function listener(evt: Event): void {
          const checked = (evt.target as HTMLInputElement).checked;
          if (checked) {
            if (!value!.includes(v)) {
              onChange!(value!.concat(v));
            }
          } else {
            const idx = value!.indexOf(v);
            if (idx !== -1) {
              const newValue = value!.slice();
              newValue.splice(idx, 1);
              onChange!(newValue.length ? newValue : null);
            }
          }
        }

        return (
          <li key={label}>
            <LabeledCheckbox onChange={listener}
                             checked={value!.includes(v)}>{label}</LabeledCheckbox>
          </li>
        );
      })
    }</ul>
  );
}

ListFilter.defaultProps = {
  onChange: noop
};

const memoed = memo(ListFilter);

export {memoed as ListFilter};

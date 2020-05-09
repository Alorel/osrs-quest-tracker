import {ComponentChildren, Fragment, h, VNode} from 'preact';
import {useCallback, useState} from 'preact/hooks';
import {btn, btnPrimary} from '../../bs-partial.scss';
import {BsModalProps} from '../../layout/BsModal';

interface Props {
  children: ComponentChildren;

  renderModal(onHide: Required<BsModalProps>['onHide']): VNode;
}

export function ImportExportButton({renderModal, children: btnText}: Props): VNode {
  const [showing, setShowing] = useState(false);
  const show = useCallback((e: Event) => {
    (e.target as HTMLButtonElement).blur();
    setShowing(true);
  }, [setShowing]);
  const hide = useCallback(() => {
    setShowing(false);
  }, [setShowing]);

  return (
    <Fragment>
      <button type={'button'}
              class={`${btn} ${btnPrimary}`}
              onClick={show}>{btnText}</button>
      {showing && renderModal(hide)}
    </Fragment>
  );
}

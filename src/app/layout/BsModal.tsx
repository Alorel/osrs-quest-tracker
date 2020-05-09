import {noop} from 'lodash-es';
import {ComponentChildren, h, VNode} from 'preact';
import {createPortal} from 'preact/compat';
import {useEffect, useState} from 'preact/hooks';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {
  btn,
  btnSecondary,
  close as closeCss,
  fade,
  modal as modalCss,
  modalBackdrop,
  modalBody,
  modalContent,
  modalDialog,
  modalFooter,
  modalHeader,
  modalOpen,
  modalTitle,
  show as showCss
} from '../bs-partial.scss';
import {isTruthy} from '../util/isTruthy';

const bod = document.body;

export interface BsModalProps {
  children: ComponentChildren;

  footer?: ComponentChildren;

  show?: boolean;

  title: ComponentChildren;

  onHide?(): void;
}

const modalContainer = document.createElement('div');
bod.appendChild(modalContainer);

function hasChild(el: ChildNode): boolean {
  return Array.from(modalContainer.childNodes).includes(el);
}

const numOpenModals$ = new BehaviorSubject(0);

const backdropElement = document.createElement('div');
backdropElement.className = `${modalBackdrop} ${fade} ${showCss}`;

numOpenModals$
  .pipe(
    map(isTruthy),
    debounceTime(25),
    distinctUntilChanged()
  )
  .subscribe(hasModals => {
    if (hasModals) {
      bod.classList.add(modalOpen);
      bod.appendChild(backdropElement);
    } else {
      bod.classList.remove(modalOpen);
      try {
        document.body.removeChild(backdropElement);
      } catch {
        //noop
      }
    }
  });

function BsModal({show, footer: footerChildren, onHide, title, children}: BsModalProps): VNode {
  const [el] = useState<HTMLDivElement>(createModal);
  useEffect(() => {
    if (!show) {
      el.classList.remove(showCss);
      return;
    }

    el.classList.add(showCss);
    if (!hasChild(el)) {
      modalContainer.appendChild(el);
    }
    numOpenModals$.next(numOpenModals$.value + 1);

    return () => {
      numOpenModals$.next(numOpenModals$.value - 1);
      if (hasChild(el)) {
        modalContainer.removeChild(el);
      }
    };
  }, [show]);

  return createPortal(
    (
      <div class={modalDialog} role={'document'}>
        <div class={modalContent}>
          <header class={modalHeader}>
            <h5 class={modalTitle}>{title}</h5>
            <button type={'button'} class={closeCss} aria-label={'Close'} onClick={onHide!}>
              <span aria-hidden={'true'}>×</span>
            </button>
          </header>
          <div class={modalBody}>{children}</div>
          <footer class={modalFooter}>
            <button type={'button'} class={`${btn} ${btnSecondary}`} onClick={onHide!}>Close</button>
            {footerChildren}
          </footer>
        </div>
      </div>
    ),
    el
  );
}

BsModal.defaultProps = {
  onHide: noop,
  show: true
} as Partial<BsModalProps>;

export {BsModal};

function createModal(): HTMLDivElement {
  const out = document.createElement('div');
  out.className = `${modalCss} ${fade}`;
  out.tabIndex = -1;
  out.setAttribute('role', 'dialog');
  out.setAttribute('aria-modal', 'true');

  return out;
}

import {h, VNode} from 'preact';
import {useCallback, useRef, useState} from 'preact/hooks';
import {btn, btnPrimary, formControl, textCenter, textDanger} from '../../bs-partial.scss';
import {BsModal, BsModalProps} from '../../layout/BsModal';
import {profile$} from '../profile';
import {ImportExportButton} from './ImportExportButton';
import {ImportExportInfoText} from './ImportExportInfoText';

function createImportModal(onHide: Required<BsModalProps>['onHide']): VNode {
  const [error, setError] = useState<string | null>(null);
  const ta = useRef<HTMLTextAreaElement>();
  const doImport = useCallback(() => {
    let value: any;
    try {
      value = JSON.parse(ta.current!.value);
    } catch (e) {
      console.error(e);
      setError(e.message);

      return;
    }

    profile$.next(value);
    onHide();
  }, [onHide, ta, setError]);

  return (
    <BsModal onHide={onHide}
             footer={<button type={'button'} class={`${btn} ${btnPrimary}`} onClick={doImport}>Import</button>}
             title={'Profile Import'}>
      <div class={textCenter}>
        <ImportExportInfoText/>
        <textarea ref={ta}
                  class={formControl}
                  autocomplete={'off'}
                  autofocus
                  placeholder={'Paste an import into this textarea and click "import"'}/>
        {error && <div class={textDanger}>{error}</div>}
      </div>
    </BsModal>
  );
}

export function DataImport(): VNode {
  return <ImportExportButton renderModal={createImportModal}>Import Profile</ImportExportButton>;
}

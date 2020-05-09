import {h, VNode} from 'preact';
import {textCenter, formControl} from '../../bs-partial.scss';
import {BsModal, BsModalProps} from '../../layout/BsModal';
import {profile$} from '../profile';
import {ImportExportButton} from './ImportExportButton';
import {ImportExportInfoText} from './ImportExportInfoText';

function createExportModal(onHide: Required<BsModalProps>['onHide']): VNode {
  // typings incorrect
  const taProps: any = {
    autocomplete: 'off',
    class: formControl,
    autofocus: true,
    readonly: true
  };

  return (
    <BsModal onHide={onHide}
             title={'Profile Export'}>
      <div class={textCenter}>
        <ImportExportInfoText/>
        <p>Save this somewhere and use it with the import button later</p>
        <textarea {...taProps}>{JSON.stringify(profile$.value)}</textarea>
      </div>
    </BsModal>
  );
}

export function DataExport(): VNode {
  return <ImportExportButton renderModal={createExportModal}>Export Profile</ImportExportButton>;
}

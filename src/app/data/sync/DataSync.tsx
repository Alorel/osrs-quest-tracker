import {staticComponent} from '@alorel/preact-static-component';
import {h, VNode} from 'preact';
import {useCallback, useState} from 'preact/hooks';
import {v4 as uuid} from 'uuid';
import {autoWidth, displayInline, fullwidth} from '../../app.scss';
import {btn, btnGroup, btnPrimary, btnSecondary, formControl, formGroup, ml1} from '../../bs-partial.scss';
import {useFieldId} from '../../util/useFieldId';
import './do-sync';
import {forceProfileSync$} from './do-sync';
import {fetchSyncId, onSyncFetched} from './fetchSyncId';
import {syncId$, useSyncId} from './syncId';

export const DataSync = staticComponent(function DataSync(): VNode {
  const inputId = useFieldId('profile-');
  const [stagedValue, setStagedValue] = useState(syncId$.value);
  const onInput = useCallback((e: Event): void => {
    setStagedValue((e.target as HTMLInputElement).value);
  }, [setStagedValue]);

  const [id, setId] = useSyncId();
  const create = useCallback(() => {
    if (id) {
      return;
    }

    const val = `oqt_${uuid().replace(/-/g, '_')}`;
    setId(val);
    setStagedValue(val);
    forceProfileSync$.next();
  }, [!!id, setId, setStagedValue]);
  const onSetClick = useCallback(() => {
    setId(stagedValue);
    fetchSyncId(stagedValue).subscribe(onSyncFetched);
  }, [setId, stagedValue]);

  return (
    <div class={formGroup}>
      <div>
        <label for={inputId}>
          <span aria-label={'Sync quest completion data across devices'}
                data-balloon-pos={'left'}>[?]</span>
          <span class={ml1}>Sync ID:</span>
        </label>
        <input id={inputId}
               class={`${formControl} ${displayInline} ${autoWidth} ${ml1}`}
               value={stagedValue}
               onInput={onInput}/>
      </div>
      <div class={`${btnGroup} ${fullwidth}`}>
        <button type={'button'}
                disabled={!stagedValue}
                onClick={onSetClick}
                class={`${btn} ${btnPrimary}`}>
          Set
        </button>
        <button type={'button'}
                disabled={!!id || !!stagedValue}
                onClick={create}
                class={`${btn} ${btnSecondary}`}>
          Create
        </button>
      </div>
    </div>
  );
});

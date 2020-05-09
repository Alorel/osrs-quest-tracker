import {staticComponent} from '@alorel/preact-static-component';
import {h, VNode} from 'preact';

export const ImportExportInfoText = staticComponent(function ImportExportInfoText(): VNode {
  return <p>Contains your user profile: the character name+mode & completed quests</p>;
});

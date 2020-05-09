import {h, VNode} from 'preact';
import * as icons from '../rs-icon.scss';

interface Props {
  icon: string;
}

export function RsIcon({icon}: Props): VNode {
  if (!icons[icon]) {
    throw new Error(`Unknown icon: ${icon}`);
  }

  return <i class={`${icons.rsIcon} ${icons[icon]}`}
            aria-label={icon}
            role={'image'}/>;
}

import {staticComponent} from '@alorel/preact-static-component';
import {h, VNode} from 'preact';
import {host as style, lg, sm} from './spinner.scss';

interface SpinnerProps {
  className?: string;

  large?: boolean;
}

const BaseSpinner = staticComponent(function BaseSpinner(): VNode {
  return (
    <svg viewBox='0 0 66 66' xmlns='http://www.w3.org/2000/svg'>
      <circle
        fill='none'
        strokeWidth='6'
        strokeLinecap='round'
        cx='33'
        cy='33'
        r='30'
      />
    </svg>
  );
});

export function Spinner({className, large}: SpinnerProps): VNode {
  return (
    <div class={`${style} ${className || large ? lg : sm}`}>
      <BaseSpinner/>
    </div>
  );
}

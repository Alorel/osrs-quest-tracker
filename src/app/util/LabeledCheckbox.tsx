import {Fragment, h, RenderableProps, VNode} from 'preact';
import {JSXInternal} from 'preact/src/jsx';

export function LabeledCheckbox(
  {children, ...props}: RenderableProps<JSXInternal.HTMLAttributes<HTMLInputElement>>
): VNode {
  const labelProps = props.id ? {for: props.id} : {};

  return (
    <Fragment>
      <label {...labelProps}>
        <input type="checkbox" {...props}/>
        <span>{children}</span>
      </label>
    </Fragment>
  );
}

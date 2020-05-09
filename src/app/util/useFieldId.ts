import {useEffect, useState} from 'preact/hooks';

let counter = 0;

function generate(prefix: string): string {
  const out = prefix + counter.toString(36);
  counter++;

  return out;
}

export function useFieldId(prefix = 'el-'): string {
  const [value, setValue] = useState(() => generate(prefix));

  useEffect(() => {
    if (!value.startsWith(prefix)) {
      setValue(generate(prefix));
    }
  }, [prefix, value]);

  return value;
}

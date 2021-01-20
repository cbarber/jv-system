import React from 'react';

import th from 'ui/theme';

const Close = ({
  fill = th.colors.brand.secondary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      height="311pt"
      viewBox="0 0 311 311.077"
      width="311pt"
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      {...rest}
    >
      <path d="M16.035 311.078c-4.097 0-8.195-1.558-11.308-4.695-6.25-6.25-6.25-16.383 0-22.633L283.789 4.687c6.25-6.25 16.383-6.25 22.633 0s6.25 16.383 0 22.637L27.363 306.383a16.045 16.045 0 01-11.328 4.695zm0 0" />
      <path d="M295.117 311.078a15.879 15.879 0 01-11.308-4.695L4.727 27.324c-6.25-6.254-6.25-16.386 0-22.636s16.382-6.25 22.636 0L306.422 283.75c6.25 6.25 6.25 16.383 0 22.633-3.137 3.117-7.23 4.695-11.305 4.695zm0 0" />
    </svg>
  );
};

export default Close;

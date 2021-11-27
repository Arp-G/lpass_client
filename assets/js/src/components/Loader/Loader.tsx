import React, { FC } from 'react';

interface Props {
  width?: number,
  height?: number
}

const Loader: FC<Props> = ({ width = 6, height = 6 }) => {
  const dimensions = `w-${width} h-${height}`;
  return (
    <div className="flex mt-2 items-center justify-center space-x-2 animate-bounce">
      <div className={`${dimensions} bg-red-600 rounded-full`}></div>
      <div className={`${dimensions} bg-green-600 rounded-full`}></div>
      <div className={`${dimensions} bg-blue-600 rounded-full`}></div>
    </div>);
}

export default Loader;

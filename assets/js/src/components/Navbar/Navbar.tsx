import React, { FC } from 'react';
import { MdLogout } from 'react-icons/md'

interface Props {
  // any props that come into the component
}
const Navbar: FC<Props> = () => {

  return (
    <div className="flex w-screen h-16 bg-red-600 font-semibold text-3xl justify-center items-center">
      <div className="m-auto"> Lastpass </div>
      <div className="pr-2"> <MdLogout /> </div>
    </div>
  );
};

export default Navbar;

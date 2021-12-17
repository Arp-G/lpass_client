import React, { FC } from 'react';
import { RiShieldStarFill } from 'react-icons/ri';
import Loader from '../Loader/Loader';

interface Props { }

const SplashScreen: FC<Props> = () => (
  <div className="h-screen bg-custom-yellow bg-red-gradient animate-gradient-xy flex flex-col justify-center">
    <div className="m-auto">
      <div className="m-auto text-5xl font-semibold italic pb-3"> Lastpass Client </div>
      <RiShieldStarFill className="m-auto text-8xl text-red-600" />
      <div className="text-center text-xl font-semibold pt-3 pb-2"> Loading </div>
      <Loader />
    </div>
  </div>
);


export default SplashScreen;

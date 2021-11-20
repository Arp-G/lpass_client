import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
interface Props {
  // any props that come into the component
}

const Home: FC<Props> = () => {
  const dispatch = useDispatch();

  return (
    <div>
      Home
    </div>
  );
};

export default Home;

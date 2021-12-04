import React, { FC, ReactElement } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import useAppSelector from './src/hooks/useAppSelector';

export type ProtectedRouteProps = {
  component: FC<any>
} & RouteProps;

export default ({ component: Component, ...rest }: ProtectedRouteProps): ReactElement<RouteProps> => {
  const token = useAppSelector(state => state.main.token);
  return (
    <Route
      {...rest}
      render={props => (
        token
          ? <Component {...props} />
          : <Redirect to={{ pathname: '/sign_in', state: { from: props.location } }} />
      )}
    />
  );
};

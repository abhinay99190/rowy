import { useAtom } from "jotai";
import { useLocation, Navigate } from "react-router-dom";

import Loading from "@src/components/Loading";

import { globalScope, currentUserAtom } from "@src/atoms/globalScope";
import { ROUTES } from "@src/constants/routes";

export interface IRequireAuthProps {
  children: React.ReactElement;
}

export default function RequireAuth({ children }: IRequireAuthProps) {
  const [currentUser] = useAtom(currentUserAtom, globalScope);
  const location = useLocation();

  if (currentUser === undefined)
    return <Loading fullScreen message="Authenticating" />;

  const redirect =
    (location.pathname ?? "") + (location.search ?? "") + (location.hash ?? "");

  if (currentUser === null)
    return (
      <Navigate
        to={ROUTES.auth + `?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    );

  return children;
}

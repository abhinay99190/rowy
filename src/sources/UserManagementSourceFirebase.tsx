import { memo } from "react";

import useFirestoreCollectionWithAtom from "@src/hooks/useFirestoreCollectionWithAtom";
import {
  globalScope,
  allUsersAtom,
  updateUserAtom,
} from "@src/atoms/globalScope";
import { USERS } from "@src/config/dbPaths";

/**
 * When rendered, provides atom values for top-level tables
 */
const UserManagementSourceFirebase = memo(
  function UserManagementSourceFirebase() {
    useFirestoreCollectionWithAtom(allUsersAtom, globalScope, USERS, {
      updateDocAtom: updateUserAtom,
    });

    return null;
  }
);

export default UserManagementSourceFirebase;

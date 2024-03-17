import React, { createContext } from 'react';

interface IUserData {
  id?: number | null;
  email?: string | null;
}

interface UserData {
  user?: IUserData | null;
  setUser: React.Dispatch<React.SetStateAction<IUserData | null>>;
}

export const UserContext = createContext<UserData>({
  user: null,
  setUser: () => {}
});

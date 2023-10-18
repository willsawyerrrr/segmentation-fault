import { createContext } from "react";

import { User } from "../api/schemas";

interface CurrentUserContextProps {
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const CurrentUserContext = createContext<CurrentUserContextProps>({
    currentUser: null,
    setCurrentUser: () => {},
});

CurrentUserContext.displayName = "CurrentUserContext";

export default CurrentUserContext;

import { createContext } from "react";
import { Student, Professor } from '../../Models/User/user.entity';

export const UserContext = createContext<{
	user: Professor | Student | null;
	setUser: (user: Professor | Student | null) => void;
}>({ user: null, setUser: () => {} });
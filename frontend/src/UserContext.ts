import { createContext } from "react";
import { Professor, Student } from './Models/User';

export const UserContext = createContext<{
	user: Professor | Student | null;
	setUser: (user: Professor | Student | null) => void;
}>({ user: null, setUser: () => {} });
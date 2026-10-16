import { createContext, useContext, type ReactNode } from "react";
import { useEmployeeSocket } from "@/hooks/useEmployeeSocket";

type RemoteValue = ReturnType<typeof useEmployeeSocket>;

const EmployeeRemoteContext = createContext<RemoteValue | null>(null);

export function EmployeeRemoteProvider({ children }: { children: ReactNode }) {
  const value = useEmployeeSocket();
  return <EmployeeRemoteContext.Provider value={value}>{children}</EmployeeRemoteContext.Provider>;
}

export function useEmployeeRemote() {
  const value = useContext(EmployeeRemoteContext);
  if (!value) throw new Error("useEmployeeRemote requires EmployeeRemoteProvider");
  return value;
}

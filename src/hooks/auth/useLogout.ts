import { useRouter } from "expo-router";
import { clearSession, getRefreshToken } from "../../api/tokenStore";
import { stopSessionTimers } from "../../api/session";
import { disconnectSocket } from "../../api/socket";
import { queryClient } from "../../lib/queryClient";
import { route } from "../../lib/route";
import { authService } from "../../services/auth.service";

export function useLogout() {
  const router = useRouter();

  return async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await authService.logout({ refreshToken });
      } catch {
        /* best-effort server logout */
      }
    }
    stopSessionTimers();
    disconnectSocket();
    await clearSession();
    queryClient.clear();
    router.replace(route("/login"));
  };
}

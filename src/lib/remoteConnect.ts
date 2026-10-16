import * as Linking from "expo-linking";
import { updateTechnicianSession } from "../hooks/technicianSessionStore";
import { remoteSessionService } from "../services/remote-session.service";
import { toast } from "./toast";

const RUSTDESK_DOWNLOAD_URL = "https://rustdesk.com/download";

export async function openRustdesk(link: string): Promise<boolean> {
  try {
    const can = await Linking.canOpenURL(link);
    if (!can) {
      toast.error("RustDesk isn't installed", {
        description: "Install RustDesk, then try again.",
        action: {
          label: "Download",
          onClick: () => void Linking.openURL(RUSTDESK_DOWNLOAD_URL),
        },
      });
      return false;
    }
    await Linking.openURL(link);
    return true;
  } catch {
    toast.error("Could not open RustDesk", {
      description: "Install RustDesk, or open the link on a computer that has it.",
    });
    return false;
  }
}

export async function connectToSession(sessionId: string): Promise<void> {
  let connection;
  try {
    connection = await remoteSessionService.connection(sessionId);
  } catch {
    toast.error("Could not fetch connection details", {
      description: "Try again from the ticket.",
    });
    return;
  }

  const opened = await openRustdesk(connection.rustdeskLink);
  if (!opened) {
    updateTechnicianSession(sessionId, {
      status: "APPROVED",
      rustdeskLink: connection.rustdeskLink,
    });
    return;
  }

  try {
    await remoteSessionService.start(sessionId, {
      approvalToken: connection.approvalToken,
    });
    updateTechnicianSession(sessionId, { status: "ACTIVE" });
  } catch {
    toast.error("Could not start the session", {
      description: "The employee approved access, but starting it failed.",
    });
  }
}

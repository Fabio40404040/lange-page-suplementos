import { env } from "cloudflare:workers";
import { getChatGPTUser, requireChatGPTUser } from "./chatgpt-auth";

function configuredAdminEmail(): string | null {
  const email = env.ADMIN_EMAIL?.trim().toLowerCase();
  return email || null;
}

export async function requireAdminPage() {
  const user = await requireChatGPTUser("/admin");
  const allowedEmail = configuredAdminEmail();
  return {
    user,
    configured: Boolean(allowedEmail),
    authorized: Boolean(allowedEmail && user.email.toLowerCase() === allowedEmail),
  };
}

export async function isAdminRequest(): Promise<boolean> {
  const user = await getChatGPTUser();
  const allowedEmail = configuredAdminEmail();
  return Boolean(user && allowedEmail && user.email.toLowerCase() === allowedEmail);
}

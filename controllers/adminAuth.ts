export function isAdminRequest(request: Request): boolean {
  const token = process.env.ADMIN_TOKEN || (process.env.NODE_ENV !== "production" ? "rahulverse-local" : "");
  return Boolean(token) && request.headers.get("authorization") === `Bearer ${token}`;
}

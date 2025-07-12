"use client";
import { useUser } from "@auth0/nextjs-auth0";

export default function AuthStatus() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (user) {
    return (
      <div style={{ textAlign: "center" }}>
        <img src={user.picture} alt="Profile" style={{ borderRadius: "50%", width: 40, height: 40 }} />
        <span style={{ marginLeft: 8 }}>{user.name}</span>
        <a href="/auth/logout" style={{ marginLeft: 16 }}>Logout</a>
      </div>
    );
  }
  return <a href="/auth/login">Login</a>;
}

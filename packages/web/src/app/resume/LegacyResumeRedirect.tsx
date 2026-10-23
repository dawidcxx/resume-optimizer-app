import { Redirect, useParams } from "wouter";

export function LegacyResumeRedirect() {
  const { id } = useParams<"/resume/:id">();
  return <Redirect to={`/resumes/${id}/edit`} />;
}

export function LegacyResumeListRedirect() {
  return <Redirect to="/resumes" />;
}

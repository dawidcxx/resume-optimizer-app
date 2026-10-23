import { Redirect, useParams } from "wouter";

export function ResumeProjectRedirect() {
  const { id } = useParams<"/resume/:id">();
  return <Redirect to={`/resume/${id}/edit`} />;
}
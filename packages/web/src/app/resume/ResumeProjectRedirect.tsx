import { Redirect, useParams } from "wouter";

export function ResumeProjectRedirect() {
  const { id } = useParams<"/resumes/:id">();
  return <Redirect to={`/resumes/${id}/edit`} />;
}